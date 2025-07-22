import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const search = String(req.query.search || '').trim();

      let query = supabase
         .from('products')
         .select('*, suppliers (name)')
         .order('name', { ascending: true });

      if (search) {
         query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map((product: any) => ({
         ...product,
         supplier: product.suppliers?.name || 'Sin proveedor',
      }));

      res.json(formattedData);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error al obtener el inventario' });
   }
};

export const deleteProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      res.json({ message: 'Producto eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'No se pudo eliminar el producto' });
   }
};
