import { useAuthStore } from '../store/authStore';

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
   const store = useAuthStore.getState();

   // Intentamos obtener el token fresco
   // Si es admin y el token expiró, esto intentará refrescarlo internamente
   // Si falla el refresh, getAccessToken ejecutará logout() y retornará null.
   const token = await store.getAccessToken();

   if (!token) {
      // Ya se ejecutó logout dentro de getAccessToken si falló,
      // pero por seguridad lanzamos error para detener la ejecución del componente.
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

      // Interceptor Global de Errores de Sesión
      if (response.status === 401 || response.status === 403) {
         console.warn('Respuesta 401/403 detectada. Cerrando sesión...');
         store.logout();
         throw new Error('Tu sesión ha expirado. Por favor ingresa nuevamente.');
      }

      return response;
   } catch (error) {
      // Si es un error de red o fetch falla
      throw error;
   }
};
