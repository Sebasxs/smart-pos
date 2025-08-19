import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../utils/supabase';

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
}

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
            localStorage.removeItem('auth-storage');
            Object.keys(localStorage).forEach(key => {
               if (key.startsWith('sb-')) localStorage.removeItem(key);
            });
            supabase.auth.signOut().catch(err => {
               console.warn('Supabase signOut error (ignorado):', err);
            });
            window.location.href = '/login';
         },

         checkSession: async () => {
            try {
               const {
                  data: { session },
               } = await supabase.auth.getSession();
               if (session) {
                  await get().fetchProfile(session);
               } else {
                  if (get().user?.role === 'cashier') {
                     return;
                  }

                  set({ user: null, token: null, isAuthenticated: false });
               }
            } catch (error) {
               console.error('Session check failed:', error);
               set({ user: null, token: null, isAuthenticated: false });
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
               } else {
                  console.error('Error fetching profile:', error);
               }
            } catch (e) {
               console.error('Fetch profile exception:', e);
               set({ user: null, token: null, isAuthenticated: false });
            }
         },

         initializeListener: () => {
            const {
               data: { subscription },
            } = supabase.auth.onAuthStateChange(async (event, session) => {
               if (event === 'SIGNED_IN' && session) {
                  await get().fetchProfile(session);
               } else if (event === 'SIGNED_OUT') {
                  set({ user: null, token: null, isAuthenticated: false });
               }
            });
            return () => subscription.unsubscribe();
         },
      }),
      {
         name: 'auth-storage',
         storage: createJSONStorage(() => localStorage),
         partialize: state => {
            if (state.user?.role === 'cashier') {
               return {};
            }

            return {
               user: state.user,
               token: state.token,
               isAuthenticated: state.isAuthenticated,
            };
         },
      },
   ),
);
