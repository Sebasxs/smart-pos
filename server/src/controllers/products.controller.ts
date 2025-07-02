import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const { search } = req.query;

      let query = supabase
         .from('products')
         .select('*, suppliers(name)')
         .order('name', { ascending: true });

      if (search) {
         query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map(item => ({
         ...item,
         supplier: item.suppliers?.name || 'Genérico',
         suppliers: undefined,
      }));

      res.json(formattedData);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error interno al obtener productos' });
   }
};
