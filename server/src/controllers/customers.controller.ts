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
