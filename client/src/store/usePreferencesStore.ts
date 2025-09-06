import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL;

export interface UserPreferences {
   currencyDecimalPreference: 0 | 2;
   defaultOpeningCash: number;
   showCurrencySymbol: boolean;
}

const defaultPreferences: UserPreferences = {
   currencyDecimalPreference: 2,
   defaultOpeningCash: 0,
   showCurrencySymbol: true,
};

interface PreferencesState {
   preferences: UserPreferences;

   setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
   loadPreferencesFromProfile: (prefs: Partial<UserPreferences> | null) => void;
   savePreferencesToBackend: () => Promise<void>;
}

let saveTimeout: number | null = null;

export const usePreferencesStore = create<PreferencesState>()(
   persist(
      (set, get) => ({
         preferences: defaultPreferences,

         setPreference: (key, value) => {
            set(state => ({
               preferences: { ...state.preferences, [key]: value },
            }));

            if (saveTimeout) {
               clearTimeout(saveTimeout);
            }

            saveTimeout = window.setTimeout(() => {
               get().savePreferencesToBackend();
            }, 1000);
         },

         loadPreferencesFromProfile: prefs => {
            if (!prefs) return;
            set(state => ({
               preferences: { ...state.preferences, ...prefs },
            }));
         },

         savePreferencesToBackend: async () => {
            try {
               const { preferences } = get();
               const token = await useAuthStore.getState().getAccessToken();
               if (!token) return;

               await fetch(`${API_URL}/api/settings/profile/preferences`, {
                  method: 'PUT',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ preferences }),
               });
            } catch (error) {
               console.error('Failed to sync preferences', error);
            }
         },
      }),
      {
         name: 'smart-pos-preferences',
         storage: createJSONStorage(() => localStorage),
      },
   ),
);
