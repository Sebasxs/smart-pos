import { HiOutlineShieldCheck, HiOutlineWrenchScrewdriver, HiOutlineClock } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

// Mock Data
const WARRANTIES = [
   {
      id: 'RMA-2023-001',
      customer: 'Carlos Ruiz',
      product: 'Parlante Bluetooth JBL',
      issue: 'No carga la batería',
      status: 'in_progress',
      date: 'Hace 2 días',
   },
   {
      id: 'RMA-2023-002',
      customer: 'Ana María Polo',
      product: 'TV Samsung 50"',
      issue: 'Pantalla parpadea',
      status: 'received',
      date: 'Hoy',
   },
];

const WarrantyCard = ({ data }: { data: (typeof WARRANTIES)[0] }) => {
   const statusStyles =
      {
         received: 'bg-brand-kardex-bg text-brand-kardex-main',
         in_progress: 'bg-brand-adjustments-bg text-brand-adjustments-main',
         completed: 'bg-success-bg text-success-text',
      }[data.status] || 'bg-surface-highlight text-text-dim';

   const statusLabels = {
      received: 'Recibido',
      in_progress: 'En Revisión',
      completed: 'Finalizado',
   };

   return (
      <div className="bg-surface hover:bg-surface-highlight/30 rounded-2xl p-5 transition-all group cursor-pointer shadow-sm hover:shadow-md flex flex-col h-full">
         <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-[10px] font-bold text-text-dim bg-canvas/50 px-2 py-1 rounded-md">
               {data.id}
            </span>
            <span
               className={cn(
                  'px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
                  statusStyles,
               )}
            >
               {statusLabels[data.status as keyof typeof statusLabels]}
            </span>
         </div>

         <h3 className="font-bold text-text-main text-sm mb-1">{data.product}</h3>
         <p className="text-xs text-text-secondary mb-4">De: {data.customer}</p>

         <div className="flex items-start gap-2.5 p-3 bg-surface-highlight/30 rounded-xl mb-auto">
            <HiOutlineWrenchScrewdriver className="text-text-muted shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-text-dim italic line-clamp-2">"{data.issue}"</p>
         </div>

         <div className="flex items-center gap-1.5 text-[10px] text-text-muted border-t border-border/20 pt-3 mt-4 font-medium uppercase tracking-wide">
            <HiOutlineClock size={12} />
            <span>Recibido: {data.date}</span>
         </div>
      </div>
   );
};

export const Warranties = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         {/* HEADER */}
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Garantías
            </h1>

            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-warranties-solid hover:bg-brand-warranties-solid-hover text-white shadow-lg shadow-brand-warranties-solid/20"
            >
               <HiOutlineShieldCheck size={18} className="sm:mr-2" />
               <span className="hidden sm:inline">Nuevo Caso</span>
            </Button>
         </PageHeader>

         {/* CONTENT */}
         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
               {/* Column: Recibidos */}
               <div className="flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-2 pb-2 mb-2 px-1">
                     <span className="w-2 h-2 rounded-full bg-brand-kardex-main shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                     <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
                        Recibidos
                     </h3>
                     <span className="ml-auto text-[10px] font-bold text-text-dim bg-surface px-1.5 py-0.5 rounded-md">
                        1
                     </span>
                  </div>
                  {WARRANTIES.filter(w => w.status === 'received').map(w => (
                     <WarrantyCard key={w.id} data={w} />
                  ))}
               </div>

               {/* Column: En Revisión */}
               <div className="flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-2 pb-2 mb-2 px-1">
                     <span className="w-2 h-2 rounded-full bg-brand-adjustments-main shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                     <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
                        En Revisión
                     </h3>
                     <span className="ml-auto text-[10px] font-bold text-text-dim bg-surface px-1.5 py-0.5 rounded-md">
                        1
                     </span>
                  </div>
                  {WARRANTIES.filter(w => w.status === 'in_progress').map(w => (
                     <WarrantyCard key={w.id} data={w} />
                  ))}
               </div>

               {/* Column: Listos (Empty Example) */}
               <div className="flex flex-col gap-3 min-w-0">
                  <div className="flex items-center gap-2 pb-2 mb-2 px-1">
                     <span className="w-2 h-2 rounded-full bg-brand-purchases-main shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                     <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
                        Listos
                     </h3>
                     <span className="ml-auto text-[10px] font-bold text-text-dim bg-surface px-1.5 py-0.5 rounded-md">
                        0
                     </span>
                  </div>
                  <div className="h-24 rounded-2xl border-2 border-dashed border-border/30 flex items-center justify-center text-xs text-text-dim/50 font-medium select-none bg-surface/10">
                     Sin casos listos
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};
