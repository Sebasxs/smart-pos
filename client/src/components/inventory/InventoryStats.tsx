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
   colorClass: string;
   bgClass: string;
   activeBorderClass?: string;
   isActive?: boolean;
   onClick?: () => void;
   className?: string;
};

const StatCard = ({
   label,
   value,
   icon: Icon,
   colorClass,
   bgClass,
   activeBorderClass = 'border-zinc-600',
   isActive = false,
   onClick,
   className = '',
}: StatCardProps) => {
   const activeStyle = isActive ? `bg-zinc-800 ${activeBorderClass} shadow-lg shadow-black/20` : '';

   const inactiveStyle = !isActive
      ? 'bg-zinc-900 border-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-800/50'
      : '';

   const cursorClass = onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default';

   return (
      <button
         onClick={onClick}
         className={`
            relative overflow-hidden border rounded-xl p-4 flex items-center gap-4 transition-all duration-200 text-left
            ${cursorClass}
            ${isActive ? activeStyle : inactiveStyle}
            ${className}
         `}
      >
         {isActive && (
            <div className={`absolute inset-0 opacity-5 ${bgClass.replace('bg-', 'bg-')}`} />
         )}

         <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}
         >
            <Icon size={24} />
         </div>

         <div className="min-w-0 flex-1 relative z-10">
            <p
               className={`text-[10px] font-bold uppercase tracking-wider truncate transition-colors ${
                  isActive ? 'text-zinc-200' : 'text-zinc-500'
               }`}
            >
               {label}
            </p>
            <p
               className={`text-2xl font-mono font-bold mt-0.5 truncate tracking-tight transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-200'
               }`}
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
   return (
      <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 mb-6">
         {/* 1. TOTAL (Activo = Borde Azul) */}
         <StatCard
            label="Total Items"
            value={stats.totalProducts}
            icon={HiOutlineCube}
            colorClass="text-blue-400"
            bgClass="bg-blue-400/10"
            activeBorderClass="border-blue-500/50"
            isActive={activeFilter === 'all'}
            onClick={() => onToggleFilter('all')}
            className="col-span-1 lg:col-span-3"
         />

         {/* 2. OFERTAS (Activo = Borde Verde/Emerald) */}
         <StatCard
            label="Ofertas"
            value={stats.discounted}
            icon={HiOutlineTag}
            colorClass="text-emerald-400"
            bgClass="bg-emerald-400/10"
            activeBorderClass="border-emerald-500/50"
            isActive={activeFilter === 'discounted'}
            onClick={() => onToggleFilter('discounted')}
            className="col-span-1 lg:col-span-2"
         />

         {/* 3. STOCK BAJO (Activo = Borde Ámbar) */}
         <StatCard
            label="Stock Bajo"
            value={stats.lowStock}
            icon={HiOutlineExclamationTriangle}
            colorClass="text-amber-400"
            bgClass="bg-amber-400/10"
            activeBorderClass="border-amber-500/50"
            isActive={activeFilter === 'lowStock'}
            onClick={() => onToggleFilter('lowStock')}
            className="col-span-1 lg:col-span-2"
         />

         {/* 4. VALOR (Sin interacción, estilo base sutil) */}
         <StatCard
            label="Valor Inventario"
            value={`$${stats.totalValue.toLocaleString('es-CO')}`}
            icon={HiOutlineCurrencyDollar}
            colorClass="text-zinc-200"
            bgClass="bg-zinc-700/30"
            className="col-span-1 lg:col-span-5"
         />
      </div>
   );
};
