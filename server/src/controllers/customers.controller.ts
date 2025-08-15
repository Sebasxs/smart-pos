import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const searchCustomers = async (req: Request, res: Response) => {
   try {
      const term = String(req.query.search || '').trim();

      if (!term) return res.json([]);

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { data, error } = await supabase
         .rpc('search_customers', {
            search_term: term,
         })
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error searching customers:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: message });
   }
};

export const getCustomers = async (req: Request, res: Response) => {
   try {
      const search = String(req.query.search || '').trim();

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      if (search) {
         const { data, error } = await supabase
            .rpc('search_customers', {
               search_term: search,
            })
            .setHeader('Authorization', authHeader || '');

         if (error) throw error;
         return res.json(data);
      }

      const { data, error } = await supabase
         .from('customers')
         .select('*')
         .order('name', { ascending: true })
         .limit(50)
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
   }
};

const validDocumentTypes = ['11', '12', '13', '21', '22', '31', '41', '42', '91'];

export const createCustomer = async (req: Request, res: Response) => {
   try {
      const { name, tax_id, email, phone, city, department, address, document_type } = req.body;

      if (!name) {
         return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      if (document_type && !validDocumentTypes.includes(document_type)) {
         return res.status(400).json({ error: 'Tipo de documento inválido' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { data, error } = await supabase
         .from('customers')
         .insert([
            {
               name,
               tax_id,
               email,
               phone,
               city,
               department,
               address,
               document_type: document_type || '31',
            },
         ])
         .select()
         .single()
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.status(201).json(data);
   } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ error: 'Error al crear cliente' });
   }
};

export const updateCustomer = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { name, tax_id, email, phone, city, department, address, document_type } = req.body;

      if (document_type && !validDocumentTypes.includes(document_type)) {
         return res.status(400).json({ error: 'Tipo de documento inválido' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { data, error } = await supabase
         .from('customers')
         .update({ name, tax_id, email, phone, city, department, address, document_type })
         .eq('id', id)
         .select()
         .single()
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Error al actualizar cliente' });
   }
};

export const deleteCustomer = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { data: invoices, error: invoiceError } = await supabase
         .from('sales_invoices')
         .select('id')
         .eq('customer_id', id)
         .limit(1)
         .setHeader('Authorization', authHeader || '');

      if (invoiceError && invoiceError.code !== 'PGRST116') throw invoiceError;

      if (invoices && invoices.length > 0) {
         return res.status(409).json({
            error: 'No se puede eliminar el cliente porque tiene facturas asociadas',
         });
      }

      const { error } = await supabase
         .from('customers')
         .delete()
         .eq('id', id)
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.json({ message: 'Cliente eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
   }
};
