import { useEffect, useMemo, useState } from 'react';
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
      suppliers,
      fetchSuppliers,
   } = useInventoryStore();

   const [selectedSupplier, setSelectedSupplier] = useState<string>('');

   useEffect(() => {
      if (!isInitialized) {
         fetchProducts();
         fetchSuppliers();
      }
   }, [isInitialized, fetchProducts, fetchSuppliers]);

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

   const productsBySupplier = useMemo(() => {
      if (selectedSupplier) {
         return products.filter(p => p.supplierId === selectedSupplier);
      }
      return products;
   }, [products, selectedSupplier]);

   const stats = useMemo(() => {
      return {
         totalProducts: productsBySupplier.length,
         totalValue: productsBySupplier.reduce((acc, curr) => acc + curr.cost * curr.stock, 0),
         lowStock: productsBySupplier.filter(p => p.stock <= 3).length,
         outOfStock: productsBySupplier.filter(p => p.stock <= 0).length,
         discounted: productsBySupplier.filter(p => p.discountPercentage > 0).length,
         averageDiscount:
            productsBySupplier.filter(p => p.discountPercentage > 0).length > 0
               ? Math.round(
                    productsBySupplier
                       .filter(p => p.discountPercentage > 0)
                       .reduce((acc, curr) => acc + curr.discountPercentage, 0) /
                       productsBySupplier.filter(p => p.discountPercentage > 0).length,
                 )
               : 0,
      };
   }, [productsBySupplier]);

   const filteredProducts = useMemo(() => {
      let result = productsBySupplier;

      if (activeFilter === 'lowStock') {
         result = result.filter(p => p.stock <= 3);
      } else if (activeFilter === 'discounted') {
         result = result.filter(p => p.discountPercentage > 0);
      }

      return result;
   }, [productsBySupplier, activeFilter]);

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
      suppliers,
      selectedSupplier,
      setSelectedSupplier,
   };
};
