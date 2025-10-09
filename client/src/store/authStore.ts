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

let refreshPromise: Promise<string | null> | null = null;

const authChannel = new BroadcastChannel('copos_auth_sync');

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => {
         authChannel.onmessage = event => {
            const { type, payload } = event.data;

            switch (type) {
               case 'AUTH_UPDATE':
                  set({
                     user: payload.user,
                     token: payload.token,
                     isAuthenticated: !!payload.token,
                  });
                  break;

               case 'LOGOUT':
                  set({ user: null, token: null, isAuthenticated: false });
                  break;

               case 'REQUEST_SESSION_DATA':
                  if (get().isAuthenticated && get().token) {
                     authChannel.postMessage({
                        type: 'SEND_SESSION_DATA',
                        payload: { user: get().user, token: get().token },
                     });
                  }
                  break;

               case 'SEND_SESSION_DATA':
                  if (!get().isAuthenticated && payload.token) {
                     set({
                        user: payload.user,
                        token: payload.token,
                        isAuthenticated: true,
                        isInitialized: true,
                     });
                  }
                  break;
            }
         };

         return {
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: false,

            login: (user, token) => {
               set({ user, token, isAuthenticated: true, isInitialized: true });
               authChannel.postMessage({ type: 'AUTH_UPDATE', payload: { user, token } });
            },

            logout: async () => {
               const state = get();
               if (!state.isAuthenticated && !state.user) return;

               console.log('🔒 Cerrando sesión...');
               set({ user: null, token: null, isAuthenticated: false });

               authChannel.postMessage({ type: 'LOGOUT' });

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

               if (!state.isAuthenticated) {
                  authChannel.postMessage({ type: 'REQUEST_SESSION_DATA' });
               }

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

            getAccessToken: async () => {
               const state = get();
               let currentToken = state.token;

               if (!currentToken) return null;
               if (!isTokenExpired(currentToken)) return currentToken;

               if (state.user?.role === 'cashier') {
                  get().logout();
                  return null;
               }

               if (refreshPromise) return await refreshPromise;

               refreshPromise = (async () => {
                  console.log('🔄 Token expirado. Iniciando renovación...');
                  const { data, error } = await supabase.auth.getSession();

                  if (error || !data.session) {
                     console.warn('⛔ Falló la renovación. Logout forzado.');
                     get().logout();
                     return null;
                  }

                  const newToken = data.session.access_token;
                  set({ token: newToken });

                  authChannel.postMessage({
                     type: 'AUTH_UPDATE',
                     payload: { user: state.user, token: newToken },
                  });

                  console.log('✅ Token renovado exitosamente.');
                  return newToken;
               })();

               try {
                  return await refreshPromise;
               } finally {
                  refreshPromise = null;
               }
            },
         };
      },
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
