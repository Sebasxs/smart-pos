import { useState, useEffect } from 'react';
import { HiOutlineUser, HiOutlineBuildingOffice2, HiOutlineCog6Tooth } from 'react-icons/hi2';
import { PersonalSettings } from '../components/settings/PersonalSettings';
import { CompanySettings } from '../components/settings/CompanySettings';
import { PageHeader } from '../components/layout/PageHeader';
import { useAuthStore } from '../store/authStore';
import { useOrganizationStore } from '../store/organizationStore';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

type Tab = 'personal' | 'company';

export const Settings = () => {
   const { user } = useAuthStore();
   const { settings, fetchSettings } = useOrganizationStore();
   const [activeTab, setActiveTab] = useState<Tab>('personal');

   useEffect(() => {
      fetchSettings();
   }, []);

   const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

   return (
      <div className="flex flex-col h-[100dvh] lg:h-full overflow-hidden bg-canvas">
         {/* HEADER UNIFICADO */}
         <PageHeader>
            {/* El grupo del título crece (flex-1) */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
               <h1 className="hidden sm:block text-xl font-bold text-text-main tracking-tight">
                  Configuración
               </h1>

               {/* Badges de Empresa */}
               <div className="flex items-center gap-3 bg-surface-highlight/40 px-3 py-1.5 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 text-text-dim font-bold uppercase tracking-widest shrink-0">
                     <HiOutlineBuildingOffice2 size={16} />
                     <span className="text-[10px] truncate max-w-[120px]">
                        {settings?.company_name || 'Empresa'}
                     </span>
                  </div>
                  {settings?.tax_id && (
                     <div className="flex items-center gap-2 border-l border-border/40 pl-3">
                        <span className="text-[10px] font-medium text-text-muted/80 tracking-wider">
                           NIT: {settings.tax_id}
                        </span>
                     </div>
                  )}
               </div>
            </div>

            {/* Derecha: Indicador de versión */}
            <div className="hidden sm:flex items-center gap-2 bg-surface-highlight/40 px-3 py-1.5 rounded-lg text-text-dim shrink-0">
               <HiOutlineCog6Tooth size={16} className="animate-spin-slow" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Versión v1.0</span>
            </div>
         </PageHeader>

         {/* CONTENEDOR PRINCIPAL CON MÁRGENES ESTÁNDAR */}
         <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-300">
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
               {/* SIDEBAR DE NAVEGACIÓN (TABS) */}
               <div className="w-full lg:w-64 flex flex-row lg:flex-col flex-wrap gap-2 shrink-0">
                  <Button
                     variant="ghost"
                     onClick={() => setActiveTab('personal')}
                     className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-left group justify-start h-auto active:scale-100 border-none',
                        activeTab === 'personal'
                           ? 'bg-surface text-text-main shadow-sm'
                           : 'text-text-muted hover:text-text-main hover:bg-surface-highlight/50',
                     )}
                  >
                     <HiOutlineUser
                        size={20}
                        className={cn(
                           'transition-colors',
                           activeTab === 'personal'
                              ? 'text-primary-text'
                              : 'text-text-dim group-hover:text-text-secondary',
                        )}
                     />
                     <span>Mis Preferencias</span>
                  </Button>

                  {isAdmin && (
                     <Button
                        variant="ghost"
                        onClick={() => setActiveTab('company')}
                        className={cn(
                           'flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-left group justify-start h-auto active:scale-100 border-none',
                           activeTab === 'company'
                              ? 'bg-surface text-text-main shadow-sm'
                              : 'text-text-muted hover:text-text-main hover:bg-surface-highlight/50',
                        )}
                     >
                        <HiOutlineBuildingOffice2
                           size={20}
                           className={cn(
                              'transition-colors',
                              activeTab === 'company'
                                 ? 'text-brand-balances-main'
                                 : 'text-text-dim group-hover:text-text-secondary',
                           )}
                        />
                        <span>Empresa y Facturación</span>
                     </Button>
                  )}
               </div>

               {/* ÁREA DE CONTENIDO */}
               <div className="flex-1 bg-surface/50 rounded-2xl overflow-y-auto custom-scrollbar p-6 lg:p-8 backdrop-blur-sm shadow-sm">
                  {activeTab === 'personal' && <PersonalSettings />}
                  {activeTab === 'company' && <CompanySettings />}
               </div>
            </div>
         </main>
      </div>
   );
};
