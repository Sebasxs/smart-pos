import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const searchCustomers = async (req: Request, res: Response) => {
   try {
      const term = String(req.query.search || '').trim();

      if (!term) return res.json([]);

      const { data, error } = await supabase.rpc('search_customers', {
         search_term: term,
      });

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

      let query = supabase
         .from('customers')
         .select('*')
         .order('name', { ascending: true });

      if (search) {
         const { data, error } = await supabase.rpc('search_customers', {
            search_term: search,
         });

         if (error) throw error;
         return res.json(data);
      }

      const { data, error } = await query;

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Error al obtener clientes' });
   }
};

export const createCustomer = async (req: Request, res: Response) => {
   try {
      const { name, tax_id, email, phone, city, address } = req.body;

      if (!name) {
         return res.status(400).json({ error: 'El nombre es obligatorio' });
      }

      const { data, error } = await supabase
         .from('customers')
         .insert([{ name, tax_id, email, phone, city, address }])
         .select()
         .single();

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
      const { name, tax_id, email, phone, city, address } = req.body;

      const { data, error } = await supabase
         .from('customers')
         .update({ name, tax_id, email, phone, city, address })
         .eq('id', id)
         .select()
         .single();

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

      const { error } = await supabase
         .from('customers')
         .delete()
         .eq('id', id);

      if (error) throw error;

      res.json({ message: 'Cliente eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Error al eliminar cliente' });
   }
};
