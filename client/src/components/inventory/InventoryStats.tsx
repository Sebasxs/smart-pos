import { HiOutlineCube, HiOutlineExclamationTriangle, HiOutlineTag } from 'react-icons/hi2';
import { SmartNumber } from '../ui/SmartNumber';
import { type InventoryStatsData } from '../../types/inventory';
import { type InventoryFilter } from '../../hooks/useInventory';

type ExtendedStatsData = InventoryStatsData & {
   discounted: number;
   averageDiscount: number;
   outOfStock: number;
};

type InventoryStatsProps = {
   stats: ExtendedStatsData;
   activeFilter: InventoryFilter;
   onToggleFilter: (filter: InventoryFilter) => void;
};

// Componente interno de Tarjeta
const StatFilterCard = ({
   label,
   mainValue,
   subValue,
   icon: Icon,
   isActive,
   onClick,
   colorClass,
   activeBorderClass,
   activeBgClass,
}: {
   label: string;
   mainValue: React.ReactNode;
   subValue?: React.ReactNode;
   icon: React.ElementType;
   isActive: boolean;
   onClick: () => void;
   colorClass: string;
   activeBorderClass: string;
   activeBgClass: string;
}) => {
   return (
      <button
         onClick={onClick}
         className={`
            relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 text-left group w-full
            ${
               isActive
                  ? `${activeBgClass} ${activeBorderClass} shadow-lg ring-1 ring-inset ring-white/5`
                  : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700'
            }
         `}
      >
         <div className="flex justify-between items-start w-full mb-2">
            <span
               className={`text-[11px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'
               }`}
            >
               {label}
            </span>
            <Icon
               size={18}
               className={`${
                  isActive ? 'text-white opacity-100' : colorClass
               } transition-opacity duration-200`}
            />
         </div>

         <div className="flex items-end justify-between w-full">
            <div className={`text-2xl font-mono font-bold tracking-tight text-white`}>
               {mainValue}
            </div>
            {subValue && <div className="text-xs font-medium opacity-80 mb-1">{subValue}</div>}
         </div>
      </button>
   );
};

export const InventoryStats = ({ stats, activeFilter, onToggleFilter }: InventoryStatsProps) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
         {/* 1. TODOS / VALOR TOTAL */}
         <StatFilterCard
            label="Total Inventario"
            icon={HiOutlineCube}
            mainValue={stats.totalProducts}
            subValue={
               <span className="text-purple-300">
                  <SmartNumber value={stats.totalValue} variant="currency" showPrefix={true} />
               </span>
            }
            isActive={activeFilter === 'all'}
            onClick={() => onToggleFilter('all')}
            colorClass="text-purple-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-purple-500/20 to-purple-600/5"
            activeBorderClass="border-purple-500/50"
         />

         {/* 2. OFERTAS */}
         <StatFilterCard
            label="En Oferta"
            icon={HiOutlineTag}
            mainValue={stats.discounted}
            subValue={
               stats.discounted > 0 ? (
                  <span className="text-emerald-300">-{stats.averageDiscount}% Prom.</span>
               ) : null
            }
            isActive={activeFilter === 'discounted'}
            onClick={() => onToggleFilter('discounted')}
            colorClass="text-emerald-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5"
            activeBorderClass="border-emerald-500/50"
         />

         {/* 3. STOCK BAJO / AGOTADO */}
         <StatFilterCard
            label="Stock Crítico"
            icon={HiOutlineExclamationTriangle}
            mainValue={stats.lowStock}
            subValue={
               stats.outOfStock > 0 ? (
                  <span className="text-red-300">{stats.outOfStock} Agotados</span>
               ) : (
                  <span className="text-amber-300">Por agotar</span>
               )
            }
            isActive={activeFilter === 'lowStock'}
            onClick={() => onToggleFilter('lowStock')}
            colorClass="text-amber-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-amber-500/20 to-orange-600/5"
            activeBorderClass="border-amber-500/50"
         />
      </div>
   );
};
