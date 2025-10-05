import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const CRITICAL_STOCK = [
   {
      name: 'Mica Hidrogel Privacidad',
      stock: 1,
      pred: 'Alta rotación',
      badgeClass: 'bg-danger-bg/50 text-danger-text',
   },
   {
      name: 'Cable Lightning 1M',
      stock: 2,
      pred: 'Alta rotación',
      badgeClass: 'bg-danger-bg/50 text-danger-text',
   },
   {
      name: 'Audífonos Basic 2',
      stock: 5,
      pred: 'Pico de venta',
      badgeClass: 'bg-warning-bg/50 text-warning-text',
   },
   {
      name: 'Cargador 25W Original',
      stock: 3,
      pred: 'Demanda constante',
      badgeClass: 'bg-warning-bg/50 text-warning-text',
   },
   {
      name: 'Powerbank 10k mAh',
      stock: 2,
      pred: 'Baja rotación',
      badgeClass: 'bg-surface-active/50 text-text-dim',
   },
];

export const StockWidget = () => (
   <div className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden">
      <SectionHeader
         title="Stock Crítico"
         icon={HiOutlineExclamationTriangle}
         iconClassName="text-danger-text"
         iconContainerClassName="bg-danger-bg"
         actions={
            <Button
               variant="secondary"
               size="sm"
               className="h-7 px-2.5 text-[10px] uppercase tracking-tighter"
            >
               Inventario
            </Button>
         }
      />
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar">
         {CRITICAL_STOCK.map((p, i) => (
            <div
               key={i}
               className="flex items-center justify-between p-2.5 rounded-xl border border-border/30 bg-surface-highlight/20 hover:bg-surface-highlight hover:border-border/60 transition-all cursor-pointer group shadow-sm gap-3"
            >
               <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                     <span
                        className="text-[12px] font-bold text-text-main truncate group-hover:text-primary-text transition-colors"
                        title={p.name}
                     >
                        {p.name}
                     </span>
                     <span
                        className={cn(
                           'text-[10px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider shrink-0 shadow-sm min-w-[3rem] text-center',
                           p.badgeClass,
                        )}
                     >
                        {p.stock} UND
                     </span>
                  </div>
                  <span
                     className="text-[12px] text-text-dim font-medium mt-0.5 truncate"
                     title={p.pred}
                  >
                     {p.pred}
                  </span>
               </div>
            </div>
         ))}
      </div>
   </div>
);
