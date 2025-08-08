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
      : `bg-zinc-900 hover:bg-zinc-800 ${effectiveColors.border}`;

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

         <div className="min-w-0 flex-1 relative z-10 pl-1 md:pl-0">
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

export const CustomerStats = ({ stats, activeFilter, onToggleFilter }: CustomerStatsProps) => {
   return (
      <div className="flex items-stretch gap-3 shrink-0 w-full lg:w-auto overflow-x-auto md:flex-wrap">
         {/* 1. TOTAL CUSTOMERS */}
         <StatCard
            label="Total Clientes"
            value={stats.totalCustomers}
            icon={HiOutlineUsers}
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
                  Registrados
               </p>
               <p className="text-xs font-mono text-purple-300">100%</p>
            </div>
         </StatCard>

         {/* 2. ACTIVE CUSTOMERS */}
         <StatCard
            label="Activos"
            value={stats.activeCustomers}
            icon={HiOutlineUserGroup}
            colorInfo={{
               text: 'text-emerald-400',
               bg: 'bg-emerald-500',
               iconBg: 'bg-emerald-500/20',
               border: 'border-emerald-500/50',
               shadow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]',
            }}
            isActive={activeFilter === 'active'}
            onClick={() => onToggleFilter('active')}
            className="flex-1 min-w-0 md:min-w-[140px]"
         >
            <div className="mt-1 pt-1 border-t border-white/10">
               <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                  Compraron algo en el último mes
               </p>
               <p className="text-xs font-mono text-emerald-300">
                  {stats.totalCustomers > 0
                     ? `${Math.round((stats.activeCustomers / stats.totalCustomers) * 100)}%`
                     : '0%'}
               </p>
            </div>
         </StatCard>

         {/* 3. NEW CUSTOMERS */}
         <StatCard
            label="Nuevos"
            value={stats.newCustomers}
            icon={HiOutlineUserPlus}
            colorInfo={{
               text: 'text-blue-400',
               bg: 'bg-blue-500',
               iconBg: 'bg-blue-500/20',
               border: 'border-blue-500/50',
               shadow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)]',
            }}
            isActive={activeFilter === 'new'}
            onClick={() => onToggleFilter('new')}
            className="flex-1 min-w-0 md:min-w-[140px]"
         >
            <div className="mt-1 pt-1 border-t border-white/10">
               <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">
                  Recién registrados
               </p>
               <p className="text-xs font-mono text-blue-300">
                  {stats.totalCustomers > 0
                     ? `${Math.round((stats.newCustomers / stats.totalCustomers) * 100)}%`
                     : '0%'}
               </p>
            </div>
         </StatCard>
      </div>
   );
};
