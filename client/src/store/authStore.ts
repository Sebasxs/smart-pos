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
   isSessionChecked: boolean;

   login: (user: User, token: string) => void;
   logout: () => void;
   checkSession: () => Promise<void>;
   fetchProfile: (session: any) => Promise<void>;
   initializeListener: () => () => void;
   getAccessToken: () => Promise<string | null>;
}

const smartStorage: StateStorage = {
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

export const useAuthStore = create<AuthState>()(
   persist(
      (set, get) => ({
         user: null,
         token: null,
         isAuthenticated: false,
         isSessionChecked: false,

         login: (user, token) => {
            set({ user, token, isAuthenticated: true, isSessionChecked: true });
         },

         logout: async () => {
            set({ user: null, token: null, isAuthenticated: false, isSessionChecked: true });
            localStorage.removeItem('auth-storage');
            sessionStorage.removeItem('auth-storage');
            supabase.auth.signOut().catch(console.warn);
         },

         checkSession: async () => {
            try {
               const state = get();

               if (state.user?.role === 'cashier' && state.token) {
                  set({ isSessionChecked: true });
                  return;
               }

               // Add timeout to prevent infinite waiting
               // We keep it reasonably short (5s) because users are waiting
               const sessionPromise = supabase.auth.getSession();
               const timeoutPromise = new Promise<{ data: { session: null }; error: Error }>(
                  (_, reject) => setTimeout(() => reject(new Error('Session check timeout')), 5000),
               );

               const result = await Promise.race([
                  sessionPromise,
                  timeoutPromise.then(() => ({
                     data: { session: null },
                     error: new Error('Timeout'),
                  })),
               ]);

               const { data, error } = result;

               if (error || !data.session) {
                  // Only logout if it's NOT a timeout error, or if we really have no session local
                  // If it's a timeout, we keep the local state and hope for the best (to work offline or retry)
                  const isTimeout =
                     error?.message === 'Timeout' || error?.message === 'Session check timeout';

                  if (!isTimeout && state.isAuthenticated) {
                     console.warn('Session invalid, logging out:', error);
                     get().logout();
                  } else if (isTimeout) {
                     console.warn(
                        'Session check timed out, proceeding with cached credentials if available',
                     );
                  }

                  set({ isSessionChecked: true });
                  return;
               }

               // Valid session found/refreshed
               if (data.session.access_token !== state.token) {
                  set({ token: data.session.access_token });
               }

               await get().fetchProfile(data.session);
               set({ isSessionChecked: true });
            } catch (error) {
               console.error('Check session fatal error:', error);
               set({ isSessionChecked: true });
               // Do not logout on fatal error, allow visual fail-gracefully
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
               }
            } catch (e) {
               console.error('Fetch profile exception:', e);
            }
         },

         getAccessToken: async () => {
            const state = get();

            // Cashiers use custom tokens that don't refresh via Supabase
            if (state.user?.role === 'cashier') {
               return state.token;
            }

            try {
               // Use a shorter timeout for token retrieval to keep UI snappy
               const sessionPromise = supabase.auth.getSession();
               const timeoutPromise = new Promise<{ data: { session: null }; error: Error }>(
                  (_, reject) => setTimeout(() => reject(new Error('Session timeout')), 2000),
               );

               const result = await Promise.race([
                  sessionPromise,
                  timeoutPromise.then(() => ({
                     data: { session: null },
                     error: new Error('Timeout'),
                  })),
               ]);

               const { data, error } = result;

               if (error || !data.session) {
                  // Return existing token if refresh fails/timeouts to avoid breaking the request immediately
                  return state.token;
               }

               set({ token: data.session.access_token });
               return data.session.access_token;
            } catch (error) {
               console.error('getAccessToken error:', error);
               return state.token; // Fallback to current token
            }
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
         storage: createJSONStorage(() => smartStorage),
         partialize: state => ({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
         }),
      },
   ),
);
