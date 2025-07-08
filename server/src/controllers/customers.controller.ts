import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const searchCustomers = async (req: Request, res: Response) => {
   try {
      const { search } = req.query;
      const term = String(search || '').trim();

      if (!term) return res.json([]);

      const { data, error } = await supabase.rpc('search_customers', {
         search_term: term,
      });

      if (error) throw error;

      res.json(data);
   } catch (error: any) {
      console.error('Error searching customers:', error);
      res.status(500).json({ error: error.message });
   }
};
