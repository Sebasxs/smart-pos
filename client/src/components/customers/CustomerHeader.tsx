import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiArrowPath } from 'react-icons/hi2';
import { Button } from '../ui/Button';

type CustomerHeaderProps = {
   search: string;
   onSearchChange: (value: string) => void;
   onAddClick: () => void;
   onRefresh: () => void;
   isLoading: boolean;
   totalCustomers: number;
};

export const CustomerHeader = ({
   search,
   onSearchChange,
   onAddClick,
   onRefresh,
   isLoading,
   totalCustomers,
}: CustomerHeaderProps) => {
   return (
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
         {/* Search */}
         <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <HiOutlineMagnifyingGlass
                  className="text-zinc-500 group-focus-within:text-blue-500 transition-colors"
                  size={20}
               />
            </div>
            <input
               type="text"
               value={search}
               onChange={(e) => onSearchChange(e.target.value)}
               className="block w-full pl-10 pr-3 py-2.5 border border-zinc-800 rounded-xl leading-5 bg-zinc-950 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 sm:text-sm transition-all shadow-sm"
               placeholder="Buscar por nombre, NIT, email..."
            />
         </div>

         {/* Stats & Actions */}
         <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="hidden md:flex flex-col items-end mr-2">
               <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Clientes</span>
               <span className="text-lg font-bold text-zinc-200 leading-none">{totalCustomers}</span>
            </div>

            <div className="h-8 w-px bg-zinc-800 hidden md:block mx-1"></div>

            <button
               onClick={onRefresh}
               disabled={isLoading}
               className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
               title="Recargar lista"
            >
               <HiArrowPath
                  size={20}
                  className={isLoading ? 'animate-spin' : ''}
               />
            </button>

            <Button onClick={onAddClick} className="pl-3 pr-4 shadow-lg shadow-blue-500/10">
               <HiOutlinePlus size={20} className="mr-1" />
               Nuevo Cliente
            </Button>
         </div>
      </div>
   );
};
