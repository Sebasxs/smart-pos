import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { InvoiceValidationService } from '../services/invoiceValidation.service';

// Payload Types
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
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });

      // 1. Validate Payments
      const paymentCheck = InvoiceValidationService.validatePaymentSufficiency(payments, total);
      if (!paymentCheck.isValid) {
         return res.status(400).json(paymentCheck);
      }

      // 2. Validate Numeric Ranges (Postgres DECIMAL limits)
      const allValues = [
         subtotal,
         discount,
         total,
         ...items.flatMap(item => [item.price, item.quantity, item.originalPrice]),
         ...payments.map(p => p.amount),
      ];
      const rangeCheck = InvoiceValidationService.validateNumericRanges(allValues);
      if (!rangeCheck.isValid) {
         return res.status(400).json({
            error: `Numeric value out of range: ${rangeCheck.value}. Max allowed: 9999999999999.999999`,
         });
      }

      // 3. Validate Calculation Integrity
      const totalCheck = InvoiceValidationService.validateTotals(items, subtotal, total, discount);
      if (!totalCheck.isValid) {
         return res.status(400).json(totalCheck);
      }

      // 4. Prepare Clean Data for DB
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

      const finalTotals = {
         subtotal: totalCheck.cleanTotals!.subtotal,
         total: totalCheck.cleanTotals!.total,
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

      // 5. Ensure Shift is Open
      const { data: openShift } = await supabase
         .from('cash_shifts')
         .select('id')
         .eq('user_id', userId)
         .eq('status', 'open')
         .maybeSingle();

      if (!openShift) {
         return res.status(400).json({ error: 'No active cash shift found. Open a shift first.' });
      }

      // 6. Execute Transaction via RPC
      const { data, error } = await supabase
         .rpc('register_new_sale', {
            p_user_id: userId,
            p_customer: customerData,
            p_items: cleanItems,
            p_payments: cleanPayments,
            p_totals: finalTotals,
         })
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw new Error(error.message);

      const result = data as { success: boolean; invoice_id: string; invoice_number_full: string };

      res.status(201).json({
         message: 'Invoice created successfully',
         invoiceId: result.invoice_id,
         invoiceNumberFull: result.invoice_number_full,
      });
   } catch (error) {
      console.error('Transaction Error:', error);
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      res.status(500).json({ error: message });
   }
};
