import {
   HiOutlineBanknotes,
   HiOutlineArrowTrendingDown,
   HiOutlineReceiptPercent,
   HiOutlineScale,
} from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { type ShiftSummary } from '../../store/cashShiftStore';
import { cn } from '../../utils/cn';

type ShiftStatsProps = {
   summary?: ShiftSummary;
};

interface ShiftKpiProps {
   title: string;
   value: number;
   icon: React.ElementType;
   colorClass: string;
   iconBgClass: string;
   iconColorClass: string;
   delay?: number;
}

function ShiftKpiCard({
   title,
   value,
   icon: Icon,
   colorClass,
   iconBgClass,
   iconColorClass,
   delay = 0,
}: ShiftKpiProps) {
   return (
      <div
         className="bg-surface rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 group h-24 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
         style={{ animationDelay: `${delay}ms` }}
      >
         <div className="flex justify-between items-start z-10 relative">
            <div className="flex flex-col gap-0.5 pr-2">
               <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                  {title}
               </span>
            </div>
            <div
               className={cn(
                  'p-1.5 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0',
                  iconBgClass,
                  iconColorClass,
               )}
            >
               <Icon size={16} />
            </div>
         </div>

         <div className="z-10 mt-auto relative">
            <div
               className={cn(
                  'text-2xl font-mono font-black tracking-tighter transition-colors truncate',
                  colorClass,
               )}
            >
               <SmartNumber value={value || 0} variant="currency" showPrefix={true} />
            </div>
         </div>

         <div
            className={cn(
               'absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none',
               colorClass.replace('text-', 'bg-'),
            )}
         />
      </div>
   );
}

export const ShiftStats = ({ summary }: ShiftStatsProps) => {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
         <ShiftKpiCard
            title="Base Inicial"
            value={summary?.openingAmount || 0}
            icon={HiOutlineBanknotes}
            colorClass="text-text-main"
            iconBgClass="bg-surface-highlight group-hover:bg-surface-active"
            iconColorClass="text-text-secondary"
            delay={0}
         />

         <ShiftKpiCard
            title="Gastos"
            value={summary?.manualExpense || 0}
            icon={HiOutlineArrowTrendingDown}
            colorClass="text-danger-text"
            iconBgClass="bg-danger-bg/50 group-hover:bg-danger-bg"
            iconColorClass="text-danger-text"
            delay={50}
         />

         <ShiftKpiCard
            title="Ventas (Efectivo)"
            value={summary?.salesCash || 0}
            icon={HiOutlineReceiptPercent}
            colorClass="text-success-text"
            iconBgClass="bg-success-bg/50 group-hover:bg-success-bg"
            iconColorClass="text-success-text"
            delay={100}
         />

         <ShiftKpiCard
            title="Efectivo esperado"
            value={summary?.expectedCash || 0}
            icon={HiOutlineScale}
            colorClass="text-primary-text"
            iconBgClass="bg-primary-subtle group-hover:bg-primary-subtle/80"
            iconColorClass="text-primary-text"
            delay={150}
         />
      </div>
   );
};
