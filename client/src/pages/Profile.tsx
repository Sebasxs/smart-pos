import { HiOutlineUserCircle } from 'react-icons/hi2';
import { useAuthStore } from '../store/authStore';

export const Profile = () => {
   const { user } = useAuthStore();

   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
               <HiOutlineUserCircle size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Perfil de Usuario</h1>
               <p className="text-zinc-400">Información de tu cuenta</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
               {user?.avatar_url ? (
                  <img
                     src={user.avatar_url}
                     alt={user.full_name}
                     className="w-20 h-20 rounded-full object-cover"
                  />
               ) : (
                  <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                     <HiOutlineUserCircle size={48} />
                  </div>
               )}
               <div>
                  <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
                  <p className="text-zinc-400 capitalize">{user?.role}</p>
                  <p className="text-zinc-500 text-sm">{user?.email}</p>
               </div>
            </div>

            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Visualización y edición de datos de la tabla <code>profiles</code>.
            </p>

            <div className="mt-8 pt-6 border-t border-zinc-800">
               <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
               >
                  Cerrar Sesión
               </button>
            </div>
         </div>
      </div>
   );
};
