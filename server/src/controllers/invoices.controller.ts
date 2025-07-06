import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

type InvoiceItemPayload = {
   id: string | null;
   name: string;
   price: number;
   quantity: number;
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
      let customerId: string | null = null;

      if (customer.taxId) {
         const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('tax_id', customer.taxId)
            .single();

         if (existingCustomer) {
            await supabase
               .from('customers')
               .update({
                  name: customer.name,
                  email: customer.email,
                  city: customer.city,
               })
               .eq('id', existingCustomer.id);
            customerId = existingCustomer.id;
         } else {
            const { data: newCustomer, error: createError } = await supabase
               .from('customers')
               .insert({
                  name: customer.name,
                  tax_id: customer.taxId,
                  email: customer.email,
                  city: customer.city,
                  current_balance: 0,
               })
               .select('id')
               .single();

            if (createError) throw new Error(`Error creando cliente: ${createError.message}`);
            customerId = newCustomer.id;
         }
      }

      const { data: invoice, error: invoiceError } = await supabase
         .from('invoices')
         .insert({
            customer_id: customerId,
            payment_method: paymentMethod,
            subtotal: subtotal,
            discount: discount,
            total: total,
            status: 'paid',
            customer_snapshot: customer,
         })
         .select()
         .single();

      if (invoiceError) throw new Error(`Error creando factura: ${invoiceError.message}`);

      const invoiceItemsData = items.map(item => ({
         invoice_id: invoice.id,
         product_id: item.id,
         product_name: item.name,
         quantity: item.quantity,
         unit_price: item.price,
         total_price: item.price * item.quantity,
      }));

      const inventoryItems = items.filter(item => item.id);

      const { error: itemsError } = await supabase.from('invoice_items').insert(invoiceItemsData);

      if (itemsError) throw new Error(`Error guardando items: ${itemsError.message}`);

      for (const item of inventoryItems) {
         const { data: product } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id as string)
            .single();

         if (product) {
            const newStock = product.stock - item.quantity;
            await supabase
               .from('products')
               .update({ stock: newStock })
               .eq('id', item.id as string);
         }
      }

      res.status(201).json({
         message: 'Venta registrada exitosamente',
         invoiceId: invoice.id,
      });
   } catch (error: any) {
      console.error('Transaction Error:', error);
      res.status(500).json({
         error: error.message || 'Error interno al procesar la venta',
      });
   }
};
