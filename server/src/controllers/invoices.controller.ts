import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

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

type CreateInvoiceBody = {
   customer: {
      name: string;
      taxId: string;
      email: string;
      city: string;
   };
   items: InvoiceItemPayload[];
   paymentMethod: 'cash' | 'bank_transfer' | 'account_balance' | 'credit_card';
   subtotal: number;
   discount: number;
   total: number;
};

export const createInvoice = async (req: Request<{}, {}, CreateInvoiceBody>, res: Response) => {
   const { customer, items, paymentMethod, subtotal, discount, total } = req.body;

   try {
      const userId = req.user?.id;

      if (!userId) {
         return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const cleanItems = items.map(item => ({
         id: item.id && item.id.length === 36 ? item.id : null,
         quantity: item.quantity,
         price: item.price,
         description: item.description,
         applied_taxes: [],
      }));

      const payments = [
         {
            method: paymentMethod,
            amount: total,
            reference_code: null,
         },
      ];

      const totals = {
         subtotal: subtotal,
         total: total,
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
            p_payments: payments,
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
