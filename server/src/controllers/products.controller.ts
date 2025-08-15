import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response) => {
   try {
      const search = String(req.query.search || '').trim();
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }
      let data: any[] = [];
      let error: any = null;

      if (search) {
         const result = await supabase
            .rpc('search_products', {
               search_term: search,
            })
            .setHeader('Authorization', authHeader || '');
         data = result.data || [];
         error = result.error;
      } else {
         const result = await supabase
            .from('products')
            .select('*, suppliers (name)')
            .order('description', { ascending: true })
            .limit(100) // Limit for performance
            .setHeader('Authorization', authHeader || '');
         data = result.data || [];
         error = result.error;
      }

      if (error) throw error;

      const formattedData = data.map((product: any) => ({
         id: product.id,
         description: product.description,
         price: product.price,
         cost: product.cost,
         stock: product.stock,
         discountPercentage: product.discount_percentage || 0,
         supplier: product.suppliers?.name || 'Sin proveedor',
         supplierId: product.supplier_id,
         createdAt: product.created_at,
         sku: product.sku,
         isActive: product.is_active,
      }));

      res.json(formattedData);
   } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error al obtener el inventario' });
   }
};

export const getSuppliersList = async (req: Request, res: Response) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }
      const { data, error } = await supabase
         .from('suppliers')
         .select('id, name')
         .order('name')
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;
      res.json(data);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando proveedores' });
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      const { description, price, cost, stock, discountPercentage, supplierId, sku } = req.body;

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }
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
         .setHeader('Authorization', authHeader || '');

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

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

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
         .setHeader('Authorization', authHeader || '');

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

      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const { error } = await supabase
         .from('products')
         .delete()
         .eq('id', id)
         .setHeader('Authorization', authHeader || '');

      if (error) throw error;

      res.json({ message: 'Producto eliminado correctamente' });
   } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'No se pudo eliminar el producto' });
   }
};
