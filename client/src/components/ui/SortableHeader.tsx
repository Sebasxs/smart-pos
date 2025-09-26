import { HiChevronUp, HiChevronDown } from 'react-icons/hi2';

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
         className={`flex items-center gap-1 transition-colors select-none ${justifyClass} ${
            canSort ? 'cursor-pointer hover:text-zinc-300' : ''
         }`}
         style={offsetStyle}
         onClick={canSort ? () => onSort(sortKey) : undefined}
      >
         {label}
         <div className="flex flex-col w-[10px]">
            {canSort ? (
               <>
                  <HiChevronUp
                     size={10}
                     className={`${
                        isActive && sortDirection === 'asc' ? 'text-blue-400' : 'text-zinc-700'
                     }`}
                  />
                  <HiChevronDown
                     size={10}
                     className={`${
                        isActive && sortDirection === 'desc' ? 'text-blue-400' : 'text-zinc-700'
                     }`}
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
