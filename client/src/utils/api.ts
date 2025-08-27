import { useAuthStore } from '../store/authStore';

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
   const store = useAuthStore.getState();

   const token = await store.getAccessToken();

   if (!token) {
      throw new Error('Sesión finalizada');
   }

   const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
   };

   try {
      const response = await fetch(url, {
         ...options,
         headers,
      });

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
