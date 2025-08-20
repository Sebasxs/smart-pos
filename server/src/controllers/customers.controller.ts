import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const searchCustomers = async (req: Request, res: Response) => {
   try {
      const term = String(req.query.search || '').trim();

      if (!term) return res.json([]);

      const { data, error } = await supabase
         .rpc('search_customers', {
            search_term: term,
         })
         .setHeader('Authorization', `Bearer ${req.token}`);

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

      if (search) {
         const { data, error } = await supabase
            .rpc('search_customers', {
               search_term: search,
            })
            .setHeader('Authorization', `Bearer ${req.token}`);

         if (error) throw error;
         return res.json(data);
      }

      const { data, error } = await supabase
         .from('customers')
         .select('*')
         .order('name', { ascending: true })
         .limit(50)
         .setHeader('Authorization', `Bearer ${req.token}`);

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
      const rawData = req.body;

      if (!rawData.name?.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' });
      if (!rawData.email?.trim()) return res.status(400).json({ error: 'El email es obligatorio' });
      if (!rawData.tax_id?.trim())
         return res.status(400).json({ error: 'La identificación es obligatoria' });
      if (!rawData.document_type?.trim())
         return res.status(400).json({ error: 'El tipo de documento es obligatorio' });

      const cleanData = {
         name: rawData.name,
         tax_id: rawData.tax_id,
         email: rawData.email,
         phone: rawData.phone || null,
         city: rawData.city || null,
         address: rawData.address || null,
         document_type: rawData.document_type,
         created_by: req.user?.id,
      };

      const { data, error } = await supabase
         .from('customers')
         .insert([cleanData])
         .select()
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;

      res.status(201).json(data);
   } catch (error: any) {
      console.error('Error creating/updating customer:', error);
      if (error.code === '23505') {
         return res.status(409).json({ error: 'Ya existe un cliente con esa identificación.' });
      }

      res.status(500).json({ error: error.message || 'Error al procesar cliente' });
   }
};

export const updateCustomer = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { name, tax_id, email, phone, city, department, address, document_type } = req.body;

      if (document_type && !validDocumentTypes.includes(document_type)) {
         return res.status(400).json({ error: 'Tipo de documento inválido' });
      }
      if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
      if (!tax_id) return res.status(400).json({ error: 'La identificación es requerida' });
      if (!email) return res.status(400).json({ error: 'El email es requerido' });

      const { data, error } = await supabase
         .from('customers')
         .update({ name, tax_id, email, phone, city, department, address, document_type })
         .eq('id', id)
         .select()
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

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

      const { data: invoices, error: invoiceError } = await supabase
         .from('sales_invoices')
         .select('id')
         .eq('customer_id', id)
         .limit(1)
         .setHeader('Authorization', `Bearer ${req.token}`);

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
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;

      res.json({ message: 'Cliente eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
   }
};
