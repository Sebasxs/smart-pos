import { useEffect, useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';

const API_URL = import.meta.env.VITE_API_URL;

export type InventoryFilter = 'all' | 'lowStock' | 'discounted';

export const useInventory = () => {
   const {
      products,
      allProducts, // <--- IMPORTANTE: Traemos el listado completo
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
         const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
         if (!res.ok) throw new Error('Error eliminando');

         deleteProductOptimistic(id);
         return true;
      } catch (err) {
         console.error(err);
         return false;
      }
   };

   // CORRECCIÓN: Calculamos stats sobre 'allProducts' (filtrando solo por búsqueda de texto)
   // Esto permite que los botones muestren cuántos items hay en cada categoría
   // independientemente de cuál filtro esté activo visualmente.
   const stats = useMemo(() => {
      const normalize = (str: string) =>
         str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

      const term = normalize(search);

      // El "Universo" actual son todos los productos que coinciden con la búsqueda
      const currentUniverse = allProducts.filter(
         p =>
            normalize(p.description).includes(term) ||
            (p.sku && p.sku.toLowerCase().includes(term)),
      );

      return {
         totalProducts: currentUniverse.length,
         totalValue: currentUniverse.reduce((acc, curr) => acc + curr.cost * curr.stock, 0),
         // Unificamos criterio de stock crítico a <= 3
         lowStock: currentUniverse.filter(p => p.stock <= 3).length,
         outOfStock: currentUniverse.filter(p => p.stock <= 0).length,
         discounted: currentUniverse.filter(p => p.discountPercentage > 0).length,
         averageDiscount:
            currentUniverse.filter(p => p.discountPercentage > 0).length > 0
               ? Math.round(
                    currentUniverse
                       .filter(p => p.discountPercentage > 0)
                       .reduce((acc, curr) => acc + curr.discountPercentage, 0) /
                       currentUniverse.filter(p => p.discountPercentage > 0).length,
                 )
               : 0,
      };
   }, [allProducts, search]);

   // ELIMINADO: const filteredProducts = useMemo(...)
   // Ya no filtramos localmente porque el Store ya nos entrega 'products' filtrado correctamente.

   return {
      products, // Usamos directamente lo que el store procesó
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
