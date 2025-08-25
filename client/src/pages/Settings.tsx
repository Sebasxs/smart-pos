import { useState } from 'react';
import { HiOutlineUser, HiOutlineBuildingOffice, HiOutlineCog } from 'react-icons/hi2';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import { PersonalSettings } from '../components/settings/PersonalSettings';
import { CompanySettings } from '../components/settings/CompanySettings';

type TabType = 'personal' | 'company' | 'billing';

const NavButton = ({ active, onClick, icon, label }: any) => (
   <button
      onClick={onClick}
      className={`
         w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 group
         ${
            active
               ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
               : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
         }
      `}
   >
      <div
         className={`transition-colors ${
            active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
         }`}
      >
         {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
   </button>
);

export const Settings = () => {
   const { user } = useAuthStore();
   const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
   const [activeTab, setActiveTab] = useState<TabType>('personal');

   return (
      <div className="flex flex-col h-full gap-6 max-w-6xl mx-auto w-full p-2">
         {/* HEADER */}
         <div className="flex items-center gap-4 shrink-0 pb-4 border-b border-zinc-800">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-700/50 shadow-lg">
               <HiOutlineCog size={26} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
               <p className="text-zinc-400 text-sm">
                  Administra las preferencias generales y de usuario
               </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start flex-1 min-h-0">
            <nav className="flex flex-col gap-2 shrink-0 sticky top-0">
               <p className="px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 mt-1">
                  General
               </p>

               <NavButton
                  active={activeTab === 'personal'}
                  onClick={() => setActiveTab('personal')}
                  icon={<HiOutlineUser size={20} />}
                  label="Preferencias"
               />

               {isAdmin && (
                  <NavButton
                     active={activeTab === 'company'}
                     onClick={() => setActiveTab('company')}
                     icon={<HiOutlineBuildingOffice size={20} />}
                     label="Empresa"
                  />
               )}

               {isAdmin && (
                  <>
                     <div className="my-2 border-t border-zinc-800/50 mx-4" />
                     <p className="px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                        Facturación
                     </p>
                     <button
                        className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-zinc-500 transition-all cursor-not-allowed opacity-60"
                        disabled
                     >
                        <HiOutlineReceiptTax size={20} />
                        <span className="font-medium text-sm">Resoluciones DIAN</span>
                     </button>
                  </>
               )}
            </nav>

            <div className="flex flex-col min-w-0">
               {activeTab === 'personal' && <PersonalSettings />}
               {activeTab === 'company' && isAdmin && <CompanySettings />}
            </div>
         </div>
      </div>
   );
};
