import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const search = String(req.query.search || '').trim();
      let data: any[] = [];
      let error: any = null;

      if (search) {
         const result = await supabase
            .rpc('search_products', {
               search_term: search,
            })
            .setHeader('Authorization', `Bearer ${req.token}`);

         data = result.data || [];
         error = result.error;
      } else {
         const result = await supabase
            .from('products')
            .select('*')
            .order('description', { ascending: true })
            .limit(9999)
            .setHeader('Authorization', `Bearer ${req.token}`);

         data = result.data || [];
         error = result.error;
      }

      if (error) {
         console.error('Supabase Error:', error);
         throw new Error(error.message);
      }

      const formattedData = data.map((product: any) => ({
         id: product.id,
         description: product.description,
         price: product.price,
         cost: product.cost || 0,
         stock: product.stock,
         discountPercentage: product.discount_percentage || product.discountPercentage || 0,
         createdAt: product.created_at,
         sku: product.sku,
         isActive: product.is_active,
      }));

      res.json(formattedData);
   } catch (error: any) {
      console.error('Error fetching products endpoint:', error);
      res.status(500).json({ error: error.message || 'Error al obtener el inventario' });
   }
};

// ... el resto del archivo sigue igual

export const getSuppliersList = async (req: Request, res: Response) => {
   try {
      const { data, error } = await supabase
         .from('suppliers')
         .select('id, name')
         .order('name')
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;
      res.json(data);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando proveedores' });
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { description, price, cost, stock, discountPercentage, supplierId, sku } = req.body;

      const { data, error } = await supabase
         .from('products')
         .insert({
            description,
            price,
            cost,
            stock,
            discount_percentage: discountPercentage,
            supplier_id: supplierId || null,
            sku,
         })
         .select()
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

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
      const { description, price, cost, stock, discountPercentage, supplierId, sku } = req.body;

      const { data, error } = await supabase
         .from('products')
         .update({
            description,
            price,
            cost,
            stock,
            discount_percentage: discountPercentage,
            supplier_id: supplierId || null,
            sku,
         })
         .eq('id', id)
         .select()
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

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

      const { error } = await supabase
         .from('products')
         .delete()
         .eq('id', id)
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;

      res.json({ message: 'Producto eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'No se pudo eliminar el producto' });
   }
};
