import {
   HiOutlineCube,
   HiOutlineCurrencyDollar,
   HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

// Types
import { type InventoryStatsData } from '../../types/inventory';

const StatCard = ({
   label,
   value,
   icon: Icon,
   colorClass,
   bgClass,
}: {
   label: string;
   value: string | number;
   icon: React.ElementType;
   colorClass: string;
   bgClass: string;
}) => (
   <div className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:border-zinc-700 transition-colors">
      <div
         className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}
      >
         <Icon size={24} />
      </div>
      <div>
         <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</p>
         <p className="text-2xl font-mono font-bold text-white mt-0.5">{value}</p>
      </div>
   </div>
);

export const InventoryStats = ({ stats }: { stats: InventoryStatsData }) => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <StatCard
            label="Total Items"
            value={stats.totalProducts}
            icon={HiOutlineCube}
            colorClass="text-blue-400"
            bgClass="bg-blue-400/10"
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
         />
      </div>
   );
};
