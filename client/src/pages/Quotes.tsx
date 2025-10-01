import { HiOutlinePlus, HiOutlineCheck, HiOutlineXMark, HiOutlineClock } from 'react-icons/hi2';
import { Button } from '../components/ui/Button';
import { SmartNumber } from '../components/ui/SmartNumber';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

const QUOTES = [
   {
      id: 'COT-001',
      client: 'Constructora Bolivar',
      total: 5400000,
      date: '2023-10-20',
      status: 'pending',
      items: 15,
   },
   {
      id: 'COT-002',
      client: 'Pedro Pascal',
      total: 120000,
      date: '2023-10-21',
      status: 'accepted',
      items: 2,
   },
   {
      id: 'COT-003',
      client: 'Restaurante El Cielo',
      total: 890000,
      date: '2023-10-18',
      status: 'rejected',
      items: 5,
   },
];

const StatusBadge = ({ status }: { status: string }) => {
   const styles =
      {
         pending: 'bg-brand-quotes-bg text-brand-quotes-main',
         accepted: 'bg-success-bg text-success-text',
         rejected: 'bg-danger-bg text-danger-text',
      }[status] || 'bg-surface-highlight text-text-dim';

   const icons = { pending: HiOutlineClock, accepted: HiOutlineCheck, rejected: HiOutlineXMark };
   const Icon = icons[status as keyof typeof icons] || HiOutlineClock;

   return (
      <span
         className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider',
            styles,
         )}
      >
         <Icon size={12} />
         {status === 'pending' ? 'Pendiente' : status === 'accepted' ? 'Aprobada' : 'Rechazada'}
      </span>
   );
};

export const Quotes = () => {
   return (
      <div className="flex flex-col h-full w-full bg-canvas overflow-hidden">
         <PageHeader>
            <h1 className="flex-1 text-xl font-bold text-text-main tracking-tight truncate">
               Cotizaciones
            </h1>
            <Button
               variant="primary"
               className="h-10 px-4 bg-brand-quotes-solid hover:bg-brand-quotes-solid-hover text-white shadow-lg shadow-brand-quotes-solid/20"
            >
               <HiOutlinePlus size={18} className="sm:mr-2" />
               <span className="hidden sm:inline">Nueva Cotización</span>
            </Button>
         </PageHeader>

         <main className="flex-1 p-4 md:p-6 min-h-0 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {QUOTES.map(quote => (
                  <div
                     key={quote.id}
                     className="bg-surface hover:bg-surface-highlight/50 rounded-2xl p-5 transition-all group cursor-pointer shadow-sm relative overflow-hidden"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-mono font-bold text-text-dim uppercase tracking-widest">
                              {quote.id}
                           </span>
                           <h3 className="font-bold text-text-main text-base truncate max-w-[180px]">
                              {quote.client}
                           </h3>
                        </div>
                        <StatusBadge status={quote.status} />
                     </div>

                     <div className="flex items-end justify-between pt-4 border-t border-border/10">
                        <div className="flex flex-col">
                           <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                              Total Estimado
                           </span>
                           <span className="font-mono text-lg font-black text-text-main">
                              <SmartNumber value={quote.total} variant="currency" />
                           </span>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-text-dim font-medium">{quote.items} items</p>
                           <p className="text-[10px] text-text-dim opacity-70">{quote.date}</p>
                        </div>
                     </div>
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-quotes-main opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               ))}

               <button className="bg-surface/30 hover:bg-surface-highlight/30 rounded-2xl p-5 flex flex-col items-center justify-center text-text-muted gap-3 transition-all h-[180px] cursor-pointer group border-2 border-dashed border-border/20 hover:border-brand-quotes-main/30">
                  <div className="w-12 h-12 rounded-full bg-surface group-hover:scale-110 transition-transform flex items-center justify-center group-hover:text-brand-quotes-main shadow-sm">
                     <HiOutlinePlus size={24} />
                  </div>
                  <span className="text-sm font-medium">Crear cotización rápida</span>
               </button>
            </div>
         </main>
      </div>
   );
};
