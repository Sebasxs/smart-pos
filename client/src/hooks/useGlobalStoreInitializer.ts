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
   const { isSessionChecked, isAuthenticated } = useAuthStore();

   useEffect(() => {
      // Don't start initialization until session is checked, UNLESS we are already authenticated (optimistic load)
      if (!isSessionChecked && !isAuthenticated) {
         return;
      }

      const initializeStores = async () => {
         // Si ya tenemos settings (hidratados de localStorage), no bloqueamos la UI
         // Cargamos todo en segundo plano
         const hasCachedSettings = !!useOrganizationStore.getState().settings;

         if (hasCachedSettings) {
            setIsInitializing(false);
            fetchSettings(); // Background update
            fetchProducts();
            fetchCustomers();
            return;
         }

         // Si no hay settings (primera vez), bloqueamos hasta tener lo mínimo
         setIsInitializing(true);
         setError(null);

         try {
            // Start fetching heavy data in background
            fetchProducts();
            fetchCustomers();

            const settingsPromise = fetchSettings();

            const timeoutPromise = new Promise<never>((_, reject) =>
               setTimeout(() => reject(new Error('Timeout al cargar configuración')), 10000),
            );

            await Promise.race([settingsPromise, timeoutPromise]);
         } catch (err) {
            console.error('Error initializing stores:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar datos');
         } finally {
            setIsInitializing(false);
         }
      };

      initializeStores();
   }, [isSessionChecked, isAuthenticated, fetchSettings, fetchProducts, fetchCustomers]);

   return { isInitializing, error };
};
