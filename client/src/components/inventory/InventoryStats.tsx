import {
   HiOutlineCube,
   HiOutlineCurrencyDollar,
   HiOutlineExclamationTriangle,
   HiOutlineTag,
} from 'react-icons/hi2';

// Types
import { type InventoryStatsData } from '../../types/inventory';
import { type InventoryFilter } from '../../hooks/useInventory';

type ExtendedStatsData = InventoryStatsData & { discounted: number };

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
};

const StatCard = ({
   label,
   value,
   icon: Icon,
   colorInfo,
   isActive = false,
   onClick,
   className = '',
}: StatCardProps) => {
   const baseStyle =
      'relative overflow-hidden border-2 rounded-xl p-3 flex items-center gap-4 transition-all duration-200 text-left';

   const activeStyle = isActive
      ? `bg-zinc-800 ${colorInfo.border} ${colorInfo.shadow}`
      : `bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:${colorInfo.border}`;

   const cursorClass = onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default';

   return (
      <button
         onClick={onClick}
         className={`${baseStyle} ${cursorClass} ${activeStyle} ${className}`}
      >
         <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${colorInfo.bg}`} />

         <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${colorInfo.iconBg} ${colorInfo.text}`}
         >
            <Icon size={24} />
         </div>

         <div className="min-w-0 flex-1 relative z-10">
            <p
               className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${colorInfo.text}`}
            >
               {label}
            </p>
            <p
               className={`text-2xl font-mono font-bold tracking-tight text-white`}
               title={String(value)}
            >
               {value}
            </p>
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
   const commonCardClass = 'flex-1 min-w-[200px]';
   const valueCardClass = 'flex-1 lg:flex-[1.5] min-w-[200px] lg:min-w-[260px]';

   return (
      <div className="flex flex-wrap gap-3 lg:gap-4 mb-2 shrink-0">
         {/* 1. TOTAL ITEMS */}
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
            className={commonCardClass}
         />

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
            className={commonCardClass}
         />

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
            className={commonCardClass}
         />

         {/* 4. VALOR INVENTARIO */}
         <StatCard
            label="Valor Inventario"
            value={`$${stats.totalValue.toLocaleString('es-CO')}`}
            icon={HiOutlineCurrencyDollar}
            colorInfo={{
               text: 'text-zinc-400',
               bg: 'bg-zinc-500',
               iconBg: 'bg-zinc-800',
               border: 'border-zinc-700',
               shadow: 'shadow-none',
            }}
            className={valueCardClass}
         />
      </div>
   );
};
