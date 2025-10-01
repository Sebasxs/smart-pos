import { useState } from 'react';
import {
   HiOutlinePlus,
   HiOutlineMagnifyingGlass,
   HiOutlineShieldCheck,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

// Mock Data
const USERS = [
   {
      id: '1',
      full_name: 'Administrador Principal',
      email: 'admin@copos.app',
      role: 'super_admin',
      job_title: 'Gerente General',
      status: 'active',
      avatar_initial: 'A',
   },
   {
      id: '2',
      full_name: 'Juan Pérez',
      email: 'juan.perez@copos.app',
      role: 'cashier',
      job_title: 'Cajero Turno Mañana',
      status: 'active',
      avatar_initial: 'J',
   },
   {
      id: '3',
      full_name: 'María García',
      email: 'maria.garcia@copos.app',
      role: 'admin',
      job_title: 'Supervisora',
      status: 'inactive',
      avatar_initial: 'M',
   },
];

const RoleBadge = ({ role }: { role: string }) => {
   const styles =
      {
         super_admin: 'bg-brand-users-bg text-brand-users-main',
         admin: 'bg-brand-suppliers-bg text-brand-suppliers-main',
         cashier: 'bg-brand-purchases-bg text-brand-purchases-main',
      }[role] || 'bg-surface-highlight text-text-dim';

   const labels =
      { super_admin: 'Propietario', admin: 'Administrador', cashier: 'Cajero' }[role] || role;

   return (
      <span
         className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
            styles,
         )}
      >
         <HiOutlineShieldCheck size={12} />
         {labels}
      </span>
   );
};

export const Users = () => {
   const [searchTerm, setSearchTerm] = useState('');

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="hidden md:block text-xl font-bold text-text-main tracking-tight shrink-0">
               Equipo
            </h1>

            {/* Search Bar integrada en Header */}
            <div className="flex-1 flex justify-start md:justify-center min-w-0">
               <div className="relative group h-10 w-full max-w-[400px] transition-all duration-300">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10">
                     <HiOutlineMagnifyingGlass size={18} />
                  </div>
                  <input
                     type="text"
                     placeholder="Buscar por nombre o email..."
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className="w-full h-full bg-surface-highlight/40 hover:bg-surface-highlight/60 text-sm text-text-main placeholder:text-text-dim rounded-xl pl-10 pr-10 outline-none transition-all focus:bg-surface-active/60 focus:shadow-sm"
                  />
                  {searchTerm && (
                     <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main p-0.5 rounded-full cursor-pointer"
                     >
                        <HiOutlineXMark size={16} />
                     </button>
                  )}
               </div>
            </div>

            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-users-solid hover:bg-brand-users-solid-hover text-white shadow-lg shadow-brand-users-solid/20"
            >
               <HiOutlinePlus size={18} className="md:mr-2" />
               <span className="hidden md:inline">Nuevo Usuario</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
            {/* List Container */}
            <div className="flex-1 bg-surface rounded-2xl overflow-hidden shadow-sm relative min-h-0 flex flex-col">
               <div className="overflow-x-auto custom-scrollbar flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-surface-highlight/50 backdrop-blur-sm text-text-muted text-[10px] uppercase tracking-wider font-bold border-b border-border/40 sticky top-0 z-10">
                        <tr>
                           <th className="px-6 py-4">Usuario</th>
                           <th className="px-6 py-4">Rol / Cargo</th>
                           <th className="px-6 py-4">Estado</th>
                           <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20 text-sm">
                        {USERS.map(user => (
                           <tr
                              key={user.id}
                              className="group hover:bg-surface-highlight/30 transition-colors"
                           >
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-surface-active flex items-center justify-center text-text-secondary font-bold text-sm shadow-inner">
                                       {user.avatar_initial}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="font-bold text-text-main">
                                          {user.full_name}
                                       </span>
                                       <span className="text-xs text-text-dim">{user.email}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col gap-1.5 items-start">
                                    <RoleBadge role={user.role} />
                                    <span className="text-xs text-text-secondary font-medium">
                                       {user.job_title}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={cn(
                                       'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full',
                                       user.status === 'active'
                                          ? 'bg-success-bg/50 text-success-text'
                                          : 'bg-surface-highlight text-text-dim',
                                    )}
                                 >
                                    <span
                                       className={cn(
                                          'w-1.5 h-1.5 rounded-full',
                                          user.status === 'active' ? 'bg-success' : 'bg-text-dim',
                                       )}
                                    />
                                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-text-dim hover:text-text-main font-bold text-xs active:scale-100 hover:bg-surface-active"
                                 >
                                    Editar
                                 </Button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </main>
      </div>
   );
};
