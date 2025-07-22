import {
   HiOutlineCube,
   HiOutlineCurrencyDollar,
   HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

// Types
import { type InventoryStatsData } from '../../types/inventory';
import { type InventoryFilter } from '../../hooks/useInventory';

type StatCardProps = {
   label: string;
   value: string | number;
   icon: React.ElementType;
   colorClass: string;
   bgClass: string;
   isActive?: boolean;
   onClick?: () => void;
};

const StatCard = ({
   label,
   value,
   icon: Icon,
   colorClass,
   bgClass,
   isActive = false,
   onClick,
}: StatCardProps) => {
   const activeStyle = isActive
      ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-blue-500 bg-zinc-800'
      : 'hover:bg-zinc-800/50 hover:border-zinc-700';

   return (
      <button
         onClick={onClick}
         className={`
            w-full flex-1 border rounded-xl p-4 flex items-center gap-4 shadow-sm transition-all duration-200 text-left
            ${onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
            ${isActive ? 'border-zinc-600' : 'border-zinc-800 bg-zinc-900'}
            ${activeStyle}
         `}
      >
         <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}
         >
            <Icon size={24} />
         </div>
         <div>
            <p
               className={`text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-white' : 'text-zinc-500'
               }`}
            >
               {label}
            </p>
            <p className="text-2xl font-mono font-bold text-white mt-0.5">{value}</p>
         </div>
      </button>
   );
};

type InventoryStatsProps = {
   stats: InventoryStatsData;
   activeFilter: InventoryFilter;
   onToggleFilter: (filter: InventoryFilter) => void;
};

export const InventoryStats = ({ stats, activeFilter, onToggleFilter }: InventoryStatsProps) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <StatCard
            label="Total Items"
            value={stats.totalProducts}
            icon={HiOutlineCube}
            colorClass="text-blue-400"
            bgClass="bg-blue-400/10"
            isActive={activeFilter === 'all'}
            onClick={() => onToggleFilter('all')}
         />
         <StatCard
            label="Valor Inventario"
            value={`$${stats.totalValue.toLocaleString('es-CO')}`}
            icon={HiOutlineCurrencyDollar}
            colorClass="text-emerald-400"
            bgClass="bg-emerald-400/10"
         />
         <StatCard
            label="Stock Bajo"
            value={stats.lowStock}
            icon={HiOutlineExclamationTriangle}
            colorClass="text-amber-400"
            bgClass="bg-amber-400/10"
            isActive={activeFilter === 'lowStock'}
            onClick={() => onToggleFilter('lowStock')}
         />
      </div>
   );
};
