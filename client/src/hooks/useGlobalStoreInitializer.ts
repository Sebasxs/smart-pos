import { useEffect, useState } from 'react';
import { useOrganizationStore } from '../store/organizationStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';
import { useAuthStore } from '../store/authStore';

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
   const isSessionChecked = useAuthStore(state => state.isSessionChecked);

   useEffect(() => {
      // Don't start initialization until session is checked
      if (!isSessionChecked) {
         return;
      }

      const initializeStores = async () => {
         setIsInitializing(true);
         setError(null);

         try {
            // Add timeout to prevent infinite waiting
            const initPromise = Promise.all([
               fetchSettings(),
               fetchProducts(), // Has built-in caching
               fetchCustomers(), // Has built-in caching
            ]);

            const timeoutPromise = new Promise<never>((_, reject) =>
               setTimeout(() => reject(new Error('Timeout al cargar datos iniciales')), 15000),
            );

            await Promise.race([initPromise, timeoutPromise]);
         } catch (err) {
            console.error('Error initializing stores:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
            // Don't block the app, just log the error
         } finally {
            setIsInitializing(false);
         }
      };

      initializeStores();
   }, [isSessionChecked, fetchSettings, fetchProducts, fetchCustomers]);

   return { isInitializing, error };
};
