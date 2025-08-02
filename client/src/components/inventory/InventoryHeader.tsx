import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineArrowPath, HiOutlineXMark } from 'react-icons/hi2';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 shrink-0">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Inventario</h1>
            <p className="text-zinc-500 text-sm mt-1">
               Gestiona tu catálogo de productos y existencias.
            </p>
         </div>

         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineMagnifyingGlass size={18} />
               </div>
               <input
                  type="text"
                  value={search}
                  onChange={e => onSearchChange(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-9 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition-all"
               />
               {search && (
                  <button
                     onClick={() => onSearchChange('')}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                     <HiOutlineXMark size={16} />
                  </button>
               )}
            </div>

            <button
               onClick={onRefresh}
               className={`
                  p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer
                  ${isLoading ? 'animate-spin text-blue-500' : ''}
               `}
               title="Actualizar lista"
            >
               <HiOutlineArrowPath size={20} />
            </button>

            <button
               onClick={onAddClick}
               className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-95 cursor-pointer"
            >
               <HiOutlinePlus size={18} />
               <span className="hidden sm:inline">Nuevo Producto</span>
            </button>
         </div>
      </div>
   );
};