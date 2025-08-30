import { useAuthStore } from '../store/authStore';

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
   const store = useAuthStore.getState();

   const token = await store.getAccessToken();

   if (!token) {
      throw new Error('Sesión finalizada');
   }

   const getHeaders = (t: string) => ({
      ...options.headers,
      Authorization: `Bearer ${t}`,
      'Content-Type': 'application/json',
   });

   try {
      let response = await fetch(url, {
         ...options,
         headers: getHeaders(token),
      });

      // Retry logic for expired tokens
      if (response.status === 401 || response.status === 403) {
         const newToken = await store.getAccessToken();
         if (newToken) {
            response = await fetch(url, {
               ...options,
               headers: getHeaders(newToken),
            });
         }
      }

      if (response.status === 401 || response.status === 403) {
         console.warn('Respuesta 401/403 detectada. Cerrando sesión...');
         store.logout();
         throw new Error('Tu sesión ha expirado. Por favor ingresa nuevamente.');
      }

      return response;
   } catch (error) {
      throw error;
   }
};
