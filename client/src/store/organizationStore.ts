import { create } from 'zustand';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL;

export interface OrganizationSettings {
   id: string;
   company_name: string;
   tax_id: string;
   tax_regime: string;
   address: string;
   phone: string;
   email: string;
   city: string;
   invoice_footer: string;
}

interface OrganizationState {
   settings: OrganizationSettings | null;
   isLoading: boolean;

   fetchSettings: () => Promise<void>;
   updateSettings: (data: Partial<OrganizationSettings>) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>(set => ({
   settings: null,
   isLoading: false,

   fetchSettings: async () => {
      set({ isLoading: true });
      try {
         const token = await useAuthStore.getState().getAccessToken();
         const res = await fetch(`${API_URL}/settings/organization`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         if (res.ok) {
            const data = await res.json();
            set({ settings: data });
         }
      } catch (error) {
         console.error(error);
      } finally {
         set({ isLoading: false });
      }
   },

   updateSettings: async data => {
      try {
         const token = await useAuthStore.getState().getAccessToken();
         const res = await fetch(`${API_URL}/settings/organization`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
         });

         if (res.ok) {
            const updated = await res.json();
            set({ settings: updated });
         } else {
            throw new Error('Error actualizando empresa');
         }
      } catch (error) {
         console.error(error);
         throw error;
      }
   },
}));
