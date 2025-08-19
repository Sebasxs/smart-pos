import { HiOutlineUserGroup } from 'react-icons/hi2';

export const Users = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200 p-4">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
               <HiOutlineUserGroup size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Equipo</h1>
               <p className="text-zinc-400">Gestión de usuarios y permisos</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de <code>authorized_users</code> y <code>profiles</code>. Administración de
               accesos, roles (Admin, Cajero) y perfiles de usuario del sistema.
            </p>
         </div>
      </div>
   );
};
