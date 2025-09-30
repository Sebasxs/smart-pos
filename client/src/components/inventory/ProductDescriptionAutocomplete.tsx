import { useState, useEffect, useRef, useMemo } from 'react';
import {
   HiOutlineCube,
   HiOutlineExclamationCircle,
   HiOutlinePencilSquare,
   HiOutlinePlus,
} from 'react-icons/hi2';
import { cn } from '../../utils/cn';
import { type Product } from '../../types/inventory';
import { SmartNumber } from '../ui/SmartNumber';

type ProductDescriptionAutocompleteProps = {
   value: string;
   onChange: (value: string) => void;
   onSelectExisting: (product: Product) => void;
   products: Product[];
   currentId?: string | null;
   autoFocus?: boolean;
   required?: boolean;
   placeholder?: string;
};

export const ProductDescriptionAutocomplete = ({
   value,
   onChange,
   onSelectExisting,
   products,
   currentId,
   autoFocus,
   required,
   placeholder,
}: ProductDescriptionAutocompleteProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedIndex, setSelectedIndex] = useState(-1);

   const containerRef = useRef<HTMLDivElement>(null);
   const listRef = useRef<HTMLDivElement>(null);
   const addNewRef = useRef<HTMLButtonElement>(null);
   const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

   const filteredProducts = useMemo(() => {
      if (value.trim().length < 2) return [];

      const lowerTerm = value.toLowerCase();
      return products
         .filter(
            p =>
               p.id !== currentId &&
               (p.description.toLowerCase().includes(lowerTerm) ||
                  p.sku?.toLowerCase().includes(lowerTerm)),
         )
         .slice(0, 10);
   }, [value, products, currentId]);

   const showDropdown = isOpen && filteredProducts.length > 0;

   useEffect(() => {
      setSelectedIndex(-1);
   }, [filteredProducts.length]);

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('touchstart', handleClickOutside);
      };
   }, []);

   useEffect(() => {
      if (selectedIndex === -1 && addNewRef.current) {
         addNewRef.current.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
         });
      } else if (selectedIndex >= 0 && itemsRef.current[selectedIndex]) {
         itemsRef.current[selectedIndex]?.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
         });
      }
   }, [selectedIndex]);

   const handleSelect = (product: Product) => {
      onSelectExisting(product);
      setIsOpen(false);
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showDropdown) return;

      switch (e.key) {
         case 'ArrowDown':
            e.preventDefault();
            // -1 is the "Add New" option
            setSelectedIndex(prev => (prev >= filteredProducts.length - 1 ? -1 : prev + 1));
            break;
         case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => (prev <= -1 ? filteredProducts.length - 1 : prev - 1));
            break;
         case 'Enter':
            e.preventDefault(); // Intercept Enter to handle dropdown
            if (selectedIndex >= 0) {
               handleSelect(filteredProducts[selectedIndex]);
            } else {
               // If -1 (Add New), just close the dropdown
               setIsOpen(false);
            }
            break;
         case 'Escape':
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
            break;
      }
   };

   const handleBlur = () => {
      // Usamos un pequeño delay para permitir que el click en las sugerencias se procese
      setTimeout(() => {
         if (!containerRef.current?.contains(document.activeElement)) {
            setIsOpen(false);
         }
      }, 200);
   };

   return (
      <div className="w-full relative group" ref={containerRef}>
         <label className="block text-sm font-medium text-zinc-400 mb-1.5">Descripción</label>
         <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80">
               <HiOutlineCube size={18} />
            </div>
            <input
               value={value}
               onChange={e => {
                  onChange(e.target.value);
                  setIsOpen(true);
               }}
               onFocus={() => setIsOpen(true)}
               onBlur={handleBlur}
               onKeyDown={handleKeyDown}
               className={cn(
                  'w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800',
                  'border border-zinc-800 focus:border-blue-500/70',
                  'rounded-lg py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500',
                  'outline-none transition-all duration-200 pl-10 pr-3',
                  showDropdown &&
                     'rounded-b-none border-zinc-700 focus:border-zinc-700 bg-zinc-800 shadow-sm',
               )}
               placeholder={placeholder}
               autoFocus={autoFocus}
               required={required}
               autoComplete="off"
            />
         </div>

         {/* Suggestions */}
         {showDropdown && (
            <div
               ref={listRef}
               className={cn(
                  'absolute z-50 left-0 right-0 -mt-[1px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 border-t-0 rounded-b-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200',
                  'max-h-[280px] overflow-y-auto custom-scrollbar',
                  'scroll-pt-9',
               )}
            >
               {/* Header Sticky */}
               <div className="h-9 px-3 bg-indigo-500/10 border-b border-indigo-500/20 text-[10px] text-indigo-300 font-medium flex items-center justify-between sticky top-0 backdrop-blur-md z-10 shadow-sm">
                  <div className="flex items-center gap-1.5">
                     <HiOutlineExclamationCircle size={12} />
                     <span>Coincidencias encontradas</span>
                  </div>
                  <span className="opacity-70 text-[9px] uppercase tracking-wide">
                     {selectedIndex === -1 ? 'Enter p/ Nuevo' : 'Enter p/ Editar'}
                  </span>
               </div>

               {/* Option "Add as New" */}
               <button
                  ref={addNewRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setSelectedIndex(-1)}
                  className={cn(
                     'w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-zinc-800/50',
                     selectedIndex === -1 ? 'bg-indigo-500/10' : 'hover:bg-zinc-800/50',
                  )}
               >
                  <div
                     className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0',
                        selectedIndex === -1
                           ? 'bg-indigo-500 text-white'
                           : 'bg-zinc-800 text-zinc-500',
                     )}
                  >
                     <HiOutlinePlus size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span
                        className={cn(
                           'text-sm font-medium truncate',
                           selectedIndex === -1 ? 'text-white' : 'text-zinc-300',
                        )}
                     >
                        Usar "{value}"
                     </span>
                     <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                        Crear como nuevo registro
                     </span>
                  </div>
                  {selectedIndex === -1 && (
                     <div className="ml-auto animate-in fade-in slide-in-from-right-2 duration-300">
                        <span className="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold shadow-lg shadow-indigo-500/20">
                           SELECCIONADO
                        </span>
                     </div>
                  )}
               </button>

               {filteredProducts.map((product, index) => {
                  const isActive = index === selectedIndex;
                  return (
                     <button
                        key={product.id}
                        ref={el => {
                           itemsRef.current[index] = el;
                        }}
                        type="button"
                        onClick={() => handleSelect(product)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                           'w-full text-left px-4 py-3 flex items-center justify-between group transition-all border-b border-zinc-800/50 last:border-0',
                           isActive ? 'bg-zinc-800 border-zinc-700' : 'hover:bg-zinc-800/50',
                        )}
                     >
                        <div className="flex flex-col min-w-0 pr-2">
                           <div className="flex items-center gap-2">
                              <span
                                 className={cn(
                                    'text-sm font-medium truncate transition-colors',
                                    isActive ? 'text-white' : 'text-zinc-300',
                                 )}
                              >
                                 {product.description}
                              </span>
                              {isActive && (
                                 <span className="flex items-center gap-1 text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold animate-in zoom-in duration-200 shadow-lg shadow-indigo-500/20">
                                    <HiOutlinePencilSquare size={10} /> EDITAR
                                 </span>
                              )}
                           </div>

                           <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && (
                                 <span className="text-xs text-zinc-500 font-mono bg-zinc-950/50 px-1 rounded border border-zinc-800">
                                    {product.sku}
                                 </span>
                              )}
                           </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                           <span
                              className={cn(
                                 'text-xs font-mono font-medium',
                                 isActive ? 'text-emerald-400' : 'text-zinc-400',
                              )}
                           >
                              <SmartNumber value={product.price} variant="currency" />
                           </span>
                           <span
                              className={cn(
                                 'text-[10px]',
                                 product.stock <= 0 ? 'text-red-500 font-medium' : 'text-zinc-600',
                              )}
                           >
                              Stock: {product.stock}
                           </span>
                        </div>
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};
