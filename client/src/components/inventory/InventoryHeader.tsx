import {
   HiOutlineMagnifyingGlass,
   HiOutlinePlus,
   HiOutlineArrowPath,
   HiOutlineXMark,
} from 'react-icons/hi2';
import { Button } from '../ui/Button';

type InventoryHeaderProps = {
   search: string;
   onSearchChange: (val: string) => void;
   onAddClick: () => void;
   onRefresh: () => void;
   isLoading: boolean;
};

export const InventoryHeader = ({
   search,
   onSearchChange,
   onAddClick,
   onRefresh,
   isLoading,
}: InventoryHeaderProps) => {
   return (
      <div className="flex flex-col md:flex-row gap-3 w-full h-full">
         {/* Search input */}
         <div className="relative group w-full md:flex-[2] lg:flex-[3] h-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-blue-500">
               <HiOutlineMagnifyingGlass size={20} />
            </div>
            <input
               value={search}
               onChange={e => onSearchChange(e.target.value)}
               placeholder="Buscar productos..."
               className="w-full h-full lg:h-auto min-h-[42px] bg-zinc-900 hover:bg-zinc-800 focus:bg-zinc-800 border border-zinc-700 focus:border-blue-500/70 rounded-xl py-2 text-sm text-zinc-200 placeholder:text-zinc-400 outline-none transition-all duration-200 pl-10 pr-8"
            />
            {search && (
               <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
               >
                  <HiOutlineXMark size={16} />
               </button>
            )}
         </div>

         {/* Actions */}
         <div className="flex gap-2 w-full md:w-auto h-full shrink-0">
            <Button
               onClick={onAddClick}
               variant="primary"
               className="h-full lg:h-auto min-h-[42px] rounded-xl shadow-blue-900/20 px-6 w-full md:w-auto whitespace-nowrap"
               title="Nuevo Producto"
            >
               <HiOutlinePlus size={20} />
               <span>Agregar producto</span>
            </Button>

            {/* Refresh button */}
            <button
               onClick={onRefresh}
               className="hidden lg:flex h-full lg:h-auto min-h-[42px] aspect-square rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer items-center justify-center shrink-0"
               title="Actualizar lista"
            >
               <HiOutlineArrowPath
                  size={20}
                  className={` ${isLoading ? 'animate-spin text-blue-400' : ''}`}
               />
            </button>
         </div>
      </div>
   );
};
