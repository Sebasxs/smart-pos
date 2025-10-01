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
            setSelectedIndex(prev => (prev >= filteredProducts.length - 1 ? -1 : prev + 1));
            break;
         case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(prev => (prev <= -1 ? filteredProducts.length - 1 : prev - 1));
            break;
         case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0) {
               handleSelect(filteredProducts[selectedIndex]);
            } else {
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
      setTimeout(() => {
         if (!containerRef.current?.contains(document.activeElement)) {
            setIsOpen(false);
         }
      }, 200);
   };

   return (
      <div className="w-full relative group" ref={containerRef}>
         <label className="block text-sm font-medium text-text-muted mb-1.5">Descripción</label>
         <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none transition-colors group-focus-within:text-primary">
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
                  'w-full bg-surface-highlight border border-border text-text-main placeholder:text-text-dim',
                  'rounded-lg py-2.5 outline-none pl-10 pr-3 transition-all duration-200',
                  showDropdown
                     ? 'border-border-hover focus:border-border-hover rounded-b-none shadow-sm'
                     : 'focus:border-border-focus focus:ring-1 focus:ring-border-focus/20', // Usando alias neutral
                  'hover:border-border-hover',
               )}
               placeholder={placeholder}
               autoFocus={autoFocus}
               required={required}
               autoComplete="off"
            />
         </div>

         {/* Suggestions Dropdown */}
         {showDropdown && (
            <div
               ref={listRef}
               className={cn(
                  'absolute z-50 left-0 right-0 -mt-[1px] bg-surface border border-border-hover border-t-0 rounded-b-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200',
                  'max-h-[280px] overflow-y-auto custom-scrollbar scroll-pt-9',
               )}
            >
               {/* Header Sticky */}
               <div className="h-9 px-3 bg-surface-highlight/80 backdrop-blur-sm border-b border-border text-[10px] text-text-muted font-bold uppercase tracking-wider flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-1.5">
                     <HiOutlineExclamationCircle size={12} />
                     <span>Coincidencias encontradas</span>
                  </div>
                  <span className="opacity-70">
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
                     'w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-border/50',
                     selectedIndex === -1
                        ? 'bg-primary-subtle text-text-main'
                        : 'text-text-secondary hover:bg-surface-highlight',
                  )}
               >
                  <div
                     className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0',
                        selectedIndex === -1
                           ? 'bg-primary text-white'
                           : 'bg-surface-active text-text-muted',
                     )}
                  >
                     <HiOutlinePlus size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <span
                        className={cn(
                           'text-sm font-medium truncate',
                           selectedIndex === -1 ? 'text-primary-text' : 'text-text-main',
                        )}
                     >
                        Usar "{value}"
                     </span>
                     <span className="text-[10px] text-text-dim uppercase tracking-wider font-semibold">
                        Crear como nuevo registro
                     </span>
                  </div>
                  {selectedIndex === -1 && (
                     <div className="ml-auto animate-in fade-in slide-in-from-right-2 duration-300">
                        <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">
                           SELECCIONADO
                        </span>
                     </div>
                  )}
               </button>

               {/* Product List */}
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
                           'w-full text-left px-4 py-3 flex items-center justify-between group transition-all border-b border-border/50 last:border-0',
                           isActive ? 'bg-surface-highlight' : 'hover:bg-surface-highlight/50',
                        )}
                     >
                        <div className="flex flex-col min-w-0 pr-2">
                           <div className="flex items-center gap-2">
                              <span
                                 className={cn(
                                    'text-sm font-medium truncate transition-colors',
                                    isActive ? 'text-white' : 'text-text-secondary',
                                 )}
                              >
                                 {product.description}
                              </span>
                              {isActive && (
                                 <span className="flex items-center gap-1 text-[9px] bg-primary-subtle text-primary-text px-1.5 py-0.5 rounded font-bold animate-in zoom-in duration-200">
                                    <HiOutlinePencilSquare size={10} /> EDITAR
                                 </span>
                              )}
                           </div>

                           <div className="flex items-center gap-2 mt-0.5">
                              {product.sku && (
                                 <span className="text-xs text-text-dim font-mono bg-canvas/30 px-1 rounded border border-border/30">
                                    {product.sku}
                                 </span>
                              )}
                           </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                           <span
                              className={cn(
                                 'text-xs font-mono font-medium',
                                 isActive ? 'text-success-text' : 'text-text-muted',
                              )}
                           >
                              <SmartNumber value={product.price} variant="currency" />
                           </span>
                           <span
                              className={cn(
                                 'text-[10px]',
                                 product.stock <= 0
                                    ? 'text-danger-text font-bold'
                                    : 'text-text-dim',
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
