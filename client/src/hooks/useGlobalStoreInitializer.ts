import { useEffect, useState } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';

/**
 * Hook to initialize all critical stores globally after authentication.
 * This ensures data is available throughout the app without timing issues.
 */
export const useGlobalStoreInitializer = () => {
   const [isInitializing, setIsInitializing] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const { fetchSettings } = useOrganizationStore();
   const { fetchProducts } = useInventoryStore();
   const { fetchCustomers } = useCustomerStore();

   useEffect(() => {
      const initializeStores = async () => {
         setIsInitializing(true);
         setError(null);

         try {
            // Load all critical stores in parallel for faster initialization
            await Promise.all([
               fetchSettings(),
               fetchProducts(), // Has built-in caching
               fetchCustomers(), // Has built-in caching
            ]);
         } catch (err) {
            console.error('Error initializing stores:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
         } finally {
            setIsInitializing(false);
         }
      };

      initializeStores();
   }, []); // Only run once on mount

   return { isInitializing, error };
};
