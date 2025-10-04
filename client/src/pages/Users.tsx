import { useState } from 'react';
import { HiOutlinePlus, HiOutlineShieldCheck } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { cn } from '../utils/cn';

const USERS = [
   {
      id: '1',
      full_name: 'Administrador',
      email: 'admin@copos.app',
      role: 'super_admin',
      job_title: 'Gerente',
      status: 'active',
      avatar_initial: 'A',
   },
   {
      id: '2',
      full_name: 'Juan Pérez',
      email: 'juan@copos.app',
      role: 'cashier',
      job_title: 'Cajero',
      status: 'active',
      avatar_initial: 'J',
   },
];

const RoleBadge = ({ role }: { role: string }) => {
   const styles =
      {
         super_admin: 'bg-brand-users-bg text-brand-users-main',
         admin: 'bg-brand-suppliers-bg text-brand-suppliers-main',
         cashier: 'bg-brand-purchases-bg text-brand-purchases-main',
      }[role] || 'bg-surface-highlight text-text-dim';
   return (
      <span
         className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
            styles,
         )}
      >
         <HiOutlineShieldCheck size={12} /> {role === 'super_admin' ? 'Propietario' : role}
      </span>
   );
};

export const Users = () => {
   const [searchTerm, setSearchTerm] = useState('');

   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader
            title="Equipo"
            search={
               <SearchInput
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm('')}
                  placeholder="Buscar por nombre o email..."
               />
            }
            actions={
               <Button
                  variant="primary"
                  className="bg-brand-users-solid hover:bg-brand-users-solid-hover text-white shadow-lg shadow-brand-users-solid/20"
               >
                  <HiOutlinePlus size={18} />
                  <span className="hidden sm:inline">Nuevo Usuario</span>
               </Button>
            }
         />

         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 max-w-[1600px] mx-auto w-full">
            <div className="flex-1 bg-surface rounded-2xl overflow-hidden shadow-sm relative min-h-0 flex flex-col">
               <div className="overflow-x-auto custom-scrollbar flex-1">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-surface-highlight/50 backdrop-blur-sm text-text-muted text-[10px] uppercase tracking-wider font-bold border-b border-border/40 sticky top-0 z-10">
                        <tr>
                           <th className="px-6 py-4">Usuario</th>
                           <th className="px-6 py-4">Rol / Cargo</th>
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
                              <td className="px-6 py-4 text-right">
                                 <Button variant="ghost" size="sm" className="text-xs">
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
