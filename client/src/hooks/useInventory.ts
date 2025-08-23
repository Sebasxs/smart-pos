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
      isInitialized,
   } = useInventoryStore();

   useEffect(() => {
      if (!isInitialized) {
         fetchProducts();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isInitialized]);

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
         totalValue: products.reduce((acc, curr) => acc + curr.cost * curr.stock, 0),
         lowStock: products.filter(p => p.stock <= 3).length,
         outOfStock: products.filter(p => p.stock <= 0).length,
         discounted: products.filter(p => p.discountPercentage > 0).length,
         averageDiscount:
            products.filter(p => p.discountPercentage > 0).length > 0
               ? Math.round(
                    products
                       .filter(p => p.discountPercentage > 0)
                       .reduce((acc, curr) => acc + curr.discountPercentage, 0) /
                       products.filter(p => p.discountPercentage > 0).length,
                 )
               : 0,
      };
   }, [products]);

   const filteredProducts = useMemo(() => {
      let result = products;

      if (activeFilter === 'lowStock') {
         result = result.filter(p => p.stock <= 3);
      } else if (activeFilter === 'discounted') {
         result = result.filter(p => p.discountPercentage > 0);
      }

      return result;
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
