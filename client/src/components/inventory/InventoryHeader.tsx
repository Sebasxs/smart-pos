import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { useEffect, useRef } from 'react';

type InventoryHeaderProps = {
   search: string;
   onSearchChange: (val: string) => void;
   onAddClick: () => void;
};

export const InventoryHeader = ({ search, onSearchChange, onAddClick }: InventoryHeaderProps) => {
   const inputRef = useRef<HTMLInputElement>(null);

   // Atajo de teclado: Ctrl + K o "/" para buscar
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (
            (e.ctrlKey && e.key === 'k') ||
            (e.key === '/' && document.activeElement !== inputRef.current)
         ) {
            e.preventDefault();
            inputRef.current?.focus();
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, []);

   return (
      <div className="flex gap-3 w-full items-center">
         {/* Search input mejorado */}
         <div className="relative group flex-1 h-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-zinc-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
               <HiOutlineMagnifyingGlass size={20} />
            </div>
            <input
               ref={inputRef}
               value={search}
               onChange={e => onSearchChange(e.target.value)}
               placeholder="Buscar por nombre, código o SKU..."
               className="w-full h-full bg-zinc-900/50 hover:bg-zinc-900 focus:bg-zinc-900 border border-zinc-800 focus:border-blue-500/50 rounded-xl py-2 pl-11 pr-10 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 shadow-sm"
            />
            {search ? (
               <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-700 p-1 rounded-full transition-all cursor-pointer"
               >
                  <HiOutlineXMark size={14} />
               </button>
            ) : (
               <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none opacity-50">
                  <kbd className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-zinc-700">
                     /
                  </kbd>
               </div>
            )}
         </div>

         {/* Botón Principal */}
         <Button
            onClick={onAddClick}
            variant="primary"
            className="h-12 px-6 rounded-xl shadow-lg shadow-blue-900/20 whitespace-nowrap text-sm font-semibold shrink-0"
         >
            <HiOutlinePlus size={20} />
            <span className="hidden sm:inline">Nuevo Producto</span>
         </Button>
      </div>
   );
};
