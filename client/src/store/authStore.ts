import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../utils/supabase';
import { usePreferencesStore } from './usePreferencesStore';
import { isTokenExpired } from '../utils/jwt';
import { roleBasedStorage } from './roleBasedStorage';

export interface User {
   // ... (sin cambios)
   id: string;
   full_name: string;
   nickname?: string;
   role: 'admin' | 'cashier' | 'super_admin';
   job_title?: string;
   avatar_url?: string;
   permissions?: Record<string, boolean>;
   email?: string;
}

interface AuthState {
   // ... (sin cambios)
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;
   isInitialized: boolean;

   login: (user: User, token: string) => void;
   logout: () => Promise<void>;
   initializeAuth: () => Promise<(() => void) | undefined>;
   fetchProfile: (session: any) => Promise<void>;
   getAccessToken: () => Promise<string | null>;
   forceInitialized: () => void;
}

// Variable fuera del store para manejar la promesa en vuelo (Singleton)
let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         isAuthenticated: false,
         isInitialized: false,

         // ... login, logout, forceInitialized, initializeAuth, fetchProfile (SIN CAMBIOS) ...
         login: (user, token) => {
            set({ user, token, isAuthenticated: true, isInitialized: true });
         },

         logout: async () => {
            const state = get();
            if (!state.isAuthenticated && !state.user) return;
            console.log('🔒 Cerrando sesión...');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
            roleBasedStorage.removeItem('auth-storage');
            await supabase.auth.signOut().catch(console.warn);
         },

         forceInitialized: () => {
            if (!get().isInitialized) {
               set({ isInitialized: true });
            }
         },

         initializeAuth: async () => {
            const state = get();
            if (state.token && state.user) {
               set({ isAuthenticated: true, isInitialized: true });
            }
            const {
               data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
               if (event === 'SIGNED_IN' && session) {
                  set({ token: session.access_token, isAuthenticated: true });
                  if (!get().user?.full_name) {
                     get().fetchProfile(session);
                  }
               } else if (event === 'TOKEN_REFRESHED' && session) {
                  set({ token: session.access_token });
               } else if (event === 'SIGNED_OUT') {
                  const currentUser = get().user;
                  if (currentUser && currentUser.role !== 'cashier') {
                     get().logout();
                  }
               }
            });

            if (state.user?.role !== 'cashier') {
               supabase.auth.getSession().then(({ data, error }) => {
                  if (error || !data.session) {
                     if (state.token && isTokenExpired(state.token)) {
                        get().logout();
                     }
                  } else {
                     if (data.session.access_token !== state.token) {
                        set({ token: data.session.access_token, isAuthenticated: true });
                     }
                  }
               });
            }
            if (!get().isInitialized) set({ isInitialized: true });
            return () => subscription.unsubscribe();
         },

         fetchProfile: async (session: any) => {
            // ... (código existente sin cambios)
            if (!session?.user) return;
            try {
               const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('auth_user_id', session.user.id)
                  .single();

               if (error || !profile) return;

               set({
                  user: {
                     id: profile.id,
                     full_name: profile.full_name,
                     role: profile.role,
                     job_title: profile.job_title,
                     avatar_url: profile.avatar_url,
                     permissions: profile.permissions,
                     email: session.user.email,
                  },
                  isAuthenticated: true,
               });

               usePreferencesStore.getState().loadPreferencesFromProfile(profile.preferences);
            } catch (e) {
               console.error('⚠️ Error cargando perfil:', e);
            }
         },

         // --- AQUÍ ESTÁ EL CAMBIO IMPORTANTE ---
         getAccessToken: async () => {
            const state = get();
            let currentToken = state.token;

            // Cajeros: No se refresca (lógica existente)
            if (state.user?.role === 'cashier') {
               if (currentToken && isTokenExpired(currentToken)) {
                  get().logout();
                  return null;
               }
               return currentToken;
            }

            // Admins: Lógica de renovación con Singleton para evitar race conditions
            if (currentToken && isTokenExpired(currentToken)) {
               // 1. Si ya hay una renovación en proceso, devolver esa promesa existente
               if (refreshPromise) {
                  return await refreshPromise;
               }

               // 2. Si no, iniciar la renovación y guardar la promesa
               refreshPromise = (async () => {
                  console.log('🔄 Token expirado. Iniciando renovación única...');
                  const { data, error } = await supabase.auth.getSession();

                  if (!error && data.session) {
                     const newToken = data.session.access_token;
                     set({ token: newToken });
                     console.log('✅ Token renovado exitosamente.');
                     return newToken;
                  } else {
                     console.warn('⛔ Falló la renovación. Logout forzado.');
                     get().logout();
                     return null;
                  }
               })();

               try {
                  return await refreshPromise;
               } finally {
                  // 3. Limpiar la promesa al terminar (éxito o fallo)
                  refreshPromise = null;
               }
            }

            return currentToken;
         },
      }),
      {
         name: 'auth-storage',
         storage: createJSONStorage(() => roleBasedStorage),
         partialize: state => ({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
         }),
      },
   ),
);
