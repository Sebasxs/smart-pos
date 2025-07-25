import { useEffect, useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';

const API_URL = import.meta.env.VITE_API_URL;

export type InventoryFilter = 'all' | 'lowStock' | 'discounted';

export const useInventory = () => {
   const {
      products,
      isLoading,
      search,
      setSearch,
      fetchProducts,
      deleteProductOptimistic,
      activeFilter,
      setFilter,
      error,
   } = useInventoryStore();

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         fetchProducts();
      }, 300);
      return () => clearTimeout(timeoutId);
   }, [fetchProducts, search]);

   const deleteProduct = async (id: string) => {
      try {
         const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Error eliminando');

         deleteProductOptimistic(id);
         return true;
      } catch (err) {
         console.error(err);
         return false;
      }
   };

   const stats = useMemo(() => {
      return {
         totalProducts: products.length,
         totalValue: products.reduce((acc, curr) => acc + curr.price * curr.stock, 0),
         lowStock: products.filter(p => p.stock <= 5).length,
         discounted: products.filter(p => p.discount_percentage > 0).length,
      };
   }, [products]);

   const filteredProducts = useMemo(() => {
      if (activeFilter === 'lowStock') {
         return products.filter(p => p.stock <= 5);
      }
      if (activeFilter === 'discounted') {
         return products.filter(p => p.discount_percentage > 0);
      }
      return products;
   }, [products, activeFilter]);

   return {
      products: filteredProducts,
      isLoading,
      error,
      search,
      setSearch,
      deleteProduct,
      refresh: () => fetchProducts(true),
      stats,
      activeFilter,
      toggleFilter: setFilter,
   };
};
