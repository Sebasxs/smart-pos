import { useEffect, useState } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';
import { useAuthStore } from '../store/authStore';

export const useGlobalStoreInitializer = () => {
   const [isInitializing, setIsInitializing] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const { fetchSettings, settings } = useOrganizationStore();
   const { fetchProducts, allProducts } = useInventoryStore();
   const { fetchCustomers, customers } = useCustomerStore();
   const { isAuthenticated } = useAuthStore();

   useEffect(() => {
      if (!isAuthenticated) return;

      const initializeStores = async () => {
         const hasCachedData = !!settings && (allProducts.length > 0 || customers.length > 0);
         if (!hasCachedData) setIsInitializing(true);

         try {
            const promises = [fetchSettings(), fetchProducts(), fetchCustomers()];

            if (!hasCachedData) {
               await fetchSettings();
            } else {
               Promise.allSettled(promises).catch(console.warn);
            }
         } catch (err) {
            console.error('Error sincronizando datos:', err);
            if (!hasCachedData) {
               setError(err instanceof Error ? err.message : 'Error de conexión');
            }
         } finally {
            setIsInitializing(false);
         }
      };

      initializeStores();
   }, [isAuthenticated]);

   return { isInitializing, error };
};
