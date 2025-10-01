import { HiOutlineMagnifyingGlass, HiOutlinePlus, HiOutlineXMark } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

type CustomerHeaderProps = {
   search: string;
   onSearchChange: (value: string) => void;
   onAddClick: () => void;
};

export const CustomerHeader = ({ search, onSearchChange, onAddClick }: CustomerHeaderProps) => {
   const inputRef = useRef<HTMLInputElement>(null);

   // Atajo de teclado
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
      <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
         {/* Search Input */}
         <div className="relative group w-full sm:flex-1 h-11 sm:h-12">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none">
               <HiOutlineMagnifyingGlass size={20} />
            </div>
            <input
               ref={inputRef}
               value={search}
               onChange={e => onSearchChange(e.target.value)}
               placeholder="Buscar por nombre, documento o email..."
               className={cn(
                  'w-full h-full bg-surface border border-border text-sm text-text-main placeholder:text-text-dim rounded-xl',
                  'pl-11 pr-10 outline-none transition-all duration-200',
                  'focus:bg-surface-highlight focus:border-border-focus',
                  'hover:border-border-hover',
               )}
            />
            {search ? (
               <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main bg-transparent hover:bg-surface-active p-1 rounded-full transition-all cursor-pointer"
               >
                  <HiOutlineXMark size={16} />
               </button>
            ) : (
               <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none opacity-50">
                  <kbd className="bg-surface-active text-text-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border">
                     /
                  </kbd>
               </div>
            )}
         </div>

         {/* Add Button */}
         <Button
            onClick={onAddClick}
            variant="primary"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-xl shadow-lg shadow-primary/20 whitespace-nowrap text-sm font-semibold shrink-0"
         >
            <HiOutlinePlus size={20} />
            <span className="inline">Nuevo Cliente</span>
         </Button>
      </div>
   );
};
