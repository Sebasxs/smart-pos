import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

type InvoiceItemPayload = {
   id: string | null;
   name: string;
   price: number;
   quantity: number;
   originalPrice: number;
   discountPercentage: number;
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
      // 1. Prepare Items for JSONB
      const cleanItems = items.map(item => ({
         id: item.id && item.id.length === 36 ? item.id : null, // If it's a UUID, it's an existing product
         quantity: Math.floor(item.quantity),
         price: Math.floor(item.price),
         // Extra fields might be needed depending on how strict register_new_sale is with the JSON structure
         // The RPC expects: id (product_id), quantity, price.
      }));

      // 2. Prepare Payments JSONB
      // Assuming single payment method for now, but structure supports multiple
      const payments = [
         {
            method: paymentMethod,
            amount: Math.floor(total),
            reference_code: null, // Add reference code if available in frontend
         },
      ];

      // 3. Prepare Totals JSONB
      const totals = {
         subtotal: Math.floor(subtotal),
         total: Math.floor(total),
         discount: Math.floor(discount),
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

      // 5. Get User ID (Assuming it's passed in headers or we use a default for now)
      // In a real app, this comes from auth middleware.
      // For this migration, we might need a temporary hardcoded user ID or fetch one.
      // Let's check if we can get a user ID.
      // The RPC REQUIRES a user_id to find the open shift.
      // We'll try to get it from the request body if the frontend sends it, or use a fallback.
      const userId = (req.body as any).userId;

      if (!userId) {
         throw new Error('User ID is required to register a sale');
      }

      const { data, error } = await supabase.rpc('register_new_sale', {
         p_user_id: userId,
         p_customer: customerData,
         p_items: cleanItems,
         p_payments: payments,
         p_totals: totals,
      });

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
