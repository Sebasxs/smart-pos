import { useAuthStore } from '../store/authStore';

export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
   const { getAccessToken, logout } = useAuthStore.getState();

   const token = await getAccessToken();

   if (!token) {
      console.warn('No hay token válido, cerrando sesión...');
      logout();
      throw new Error('Sesión expirada');
   }

   const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
   };

   const response = await fetch(url, {
      ...options,
      headers,
   });

   if (response.status === 401) {
      logout();
      throw new Error('Sesión inválida');
   }

   return response;
};
