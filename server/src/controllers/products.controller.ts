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
         brandId: product.brand_id,
         categoryId: product.category_id,
         supplierId: product.supplier_id,
         unitType: product.unit_type,
         dianUnitCode: product.dian_unit_code,
         taxIncluded: product.tax_included,
         type: product.type,
      }));

      res.json(formattedData);
   } catch (error: any) {
      console.error('Error fetching products endpoint:', error);
      res.status(500).json({ error: error.message || 'Error al obtener el inventario' });
   }
};

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

export const getBrandsList = async (req: Request, res: Response) => {
   try {
      const { data, error } = await supabase
         .from('brands')
         .select('id, name')
         .order('name')
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;
      res.json(data || []);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando marcas' });
   }
};

export const getCategoriesList = async (req: Request, res: Response) => {
   try {
      const { data, error } = await supabase
         .from('categories')
         .select('id, name, parent_id')
         .order('name')
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;
      res.json(data || []);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando categorías' });
   }
};

export const createProduct = async (req: Request, res: Response) => {
   try {
      const {
         description,
         price,
         cost,
         stock,
         discountPercentage,
         sku,
         brandId,
         categoryId,
         supplierId,
         unitType,
         taxIncluded,
         type,
      } = req.body;

      const { data, error } = await supabase
         .from('products')
         .insert({
            description,
            price,
            cost: cost || 0,
            stock: stock || 0,
            discount_percentage: discountPercentage || 0,
            sku,
            brand_id: brandId,
            category_id: categoryId,
            supplier_id: supplierId,
            unit_type: unitType || 'unit',
            tax_included: taxIncluded ?? true,
            type: type || 'good',
         })
         .select()
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error) throw error;

      res.status(201).json(data);
   } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message || 'No se pudo crear el producto' });
   }
};

export const updateProduct = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;
      const {
         description,
         price,
         cost,
         stock,
         discountPercentage,
         sku,
         brandId,
         categoryId,
         supplierId,
         unitType,
         taxIncluded,
         type,
      } = req.body;

      const { data, error } = await supabase
         .from('products')
         .update({
            description,
            price,
            cost,
            stock,
            discount_percentage: discountPercentage,
            sku,
            brand_id: brandId,
            category_id: categoryId,
            supplier_id: supplierId,
            unit_type: unitType,
            tax_included: taxIncluded,
            type: type,
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
