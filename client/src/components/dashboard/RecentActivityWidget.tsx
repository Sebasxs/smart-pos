import {
   HiOutlineClock,
   HiOutlineTag,
   HiOutlineCurrencyDollar,
   HiOutlineArrowDownTray,
} from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { cn } from '../../utils/cn';

const RECENT_OPS_MOCK = [
   {
      type: 'Venta realizada',
      detail: '$128.500 • 4 productos',
      time: '2m',
      icon: HiOutlineTag,
      iconColor: 'text-success-text',
      bg: 'bg-success-bg/10',
   },
   {
      type: 'Gasto registrado',
      detail: 'Pago a proveedor • $940k',
      time: '1h',
      icon: HiOutlineCurrencyDollar,
      iconColor: 'text-danger-text',
      bg: 'bg-danger-bg/10',
   },
   {
      type: 'Devolución',
      detail: '1x Cargador 20W • Defecto',
      time: '3h',
      icon: HiOutlineArrowDownTray,
      iconColor: 'text-warning-text',
      bg: 'bg-warning-bg/10',
   },
   {
      type: 'Turno abierto',
      detail: 'Base inicial: $200.000',
      time: '5h',
      icon: HiOutlineClock,
      iconColor: 'text-primary-text',
      bg: 'bg-primary-subtle',
   },
];

export const RecentActivityWidget = () => (
   <div className="col-span-12 lg:col-span-4 bg-surface rounded-2xl shadow-sm flex flex-col h-[340px] overflow-hidden">
      <SectionHeader
         title="Operaciones Recientes"
         icon={HiOutlineClock}
         iconClassName="text-blue-400"
         iconContainerClassName="bg-blue-400/10"
         actions={
            <Button
               variant="secondary"
               size="sm"
               className="h-7 px-2.5 text-[10px] uppercase tracking-tighter"
            >
               Historial
            </Button>
         }
      />
      <div className="p-5 flex flex-col gap-3 overflow-y-auto flex-1 no-scrollbar">
         {RECENT_OPS_MOCK.map((log, i) => (
            <div
               key={i}
               className="flex items-center justify-between p-2.5 rounded-xl border border-border/30 bg-surface-highlight/20 hover:bg-surface-highlight hover:border-border/60 transition-all cursor-pointer group shadow-sm gap-3"
            >
               <div className="flex items-center gap-3 min-w-0">
                  <div
                     className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                        log.bg,
                        log.iconColor,
                     )}
                  >
                     <log.icon size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span className="text-[12px] font-bold text-text-main group-hover:text-primary-text truncate">
                        {log.type}
                     </span>
                     <span className="text-[12px] text-text-dim truncate font-medium">
                        {log.detail}
                     </span>
                  </div>
               </div>
               <span className="text-[10px] font-mono font-bold text-text-muted bg-surface px-1.5 py-0.5 rounded border border-border/20">
                  {log.time}
               </span>
            </div>
         ))}
      </div>
   </div>
);
