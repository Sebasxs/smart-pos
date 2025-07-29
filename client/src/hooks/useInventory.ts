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
      fetchProducts();
   }, [fetchProducts]);

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
         discounted: products.filter(p => p.discountPercentage > 0).length,
      };
   }, [products]);

   const filteredProducts = useMemo(() => {
      let result = products;

      // 1. Filtro por búsqueda
      if (search) {
         const lowerSearch = search.toLowerCase();
         result = result.filter(
            p =>
               p.name.toLowerCase().includes(lowerSearch) ||
               p.supplier.toLowerCase().includes(lowerSearch)
         );
      }

      // 2. Filtros rápidos
      if (activeFilter === 'lowStock') {
         result = result.filter(p => p.stock <= 5);
      } else if (activeFilter === 'discounted') {
         result = result.filter(p => p.discountPercentage > 0);
      }

      return result;
   }, [products, activeFilter, search]);

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
