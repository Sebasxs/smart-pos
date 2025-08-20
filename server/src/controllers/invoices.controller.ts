import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { PrecisionMath } from '../utils/precisionMath';

type InvoiceItemPayload = {
   id: string | null;
   description: string;
   price: number;
   quantity: number;
   originalPrice: number;
   discountPercentage: number;
   isPriceEdited: boolean;
   isDescriptionEdited: boolean;
};

type PaymentPayload = {
   method: 'cash' | 'bank_transfer' | 'account_balance' | 'credit_card';
   amount: number;
   reference_code?: string | null;
};

type CreateInvoiceBody = {
   customer: {
      name: string;
      taxId: string;
      email: string;
      city: string;
   };
   items: InvoiceItemPayload[];
   payments: PaymentPayload[];
   subtotal: number;
   discount: number;
   total: number;
};

export const createInvoice = async (req: Request<{}, {}, CreateInvoiceBody>, res: Response) => {
   const { customer, items, payments, subtotal, discount, total } = req.body;

   try {
      const userId = req.user?.id;

      if (!userId) {
         return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      // Validate payments array
      if (!payments || payments.length === 0) {
         return res.status(400).json({ error: 'Se requiere al menos un método de pago' });
      }

      // Validate total of payments matches invoice total
      const paymentsTotal = payments.reduce(
         (sum, p) => PrecisionMath.add(sum, p.amount),
         PrecisionMath.toDecimal(0),
      );

      const paymentsDiff = PrecisionMath.subtract(paymentsTotal, total).abs();
      if (PrecisionMath.compare(paymentsDiff, 0.01) > 0) {
         return res.status(400).json({
            error: 'El total de los pagos no coincide con el total de la factura',
            details: {
               paymentsTotal: PrecisionMath.toNumber(paymentsTotal),
               invoiceTotal: total,
            },
         });
      }

      // Validar que los valores estén dentro del rango permitido (DECIMAL(19,6))
      const allValues = [
         subtotal,
         discount,
         total,
         ...items.flatMap(item => [item.price, item.quantity, item.originalPrice]),
         ...payments.map(p => p.amount),
      ];

      for (const value of allValues) {
         if (!PrecisionMath.isValidDecimal(value)) {
            return res.status(400).json({
               error: `Valor numérico fuera de rango: ${value}. Máximo permitido: 9999999999999.999999`,
            });
         }
      }

      // ✅ RECALCULAR totales en el servidor (NO confiar en cliente)
      let calculatedSubtotal = PrecisionMath.toDecimal(0);

      for (const item of items) {
         const itemTotal = PrecisionMath.multiply(item.price, item.quantity);
         calculatedSubtotal = calculatedSubtotal.plus(itemTotal);
      }

      const calculatedTotal = PrecisionMath.subtract(calculatedSubtotal, discount);

      // ✅ VALIDAR diferencias entre cliente y servidor
      const subtotalDiff = PrecisionMath.subtract(subtotal, calculatedSubtotal).abs();
      const totalDiff = PrecisionMath.subtract(total, calculatedTotal).abs();

      const maxToleranceAbsolute = 0.01; // 1 centavo de tolerancia
      const maxTolerancePercent = 0.01; // 1% de tolerancia

      // Rechazar si subtotal difiere más del 1%
      if (PrecisionMath.compare(subtotalDiff, maxToleranceAbsolute) > 0) {
         const percentDiff = PrecisionMath.divide(subtotalDiff, calculatedSubtotal);

         if (PrecisionMath.compare(percentDiff, maxTolerancePercent) > 0) {
            console.error(
               `⚠️ SECURITY: Subtotal mismatch exceeds 1%:`,
               `Client=${subtotal}, Server=${PrecisionMath.toNumber(calculatedSubtotal)}`,
               `Diff=${PrecisionMath.toNumber(subtotalDiff)}`,
            );

            return res.status(400).json({
               error: 'Los totales no coinciden. Por favor, recarga la página y vuelve a intentar.',
               details: {
                  field: 'subtotal',
                  clientValue: subtotal,
                  serverValue: PrecisionMath.toNumber(calculatedSubtotal),
                  difference: PrecisionMath.toNumber(subtotalDiff),
               },
            });
         }

         // Log warning para diferencias pequeñas
         console.warn(
            `Subtotal minor mismatch: Client=${subtotal}, Server=${PrecisionMath.toNumber(
               calculatedSubtotal,
            )}`,
         );
      }

      // Rechazar si total difiere más del 1%
      if (PrecisionMath.compare(totalDiff, maxToleranceAbsolute) > 0) {
         const percentDiff = PrecisionMath.divide(totalDiff, calculatedTotal);

         if (PrecisionMath.compare(percentDiff, maxTolerancePercent) > 0) {
            console.error(
               `⚠️ SECURITY: Total mismatch exceeds 1%:`,
               `Client=${total}, Server=${PrecisionMath.toNumber(calculatedTotal)}`,
               `Diff=${PrecisionMath.toNumber(totalDiff)}`,
            );

            return res.status(400).json({
               error: 'El total de la factura no coincide con los cálculos del servidor. Por favor, recarga la página.',
               details: {
                  field: 'total',
                  clientValue: total,
                  serverValue: PrecisionMath.toNumber(calculatedTotal),
                  difference: PrecisionMath.toNumber(totalDiff),
               },
            });
         }

         // Log warning para diferencias pequeñas
         console.warn(
            `Total minor mismatch: Client=${total}, Server=${PrecisionMath.toNumber(
               calculatedTotal,
            )}`,
         );
      }

      const cleanItems = items.map(item => ({
         id: item.id && item.id.length === 36 ? item.id : null,
         quantity: item.quantity,
         price: item.price,
         description: item.description,
         applied_taxes: [],
      }));

      const cleanPayments = payments.map(p => ({
         method: p.method,
         amount: p.amount,
         reference_code: p.reference_code || null,
      }));

      const totals = {
         subtotal: PrecisionMath.toNumber(calculatedSubtotal),
         total: PrecisionMath.toNumber(calculatedTotal),
         discount: discount,
         tax: 0,
      };

      const customerData = {
         name: customer.name,
         tax_id: customer.taxId,
         email: customer.email,
         city: customer.city,
         phone: (customer as any).phone,
         address: (customer as any).address,
         document_type: (customer as any).documentType || '31',
      };

      const { data: openShift } = await supabase
         .from('cash_shifts')
         .select('id')
         .eq('user_id', userId)
         .eq('status', 'open')
         .maybeSingle();

      if (!openShift) {
         return res
            .status(400)
            .json({ error: 'No tienes un turno de caja abierto. Abre caja antes de vender.' });
      }

      const { data, error } = await supabase
         .rpc('register_new_sale', {
            p_user_id: userId,
            p_customer: customerData,
            p_items: cleanItems,
            p_payments: cleanPayments,
            p_totals: totals,
         })
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw new Error(error.message);

      const result = data as { success: boolean; invoice_id: string };

      res.status(201).json({
         message: 'Venta registrada correctamente',
         invoiceId: result.invoice_id,
      });
   } catch (error) {
      console.error('Transaction Error:', error);
      const message = error instanceof Error ? error.message : 'Error interno';
      res.status(500).json({ error: message });
   }
};
