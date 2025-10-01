import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../utils/supabase';
import {
   HiOutlineArrowRight,
   HiOutlineExclamationTriangle,
   HiOutlineUser,
   HiOutlineLockClosed,
} from 'react-icons/hi2';
import { FullPageLoader } from '../components/ui/FullPageLoader';
import { useCashShiftStore } from '../store/cashShiftStore';
import { PosBackground } from '../components/auth/PosBackground';
import { cn } from '../utils/cn';
import { Logo } from '../components/ui/Logo';
import { StatusPivot } from '../components/auth/StatusPivot';
import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL;

export const Login = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { login, isAuthenticated } = useAuthStore();

   const [loading, setLoading] = useState(false);
   const [googleLoading, setGoogleLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const [nickname, setNickname] = useState('');
   const [pin, setPin] = useState('');
   const [activeField, setActiveField] = useState<'nickname' | 'pin' | null>(null);

   const isProcessingOAuth =
      window.location.hash.includes('access_token') ||
      window.location.hash.includes('type=recovery');

   useEffect(() => {
      if (isAuthenticated) {
         const from = (location.state as any)?.from?.pathname || '/billing';
         navigate(from, { replace: true });
      }
   }, [isAuthenticated, navigate, location]);

   useEffect(() => {
      const hash = window.location.hash;
      if (!hash || !hash.includes('error_description')) return;

      const params = new URLSearchParams(hash.substring(1));
      const errorDesc = params.get('error_description');

      if (errorDesc) {
         const decodedError = decodeURIComponent(errorDesc).replace(/\+/g, ' ');
         window.history.replaceState(null, '', window.location.pathname);
         setError(decodedError);
      }
   }, []);

   if (isProcessingOAuth && !error && !isAuthenticated) {
      return <FullPageLoader message="Validando credenciales..." />;
   }

   if (isAuthenticated) return null;

   const handleManualLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);

      try {
         const response = await fetch(`${API_URL}/api/auth/login/cashier`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, pin }),
            signal: controller.signal,
         });

         clearTimeout(timeoutId);
         const data = await response.json();

         if (!response.ok) throw new Error(data.error || 'Credenciales inválidas');

         login(data.user, data.token);
         useCashShiftStore.getState().checkShiftStatus().catch(console.error);
      } catch (err: any) {
         console.error(err);
         if (err.name === 'AbortError') {
            setError('El servidor tarda en responder. Revisa tu conexión.');
         } else {
            setError(err.message || 'Error de conexión');
         }
      } finally {
         setLoading(false);
      }
   };

   const handleGoogleLogin = async () => {
      setGoogleLoading(true);
      setError(null);
      try {
         const redirectUrl = `${window.location.origin}/login`;
         const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl },
         });
         if (error) throw error;
      } catch (err: any) {
         console.error('Login error:', err);
         setError(err.message || 'Error al conectar con Google');
         setGoogleLoading(false);
      }
   };

   return (
      <div className="min-h-screen w-full bg-canvas flex items-center justify-center relative overflow-hidden font-sans selection:bg-primary/30">
         {/* Fondo animado con opacidad ajustada */}
         <div className="opacity-40">
            <PosBackground />
         </div>

         {/* Contenedor Principal */}
         <div className="w-full max-w-[320px] relative z-10 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center">
            {/* Tarjeta de Login */}
            <div className="w-full bg-surface rounded-[32px] shadow-xl shadow-black/10 overflow-hidden relative ring-1 ring-white/5 border border-border/30">
               {/* --- LOGO HEADER --- */}
               <div className="pt-8 pb-6 px-8 flex flex-col items-center justify-center select-none relative">
                  {/* Luz decorativa superior */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-text-main/10 to-transparent" />
                  <Logo />
                  <StatusPivot />
               </div>

               {/* --- FORM SECTION --- */}
               <div className="px-8 pb-8 flex flex-col items-center">
                  {/* Mensaje de Error */}
                  <div
                     className={cn(
                        'w-full transition-all duration-300 overflow-hidden',
                        error ? 'max-h-20 mb-6 opacity-100' : 'max-h-0 mb-0 opacity-0',
                     )}
                  >
                     <div className="p-3.5 bg-danger-bg border border-danger/20 rounded-xl text-danger-text text-xs flex gap-3 items-center shadow-sm">
                        <div className="p-1.5 bg-danger/20 rounded-full shrink-0">
                           <HiOutlineExclamationTriangle className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{error}</span>
                     </div>
                  </div>

                  <form onSubmit={handleManualLogin} className="flex flex-col gap-5 w-full">
                     <div className="space-y-2">
                        {/* Usuario Input */}
                        <div
                           className={cn(
                              'relative group transition-all duration-300 rounded-xl p-[1px]',
                              activeField === 'nickname'
                                 ? 'bg-surface-active shadow-md shadow-black/10'
                                 : 'bg-transparent',
                           )}
                        >
                           <div className="relative bg-surface-active/60 rounded-xl overflow-hidden border border-transparent group-hover:border-border-hover transition-colors">
                              <div
                                 className={cn(
                                    'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10',
                                    activeField === 'nickname' || nickname
                                       ? 'text-text-secondary'
                                       : 'text-text-dim',
                                 )}
                              >
                                 <HiOutlineUser size={20} />
                              </div>
                              <input
                                 type="text"
                                 value={nickname}
                                 onFocus={() => setActiveField('nickname')}
                                 onBlur={() => setActiveField(null)}
                                 onChange={e => setNickname(e.target.value)}
                                 className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-text-secondary placeholder:text-text-dim outline-none text-sm font-mono h-10 transition-colors capitalize"
                                 placeholder="Usuario"
                                 required
                                 autoComplete="new-password"
                                 disabled={loading || googleLoading}
                                 autoFocus
                              />
                           </div>
                        </div>

                        {/* PIN Input */}
                        <div
                           className={cn(
                              'relative group transition-all duration-300 rounded-xl p-[1px]',
                              activeField === 'pin'
                                 ? 'bg-surface-active shadow-md shadow-black/10'
                                 : 'bg-transparent',
                           )}
                        >
                           <div className="relative bg-surface-active/60 rounded-xl overflow-hidden border border-transparent group-hover:border-border-hover transition-colors">
                              <div
                                 className={cn(
                                    'absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10',
                                    activeField === 'pin' || pin
                                       ? 'text-text-secondary'
                                       : 'text-text-dim',
                                 )}
                              >
                                 <HiOutlineLockClosed size={20} />
                              </div>
                              <input
                                 type="password"
                                 value={pin}
                                 onFocus={() => setActiveField('pin')}
                                 onBlur={() => setActiveField(null)}
                                 inputMode="numeric"
                                 maxLength={4}
                                 onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) setPin(val);
                                 }}
                                 className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-text-secondary placeholder:text-text-dim outline-none text-sm font-mono tracking-[0.4em] h-10 transition-colors"
                                 placeholder="PIN"
                                 required
                                 autoComplete="current-password"
                                 disabled={loading || googleLoading}
                              />
                           </div>
                        </div>
                     </div>

                     <Button
                        type="submit"
                        variant="white"
                        isLoading={loading}
                        disabled={loading || googleLoading}
                        className="w-full h-12 rounded-xl text-lg active:scale-[0.98]"
                     >
                        <div className="flex items-center gap-2">
                           <span>Ingresar</span>
                           <HiOutlineArrowRight className="w-4 h-4" />
                        </div>
                     </Button>
                  </form>

                  <div className="relative my-6 w-full flex items-center justify-center">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                     </div>
                     <div className="relative flex justify-center">
                        <span className="bg-surface px-4 text-[10px] font-bold text-text-dim uppercase tracking-widest select-none">
                           o acceder con
                        </span>
                     </div>
                  </div>

                  {/* Botón Google */}
                  <Button
                     variant="secondary"
                     onClick={handleGoogleLogin}
                     isLoading={googleLoading}
                     disabled={loading || googleLoading}
                     className="w-full h-11 rounded-xl text-sm border-border active:scale-[0.98]"
                  >
                     {!googleLoading && (
                        <>
                           <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                              <path
                                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                 fill="#4285F4"
                              />
                              <path
                                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                 fill="#34A853"
                              />
                              <path
                                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                 fill="#FBBC05"
                              />
                              <path
                                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                 fill="#EA4335"
                              />
                           </svg>
                           <span className="text-text-secondary font-medium">Google</span>
                        </>
                     )}
                  </Button>
               </div>
            </div>

            <div className="mt-8 opacity-30 hover:opacity-60 transition-opacity duration-500 cursor-default">
               <p className="text-[10px] text-text-muted font-mono tracking-widest">
                  COPOS SYSTEM v1.0
               </p>
            </div>
         </div>
      </div>
   );
};
