import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

type InvoiceItemPayload = {
   id: string | null;
   name: string;
   price: number;
   quantity: number;
   originalPrice: number;
   discountPercentage: number; // Estandarizado
   isManualPrice: boolean;
   isManualName: boolean;
};

type CreateInvoiceBody = {
   customer: {
      name: string;
      taxId: string;
      email: string;
      city: string;
   };
   items: InvoiceItemPayload[];
   paymentMethod: 'cash' | 'transfer';
   subtotal: number;
   discount: number;
   total: number;
};

export const createInvoice = async (req: Request<{}, {}, CreateInvoiceBody>, res: Response) => {
   const { customer, items, paymentMethod, subtotal, discount, total } = req.body;

   try {
      const cleanItems = items.map(item => ({
         id: item.id && item.id.length === 36 ? item.id : null,
         name: item.name,
         quantity: Math.floor(item.quantity),
         price: Math.floor(item.price),
         originalPrice: Math.floor(item.originalPrice || item.price),
         discountPercentage: Math.floor(item.discountPercentage || 0), // Uso directo de discountPercentage
         isManualPrice: !!item.isManualPrice,
         isManualName: !!item.isManualName,
      }));

      const { data, error } = await supabase.rpc('create_invoice_transaction', {
         p_customer: customer,
         p_items: cleanItems,
         p_payment_method: paymentMethod,
         p_subtotal: Math.floor(subtotal),
         p_discount: Math.floor(discount),
         p_total: Math.floor(total),
      });

      if (error) throw new Error(error.message);

      const result = data as { success: boolean; invoice_id: number; message: string };

      res.status(201).json({
         message: result.message,
         invoiceId: result.invoice_id,
      });
   } catch (error: any) {
      console.error('Server Error:', error);
      res.status(500).json({
         error: error.message || 'Error interno al procesar la transacción',
      });
   }
};
