import { type StateStorage } from 'zustand/middleware';

export const roleBasedStorage: StateStorage = {
   getItem: (name: string): string | null => {
      return localStorage.getItem(name) || sessionStorage.getItem(name) || null;
   },

   setItem: (name: string, value: string): void => {
      try {
         const parsed = JSON.parse(value);
         const role = parsed.state?.user?.role;

         if (role === 'cashier') {
            sessionStorage.setItem(name, value);
            localStorage.removeItem(name);
         } else {
            localStorage.setItem(name, value);
            sessionStorage.removeItem(name);
         }
      } catch (e) {
         localStorage.setItem(name, value);
      }
   },

   removeItem: (name: string): void => {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
   },
};
