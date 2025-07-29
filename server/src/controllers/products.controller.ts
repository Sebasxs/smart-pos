import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const search = String(req.query.search || '').trim();

      let query = supabase
         .from('products')
         .select('*, suppliers (name)')
         .order('name', { ascending: true })

      if (search) {
         query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedData = data.map((product: any) => ({
         id: product.id,
         name: product.name,
         description: product.description,
         price: product.price,
         cost: product.cost,
         stock: product.stock,
         discountPercentage: product.discount_percentage || 0,
         supplier: product.suppliers?.name || 'Sin proveedor',
         supplierId: product.supplier_id,
         createdAt: product.created_at,
      }));

      res.json(formattedData);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error al obtener el inventario' });
   }
};

export const getSuppliersList = async (_req: Request, res: Response) => {
   try {
      const { data, error } = await supabase
         .from('suppliers')
         .select('id, name')
         .order('name');

      if (error) throw error;
      res.json(data);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando proveedores' });
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { name, description, price, cost, stock, discountPercentage, supplierId } = req.body;

      const { data, error } = await supabase
         .from('products')
         .insert({
            name,
            description,
            price,
            cost,
            stock,
            discount_percentage: discountPercentage,
            supplier_id: supplierId || null
         })
         .select()
         .single();

      if (error) throw error;

      res.status(201).json(data);
   } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'No se pudo crear el producto' });
   }
};

export const updateProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const { name, description, price, cost, stock, discountPercentage, supplierId } = req.body;

      const { data, error } = await supabase
         .from('products')
         .update({
            name,
            description,
            price,
            cost,
            stock,
            discount_percentage: discountPercentage,
            supplier_id: supplierId || null
         })
         .eq('id', id)
         .select()
         .single();

      if (error) throw error;

      res.json(data);
   } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'No se pudo actualizar el producto' });
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