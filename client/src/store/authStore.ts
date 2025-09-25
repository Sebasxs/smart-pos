import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../utils/supabase';
import { usePreferencesStore } from './usePreferencesStore';
import { isTokenExpired } from '../utils/jwt';
import { roleBasedStorage } from './roleBasedStorage';

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
   isInitialized: boolean;

   login: (user: User, token: string) => void;
   logout: () => Promise<void>;
   initializeAuth: () => Promise<(() => void) | undefined>;
   fetchProfile: (session: any) => Promise<void>;
   getAccessToken: () => Promise<string | null>;
   forceInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         isAuthenticated: false,
         isInitialized: false,

         login: (user, token) => {
            set({ user, token, isAuthenticated: true, isInitialized: true });
         },

         logout: async () => {
            console.log('🔒 Cerrando sesión...');
            set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
            roleBasedStorage.removeItem('auth-storage');

            await supabase.auth.signOut().catch(console.warn);
         },

         forceInitialized: () => {
            if (!get().isInitialized) {
               console.warn('⚠️ Force Initialized activado por timeout.');
               set({ isInitialized: true });
            }
         },

         initializeAuth: async () => {
            const state = get();

            // 1. Local Fast Path
            if (state.token) {
               if (!isTokenExpired(state.token)) {
                  console.log('⚡ Token válido localmente. Acceso rápido concedido.');
                  set({ isAuthenticated: true, isInitialized: true });

                  if (state.user?.role === 'cashier') return;
               } else {
                  console.warn('🕒 Token expirado localmente. Limpiando sesión.');
                  set({ user: null, token: null, isAuthenticated: false });
               }
            }

            // 2. Supabase Events
            const {
               data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
               if (event === 'SIGNED_IN' && session) {
                  set({ token: session.access_token, isAuthenticated: true });
                  if (!get().user?.full_name) {
                     get().fetchProfile(session);
                  }
               } else if (event === 'SIGNED_OUT') {
                  if (get().user?.role !== 'cashier') {
                     set({ user: null, token: null, isAuthenticated: false });
                  }
               } else if (event === 'TOKEN_REFRESHED' && session) {
                  console.log('🔄 Token refrescado automáticamente');
                  set({ token: session.access_token });
               }
            });

            // 3. Server Verification (Admins/OAuth)
            if (state.user?.role !== 'cashier') {
               try {
                  const {
                     data: { session },
                     error,
                  } = await supabase.auth.getSession();

                  if (error) throw error;

                  if (session) {
                     set({ token: session.access_token, isAuthenticated: true });
                     get().fetchProfile(session);
                  } else if (!state.token) {
                     set({ isAuthenticated: false });
                  }
               } catch (err) {
                  console.warn('⚠️ Error de red verificando sesión (Modo Offline activo):', err);
               }
            }

            if (!get().isInitialized) set({ isInitialized: true });

            return () => subscription.unsubscribe();
         },

         fetchProfile: async (session: any) => {
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
               console.error('⚠️ Error cargando perfil (Background):', e);
            }
         },

         getAccessToken: async () => {
            const state = get();

            if (state.token && isTokenExpired(state.token)) {
               console.warn('Token expirado al intentar usarlo. Cerrando sesión.');
               get().logout();
               return null;
            }

            // Cashiers use custom tokens with long duration
            if (state.user?.role === 'cashier') return state.token;

            // For admins, try refreshing Supabase session if needed
            try {
               const { data } = await supabase.auth.getSession();
               return data.session?.access_token || state.token;
            } catch {
               return state.token;
            }
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
