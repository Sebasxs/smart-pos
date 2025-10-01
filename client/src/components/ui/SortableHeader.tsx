import { HiChevronUp, HiChevronDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

type SortableHeaderProps<T extends string> = {
   label: string;
   sortKey?: T;
   currentSortKey?: T;
   sortDirection?: 'asc' | 'desc';
   onSort?: (key: T) => void;
   align?: 'left' | 'right' | 'center';
   offset?: number;
};

export const SortableHeader = <T extends string>({
   label,
   sortKey,
   currentSortKey,
   sortDirection,
   onSort,
   align = 'left',
   offset = 0,
}: SortableHeaderProps<T>) => {
   const canSort = !!sortKey && !!onSort;
   const isActive = canSort && currentSortKey === sortKey;

   const offsetStyle =
      align === 'right' ? { marginRight: `${offset}px` } : { marginLeft: `${offset}px` };

   const justifyClass =
      align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

   return (
      <div
         className={cn(
            `flex items-center gap-1 transition-colors select-none ${justifyClass}`,
            canSort ? 'cursor-pointer hover:text-text-main group/header' : '',
         )}
         style={offsetStyle}
         onClick={canSort ? () => onSort(sortKey) : undefined}
      >
         {label}
         <div className="flex flex-col w-[10px]">
            {canSort ? (
               <>
                  <HiChevronUp
                     size={10}
                     className={cn(
                        'transition-colors',
                        isActive && sortDirection === 'asc'
                           ? 'text-primary-text'
                           : 'text-text-dim group-hover/header:text-text-muted',
                     )}
                  />
                  <HiChevronDown
                     size={10}
                     className={cn(
                        'transition-colors',
                        isActive && sortDirection === 'desc'
                           ? 'text-primary-text'
                           : 'text-text-dim group-hover/header:text-text-muted',
                     )}
                     style={{ marginTop: -4 }}
                  />
               </>
            ) : (
               <div className="h-[16px]" />
            )}
         </div>
      </div>
   );
};
