import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const term = String(req.query.search || '').trim();

      if (!term) return res.json([]);

      const { data, error } = await supabase.rpc('search_products', {
         search_term: term,
      });

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error interno al obtener productos' });
   }
};
