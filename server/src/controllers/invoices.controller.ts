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
   paymentMethod: 'cash' | 'transfer';
   subtotal: number;
   discount: number;
   total: number;
};

export const createInvoice = async (req: Request<{}, {}, CreateInvoiceBody>, res: Response) => {
   const { customer, items, paymentMethod, subtotal, discount, total } = req.body;

   try {
      // 1. Prepare Items for JSONB
      const cleanItems = items.map(item => ({
         id: item.id && item.id.length === 36 ? item.id : null,
         quantity: item.quantity,
         price: item.price,
         description: item.description,
         applied_taxes: [], // Empty array - backend will calculate taxes from product_taxes table
      }));

      // 2. Prepare Payments JSONB
      // Assuming single payment method for now, but structure supports multiple
      const payments = [
         {
            method: paymentMethod,
            amount: total,
            reference_code: null, // Add reference code if available in frontend
         },
      ];

      // 3. Prepare Totals JSONB
      const totals = {
         subtotal: subtotal,
         total: total,
         discount: discount,
         tax: 0, // Frontend should send tax if applicable
      };

      // 4. Prepare Customer JSONB
      // The RPC handles upsert based on tax_id
      const customerData = {
         name: customer.name,
         tax_id: customer.taxId,
         email: customer.email,
         city: customer.city,
         // Add other fields if available in frontend payload
         phone: (customer as any).phone,
         address: (customer as any).address,
         document_type: (customer as any).documentType || '31',
      };

      const userId = (req.body as any).userId;

      if (!userId) {
         throw new Error('User ID is required to register a sale');
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { data, error } = await supabase
         .rpc('register_new_sale', {
            p_user_id: userId,
            p_customer: customerData,
            p_items: cleanItems,
            p_payments: payments,
            p_totals: totals,
         })
         .setHeader('Authorization', authHeader || '');

      if (error) throw new Error(error.message);

      const result = data as { success: boolean; invoice_id: string };

      res.status(201).json({
         message: 'Venta registrada correctamente',
         invoiceId: result.invoice_id,
      });
   } catch (error) {
      console.error('Transaction Error:', error);
      const message =
         error instanceof Error ? error.message : 'Error interno al procesar la transacción';
      res.status(500).json({ error: message });
   }
};
