import { HiOutlineCube, HiOutlineExclamationTriangle, HiOutlineTag } from 'react-icons/hi2';
import { cn } from '../../utils/cn';
import { type InventoryFilter } from '../../hooks/useInventory';

type InventoryFilterBarProps = {
   activeFilter: InventoryFilter;
   onToggleFilter: (filter: InventoryFilter) => void;
   counts: {
      total: number;
      lowStock: number;
      discounted: number;
   };
};

export const InventoryFilterBar = ({
   activeFilter,
   onToggleFilter,
   counts,
}: InventoryFilterBarProps) => {
   const filters = [
      {
         id: 'all' as InventoryFilter,
         label: 'Todos',
         count: counts.total,
         icon: HiOutlineCube,
         activeClass: 'bg-surface-active text-text-main',
         textClass: 'text-text-secondary',
      },
      {
         id: 'lowStock' as InventoryFilter,
         label: 'Stock Crítico',
         count: counts.lowStock,
         icon: HiOutlineExclamationTriangle,
         activeClass: 'bg-warning-bg text-warning-text',
         textClass: 'text-warning-text',
      },
      {
         id: 'discounted' as InventoryFilter,
         label: 'En Oferta',
         count: counts.discounted,
         icon: HiOutlineTag,
         activeClass: 'bg-success-bg text-success-text',
         textClass: 'text-success-text',
      },
   ];

   return (
      <div className="flex flex-wrap gap-2 items-center w-full no-scrollbar pl-1">
         {filters.map(filter => {
            const isActive = activeFilter === filter.id;
            const Icon = filter.icon;

            return (
               <button
                  key={filter.id}
                  onClick={() => onToggleFilter(filter.id)}
                  className={cn(
                     'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-transparent select-none whitespace-nowrap',
                     isActive
                        ? cn('shadow-sm', filter.activeClass)
                        : 'bg-surface hover:bg-surface-highlight text-text-dim border-border hover:border-border-hover',
                  )}
               >
                  <Icon
                     size={14}
                     className={cn(isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100')}
                  />
                  <span>{filter.label}</span>
                  <span
                     className={cn(
                        'ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold leading-none',
                        isActive ? 'bg-black/10' : 'bg-surface-highlight text-text-muted',
                     )}
                  >
                     {filter.count}
                  </span>
               </button>
            );
         })}
      </div>
   );
};
