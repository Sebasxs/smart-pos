import { HiOutlineCube, HiOutlineExclamationTriangle, HiOutlineTag } from 'react-icons/hi2';

// Types
import { type InventoryStatsData } from '../../types/inventory';
import { type InventoryFilter } from '../../hooks/useInventory';
import { SmartNumber } from '../ui/SmartNumber';

type ExtendedStatsData = InventoryStatsData & {
   discounted: number;
   averageDiscount: number;
   outOfStock: number;
};

type StatCardProps = {
   label: string;
   value: string | number;
   icon: React.ElementType;
   colorInfo: {
      text: string;
      bg: string;
      border: string;
      iconBg: string;
      shadow: string;
   };
   isActive?: boolean;
   onClick?: () => void;
   className?: string;
   children?: React.ReactNode;
};

const StatCard = ({
   label,
   value,
   icon: Icon,
   colorInfo,
   isActive = false,
   onClick,
   className = '',
   children,
}: StatCardProps) => {
   const baseStyle =
      'relative overflow-hidden border-2 rounded-xl p-2 flex items-center gap-3 transition-all duration-200 text-left';

   const effectiveColors = isActive
      ? colorInfo
      : {
           text: 'text-zinc-500',
           bg: 'bg-zinc-500',
           border: 'border-zinc-800',
           iconBg: 'bg-zinc-800',
           shadow: 'shadow-none',
        };

   const activeStyle = isActive
      ? `bg-zinc-800 ${effectiveColors.border} ${effectiveColors.shadow}`
      : `bg-zinc-900/50 hover:bg-zinc-800 ${effectiveColors.border}`;

   const cursorClass = onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default';

   return (
      <button
         onClick={onClick}
         className={`${baseStyle} ${cursorClass} ${activeStyle} ${className}`}
      >
         <div
            className={`absolute inset-0 opacity-[0.03] pointer-events-none ${effectiveColors.bg}`}
         />

         <div
            className={`m-1 w-22 self-stretch rounded-lg hidden sm:flex items-center justify-center border border-white/5 ${effectiveColors.iconBg} ${effectiveColors.text}`}
         >
            <Icon size={48} />
         </div>

         <div className="min-w-0 flex-1 relative z-10">
            <p
               className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${effectiveColors.text}`}
            >
               {label}
            </p>
            <p
               className={`text-xl font-mono font-bold tracking-tight text-white`}
               title={String(value)}
            >
               {value}
            </p>
            {children}
         </div>
      </button>
   );
};

type InventoryStatsProps = {
   stats: ExtendedStatsData;
   activeFilter: InventoryFilter;
   onToggleFilter: (filter: InventoryFilter) => void;
};

export const InventoryStats = ({ stats, activeFilter, onToggleFilter }: InventoryStatsProps) => {
   return (
      <div className="flex items-stretch gap-3 shrink-0 w-full lg:w-auto overflow-x-auto md:flex-wrap">
         {/* 1. TOTAL ITEMS & VALUE */}
         <StatCard
            label="Productos"
            value={stats.totalProducts}
            icon={HiOutlineCube}
            colorInfo={{
               text: 'text-purple-400',
               bg: 'bg-purple-500',
               iconBg: 'bg-purple-500/20',
               border: 'border-purple-500/50',
               shadow: 'shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)]',
            }}
            isActive={activeFilter === 'all'}
            onClick={() => onToggleFilter('all')}
            className="flex-1 min-w-0 md:min-w-[140px]"
         >
            <div className="mt-1 pt-1 border-t border-white/10">
               <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                  Valor Total
               </p>
               <p className="text-xs font-mono text-purple-300">
                  <SmartNumber value={stats.totalValue} variant="currency" showPrefix={false} />
               </p>
            </div>
         </StatCard>

         {/* 2. OFERTAS */}
         <StatCard
            label="En Oferta"
            value={stats.discounted}
            icon={HiOutlineTag}
            colorInfo={{
               text: 'text-emerald-400',
               bg: 'bg-emerald-500/10',
               iconBg: 'bg-emerald-500/20',
               border: 'border-emerald-500/50',
               shadow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]',
            }}
            isActive={activeFilter === 'discounted'}
            onClick={() => onToggleFilter('discounted')}
            className="flex-1 min-w-0 md:min-w-[140px]"
         >
            <div className="mt-1 pt-1 border-t border-white/10">
               <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                  Promedio Descuento
               </p>
               <p className="text-xs font-mono text-emerald-300">{stats.averageDiscount}%</p>
            </div>
         </StatCard>

         {/* 3. STOCK BAJO */}
         <StatCard
            label="Stock Bajo"
            value={stats.lowStock}
            icon={HiOutlineExclamationTriangle}
            colorInfo={{
               text: 'text-amber-400',
               bg: 'bg-amber-500',
               iconBg: 'bg-amber-500/20',
               border: 'border-amber-500/50',
               shadow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]',
            }}
            isActive={activeFilter === 'lowStock'}
            onClick={() => onToggleFilter('lowStock')}
            className="flex-1 min-w-0 md:min-w-[140px]"
         >
            <div className="mt-1 pt-1 border-t border-white/10">
               <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                  Agotados
               </p>
               <p className="text-xs font-mono text-amber-300">{stats.outOfStock}</p>
            </div>
         </StatCard>
      </div>
   );
};
