import { HiOutlineUserCircle, HiOutlineShieldCheck, HiOutlineEnvelope } from 'react-icons/hi2';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';

export const Profile = () => {
   const { user, logout } = useAuthStore();

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader>
            <h1 className="text-xl font-bold text-text-main tracking-tight">Mi Perfil</h1>
         </PageHeader>

         <main className="flex-1 p-4 md:p-6 flex items-center justify-center min-h-0 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-surface rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface-highlight/60 to-surface" />

               <div className="relative flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-canvas border-4 border-surface shadow-2xl flex items-center justify-center text-text-dim mb-6 overflow-hidden group">
                     {user?.avatar_url ? (
                        <img
                           src={user.avatar_url}
                           alt={user.full_name}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                     ) : (
                        <HiOutlineUserCircle size={64} className="opacity-30" />
                     )}
                  </div>

                  <div className="text-center mb-8">
                     <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                        {user?.full_name || 'Usuario'}
                     </h2>
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary-text text-[10px] font-bold uppercase tracking-widest">
                        <HiOutlineShieldCheck size={14} />
                        {user?.role === 'super_admin' ? 'Propietario' : user?.role}
                     </div>
                  </div>

                  <div className="w-full bg-canvas/40 rounded-2xl p-6 space-y-5 mb-8">
                     <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-surface rounded-xl text-text-dim shadow-sm">
                           <HiOutlineEnvelope size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                              Correo Electrónico
                           </span>
                           <span className="text-sm text-text-main font-medium truncate">
                              {user?.email || 'Sin correo asociado'}
                           </span>
                        </div>
                     </div>

                     {user?.job_title && (
                        <div className="flex items-center gap-4 pt-5 border-t border-border/10">
                           <div className="p-2.5 bg-surface rounded-xl text-text-dim shadow-sm">
                              <HiOutlineUserCircle size={20} />
                           </div>
                           <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
                                 Cargo / Título
                              </span>
                              <span className="text-sm text-text-main font-medium truncate">
                                 {user.job_title}
                              </span>
                           </div>
                        </div>
                     )}
                  </div>

                  <Button
                     onClick={() => logout()}
                     variant="danger"
                     className="w-full py-4 text-sm font-bold shadow-lg shadow-danger/10"
                  >
                     Cerrar Sesión
                  </Button>
               </div>
            </div>
         </main>
      </div>
   );
};
