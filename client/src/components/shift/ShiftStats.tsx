import {
   HiOutlineBanknotes,
   HiOutlineArrowTrendingDown,
   HiOutlineReceiptPercent,
} from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { type ShiftSummary } from '../../store/cashShiftStore';

type ShiftStatsProps = {
   summary?: ShiftSummary;
};

function KpiCard({
   title,
   value,
   icon,
   className = '',
   bgClassName = 'bg-zinc-900/50 border-zinc-800',
}: any) {
   return (
      <div className={`p-4 rounded-xl border flex flex-col justify-between h-24 ${bgClassName}`}>
         <div className="flex justify-between items-start">
            <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
               {title}
            </span>
            {icon && <div className="text-zinc-500 opacity-70">{icon}</div>}
         </div>
         <div
            className={`text-2xl font-mono font-bold tracking-tight ${className || 'text-white'}`}
         >
            <SmartNumber value={value || 0} variant="currency" showPrefix={true} />
         </div>
      </div>
   );
}

export const ShiftStats = ({ summary }: ShiftStatsProps) => {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
         <KpiCard
            title="Base Inicial"
            value={summary?.openingAmount}
            icon={<HiOutlineBanknotes className="text-zinc-500" />}
         />
         <KpiCard
            title="Ventas (Efectivo)"
            value={summary?.salesCash}
            className="text-emerald-400"
            bgClassName="bg-emerald-500/[0.03] border-emerald-500/10"
            icon={<HiOutlineReceiptPercent />}
         />
         <KpiCard
            title="Gastos / Salidas"
            value={summary?.manualExpense}
            className="text-red-400"
            bgClassName="bg-red-500/[0.03] border-red-500/10"
            icon={<HiOutlineArrowTrendingDown />}
         />
         <KpiCard
            title="Efectivo Esperado"
            value={summary?.expectedCash}
            className="text-blue-400 font-bold"
            bgClassName="bg-blue-500/10 border-blue-500/30 shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)]"
            icon={<HiOutlineBanknotes />}
         />
      </div>
   );
};
