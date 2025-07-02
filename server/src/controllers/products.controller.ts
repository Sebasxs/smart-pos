import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const { search } = req.query;

      let query = supabase.from('products').select('*').order('name', { ascending: true });

      if (search) {
         query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error interno al obtener productos' });
   }
};
