import { useState, useEffect, useMemo, useCallback } from 'react';
import { type Product } from '../types/inventory';

const API_URL = import.meta.env.VITE_API_URL;

export type InventoryFilter = 'all' | 'lowStock';

export const useInventory = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [error, setError] = useState('');
   const [activeFilter, setActiveFilter] = useState<InventoryFilter>('all');

   const fetchProducts = useCallback(async () => {
      setIsLoading(true);
      try {
         const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
         const res = await fetch(`${API_URL}/products${queryParams}`);

         if (!res.ok) throw new Error('Error cargando inventario');

         const data = await res.json();
         setProducts(data);
         setError('');
      } catch (err) {
         console.error(err);
         setError('No se pudo cargar el inventario');
      } finally {
         setIsLoading(false);
      }
   }, [search]);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         fetchProducts();
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [fetchProducts]);

   const deleteProduct = async (id: string) => {
      try {
         const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Error eliminando');
         setProducts(prev => prev.filter(p => p.id !== id));
         return true;
      } catch (err) {
         console.error(err);
         return false;
      }
   };

   // Estadísticas calculadas sobre el total de datos
   const stats = useMemo(() => {
      return {
         totalProducts: products.length,
         totalValue: products.reduce((acc, curr) => acc + curr.price * curr.stock, 0),
         lowStock: products.filter(p => p.stock <= 5).length,
      };
   }, [products]);

   const filteredProducts = useMemo(() => {
      if (activeFilter === 'lowStock') {
         return products.filter(p => p.stock <= 5);
      }
      return products;
   }, [products, activeFilter]);

   const toggleFilter = (filter: InventoryFilter) => {
      setActiveFilter(prev => (prev === filter ? 'all' : filter));
   };

   return {
      products: filteredProducts,
      isLoading,
      error,
      search,
      setSearch,
      deleteProduct,
      refresh: fetchProducts,
      stats,
      activeFilter,
      toggleFilter,
   };
};
