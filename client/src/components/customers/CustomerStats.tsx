import { HiOutlineUserGroup, HiOutlineUserPlus, HiOutlineUsers } from 'react-icons/hi2';

type CustomerStatsProps = {
   stats: {
      totalCustomers: number;
      activeCustomers: number;
      newCustomers: number;
   };
   activeFilter: 'all' | 'active' | 'new';
   onToggleFilter: (filter: 'all' | 'active' | 'new') => void;
};

// Componente interno de Tarjeta (Reutilizando el estilo de Inventory)
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

export const CustomerStats = ({ stats, activeFilter, onToggleFilter }: CustomerStatsProps) => {
   const activePercentage =
      stats.totalCustomers > 0
         ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100)
         : 0;

   const newPercentage =
      stats.totalCustomers > 0 ? Math.round((stats.newCustomers / stats.totalCustomers) * 100) : 0;

   return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
         {/* 1. TODOS */}
         <StatFilterCard
            label="Total Clientes"
            icon={HiOutlineUsers}
            mainValue={stats.totalCustomers}
            subValue={<span className="text-indigo-300">Registrados</span>}
            isActive={activeFilter === 'all'}
            onClick={() => onToggleFilter('all')}
            colorClass="text-indigo-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-indigo-500/20 to-indigo-600/5"
            activeBorderClass="border-indigo-500/50"
         />

         {/* 2. ACTIVOS (Compraron recientemente) */}
         <StatFilterCard
            label="Clientes Activos"
            icon={HiOutlineUserGroup}
            mainValue={stats.activeCustomers}
            subValue={<span className="text-emerald-300">{activePercentage}% del total</span>}
            isActive={activeFilter === 'active'}
            onClick={() => onToggleFilter('active')}
            colorClass="text-emerald-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5"
            activeBorderClass="border-emerald-500/50"
         />

         {/* 3. NUEVOS (Este mes) */}
         <StatFilterCard
            label="Nuevos (Mes)"
            icon={HiOutlineUserPlus}
            mainValue={stats.newCustomers}
            subValue={<span className="text-cyan-300">+{newPercentage}% Crecimiento</span>}
            isActive={activeFilter === 'new'}
            onClick={() => onToggleFilter('new')}
            colorClass="text-cyan-500 opacity-60"
            activeBgClass="bg-gradient-to-br from-cyan-500/20 to-cyan-600/5"
            activeBorderClass="border-cyan-500/50"
         />
      </div>
   );
};
