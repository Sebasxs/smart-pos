import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { supabase } from '../utils/supabase';
import { usePreferencesStore } from './usePreferencesStore';

export interface User {
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
   user: User | null;
   token: string | null;
   isAuthenticated: boolean;

   login: (user: User, token: string) => void;
   logout: () => void;
   checkSession: () => Promise<void>;
   fetchProfile: (session: any) => Promise<void>;
   initializeListener: () => () => void;
   getAccessToken: () => Promise<string | null>;
}

// Adaptador de almacenamiento inteligente
const smartStorage: StateStorage = {
   getItem: (name: string): string | null => {
      // Intentar buscar en ambos, dando prioridad a Local (Admin)
      return localStorage.getItem(name) || sessionStorage.getItem(name) || null;
   },
   setItem: (name: string, value: string): void => {
      try {
         const parsed = JSON.parse(value);
         const role = parsed.state?.user?.role;

         if (role === 'cashier') {
            // Cajeros: Session Storage (Se borra al cerrar pestaña)
            sessionStorage.setItem(name, value);
            localStorage.removeItem(name); // Limpiar rastro anterior
         } else {
            // Admins/Otros: Local Storage (Persistente)
            localStorage.setItem(name, value);
            sessionStorage.removeItem(name); // Limpiar rastro anterior
         }
      } catch (e) {
         // Fallback por seguridad
         localStorage.setItem(name, value);
      }
   },
   removeItem: (name: string): void => {
      localStorage.removeItem(name);
      sessionStorage.removeItem(name);
   },
};

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         isAuthenticated: false,

         login: (user, token) => {
            set({ user, token, isAuthenticated: true });
         },

         logout: async () => {
            set({ user: null, token: null, isAuthenticated: false });

            // Limpiar ambos storages
            localStorage.removeItem('auth-storage');
            sessionStorage.removeItem('auth-storage');

            // Limpiar cache de Supabase
            Object.keys(localStorage).forEach(key => {
               if (key.startsWith('sb-')) localStorage.removeItem(key);
            });

            await supabase.auth.signOut().catch(err => {
               console.warn('Supabase signOut warning:', err);
            });

            window.location.href = '/login';
         },

         checkSession: async () => {
            try {
               // Para cajeros, la sesión es local y se valida solo con el token almacenado
               if (get().user?.role === 'cashier') {
                  return;
               }

               // Para Admins (OAuth), verificamos con Supabase
               const { data, error } = await supabase.auth.getSession();

               if (error || !data.session) {
                  // Si hay error o no hay sesión, logout
                  console.warn('Sesión inválida o expirada:', error);
                  get().logout();
                  return;
               }

               // Si la sesión es válida, actualizamos perfil y token si cambió
               if (data.session.access_token !== get().token) {
                  set({ token: data.session.access_token });
               }

               await get().fetchProfile(data.session);
            } catch (error) {
               console.error('Check session fatal error:', error);
               get().logout();
            }
         },

         fetchProfile: async (session: any) => {
            try {
               const { data: profile, error } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('auth_user_id', session.user.id)
                  .single();

               if (profile && !error) {
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
                     token: session.access_token,
                     isAuthenticated: true,
                  });

                  usePreferencesStore.getState().loadPreferencesFromProfile(profile.preferences);
               } else {
                  console.error('Error fetching profile:', error);
               }
            } catch (e) {
               console.error('Fetch profile exception:', e);
            }
         },

         getAccessToken: async () => {
            const state = get();

            // 1. Caso Cajero: Devolver token estático (JWT expirará en backend a las 12h)
            if (state.user?.role === 'cashier') {
               return state.token;
            }

            // 2. Caso Admin (Supabase): Obtener sesión ACTIVA
            // getSession() maneja automáticamente el refresh token si el access token expiró.
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
               // Si no se pudo refrescar (ej. pasaron 30 días o revocaron acceso), logout inmediato
               get().logout();
               return null;
            }

            // Actualizar el store si el token cambió (refresh ocurrió)
            if (data.session.access_token !== state.token) {
               set({ token: data.session.access_token });
            }

            return data.session.access_token;
         },

         initializeListener: () => {
            const {
               data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
               if (event === 'SIGNED_IN' && session) {
                  await get().fetchProfile(session);
               } else if (event === 'TOKEN_REFRESHED' && session) {
                  set({ token: session.access_token });
               } else if (event === 'SIGNED_OUT') {
                  set({ user: null, token: null, isAuthenticated: false });
               }
            });
            return () => subscription.unsubscribe();
         },
      }),
      {
         name: 'auth-storage',
         // Usamos el storage inteligente definido arriba
         storage: createJSONStorage(() => smartStorage),
         partialize: state => ({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
         }),
      },
   ),
);
