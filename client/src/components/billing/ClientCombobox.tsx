import { useState, useEffect, useRef, startTransition } from 'react';
import {
   HiOutlineIdentification,
   HiOutlinePlus,
   HiOutlineMagnifyingGlass,
   HiOutlineBuildingOffice,
} from 'react-icons/hi2';
import { HiOutlineMail, HiX } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;

type CustomerResult = {
   id: string;
   name: string;
   tax_id: string;
   document_type: string;
   email: string;
   phone: string;
   city: string;
   address: string;
   account_balance: number;
};

type ClientComboboxProps = {
   value: string;
   placeholder?: string;
   className?: string;
   id?: string;

   onFocus?: () => void;
   onChange: (value: string) => void;
   onSelectCustomer: (customer: CustomerResult) => void;
   onRequestCreate: (inputValue: string) => void;
   onBlur?: () => void;
};

export const ClientCombobox = ({
   value,
   onChange,
   onSelectCustomer,
   onRequestCreate,
   placeholder,
   className,
   id,
   onFocus,
   onBlur,
}: ClientComboboxProps) => {
   const { token } = useAuthStore();
   const [isOpen, setIsOpen] = useState(false);
   const [results, setResults] = useState<CustomerResult[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [highlightedIndex, setHighlightedIndex] = useState(0);

   const containerRef = useRef<HTMLDivElement>(null);
   const dropdownRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!isOpen || value.trim() === '') {
         setResults([]);
         return;
      }

      const timeoutId = setTimeout(async () => {
         setIsLoading(true);
         try {
            const res = await fetch(
               `${API_URL}/customers/search?search=${encodeURIComponent(value)}`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               },
            );
            if (res.ok) {
               const data = await res.json();
               setResults(data);
               startTransition(() => setHighlightedIndex(0));
            }
         } catch (err) {
            console.error(err);
         } finally {
            setIsLoading(false);
         }
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [value, isOpen]);

   useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
         }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
   }, []);

   const handleKeyDown = (e: React.KeyboardEvent) => {
      const totalOptions = results.length + (value.trim() ? 1 : 0);
      if (!isOpen || totalOptions === 0) return;

      switch (e.key) {
         case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % totalOptions);
            break;
         case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + totalOptions) % totalOptions);
            break;
         case 'Enter':
            e.preventDefault();
            if (highlightedIndex === results.length) {
               handleCreate();
            } else if (results[highlightedIndex]) {
               handleSelect(results[highlightedIndex]);
            }
            break;
         case 'Escape':
            setIsOpen(false);
            break;
      }
   };

   // Auto-scroll al elemento resaltado
   useEffect(() => {
      if (isOpen && dropdownRef.current) {
         const allChildren = Array.from(dropdownRef.current.children);
         const highlightedElement = allChildren[highlightedIndex] as HTMLElement;
         if (highlightedElement) {
            highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
         }
      }
   }, [highlightedIndex, isOpen]);

   const handleSelect = (customer: CustomerResult) => {
      onChange(customer.name);
      onSelectCustomer(customer);
      setIsOpen(false);
   };

   const handleCreate = () => {
      onRequestCreate(value);
      setIsOpen(false);
   };

   const showDropdown = isOpen && (results.length > 0 || value.trim() !== '');

   return (
      <div className="relative w-full" ref={containerRef}>
         <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-400 z-10">
               {isLoading ? (
                  <CgSpinner className="animate-spin" size={18} />
               ) : (
                  <HiOutlineMagnifyingGlass size={18} />
               )}
            </div>
            <input
               id={id}
               type="text"
               value={value}
               onChange={e => {
                  onChange(e.target.value);
                  setIsOpen(true);
               }}
               onFocus={() => {
                  setIsOpen(true);
                  onFocus?.();
               }}
               onBlur={() => {
                  setTimeout(() => {
                     onBlur?.();
                  }, 200);
               }}
               onKeyDown={handleKeyDown}
               placeholder={placeholder || 'Buscar cliente...'}
               autoComplete="off"
               className={cn(
                  'w-full bg-zinc-900 border border-zinc-800 focus:border-b-zinc-800/50',
                  'rounded-xl py-2.5 pl-10 pr-10',
                  'text-sm text-zinc-200 placeholder:text-zinc-500',
                  'outline-none transition-all duration-200 shadow-sm',
                  showDropdown && 'rounded-b-none border-b-zinc-800/50',
                  className,
               )}
            />
            {value && (
               <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded cursor-pointer"
                  onClick={() => onChange('')}
                  tabIndex={-1}
               >
                  <HiX size={16} />
               </button>
            )}
         </div>

         {showDropdown && (
            <div className="absolute -mt-[1px] left-0 right-0 z-50 bg-zinc-900 border border-zinc-800 rounded-xl rounded-t-none shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in duration-150">
               <div
                  ref={dropdownRef}
                  className="max-h-[320px] overflow-y-auto custom-scrollbar p-1"
               >
                  {results.map((c, index) => {
                     const isHighlighted = index === highlightedIndex;
                     return (
                        <div
                           key={c.id}
                           onClick={() => handleSelect(c)}
                           onMouseEnter={() => setHighlightedIndex(index)}
                           className={cn(
                              'group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 border border-transparent',
                              isHighlighted
                                 ? 'bg-zinc-800 border-zinc-700/50'
                                 : 'hover:bg-zinc-800/50',
                           )}
                        >
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div
                                 className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-colors',
                                    isHighlighted
                                       ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                       : 'bg-zinc-800 text-zinc-500 border-zinc-700',
                                 )}
                              >
                                 {c.name.substring(0, 1).toUpperCase()}
                              </div>
                              <div className="flex flex-col truncate">
                                 <span
                                    className={cn(
                                       'text-sm font-medium truncate transition-colors',
                                       isHighlighted ? 'text-white' : 'text-zinc-300',
                                    )}
                                 >
                                    {c.name}
                                 </span>
                                 <div className="flex items-center gap-3 text-xs opacity-70">
                                    <span className="flex items-center gap-1 text-zinc-500">
                                       <HiOutlineIdentification size={12} />
                                       {c.tax_id}
                                    </span>
                                    {c.city && (
                                       <span className="flex items-center gap-1 text-zinc-500 truncate">
                                          <HiOutlineBuildingOffice size={12} />
                                          {c.city}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>

                           {/* Info derecha (Email oculto en movil pequeño) */}
                           {c.email && (
                              <div
                                 className={cn(
                                    'hidden sm:flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors',
                                    isHighlighted
                                       ? 'text-zinc-300 bg-zinc-700/50'
                                       : 'text-zinc-600 bg-zinc-800/50',
                                 )}
                              >
                                 <HiOutlineMail size={12} />
                                 <span className="max-w-[120px] truncate">{c.email}</span>
                              </div>
                           )}
                        </div>
                     );
                  })}

                  {/* Create Option */}
                  {value.trim() !== '' && (
                     <div
                        onClick={handleCreate}
                        onMouseEnter={() => setHighlightedIndex(results.length)}
                        className={cn(
                           'mt-1 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-3 border border-dashed border-zinc-800',
                           highlightedIndex === results.length
                              ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                              : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-blue-400',
                        )}
                     >
                        <div
                           className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                              highlightedIndex === results.length
                                 ? 'bg-blue-500 text-white border-blue-500'
                                 : 'bg-zinc-800 text-zinc-500 border-zinc-700',
                           )}
                        >
                           <HiOutlinePlus size={16} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">Crear nuevo cliente</span>
                           <span className="text-xs opacity-70 truncate max-w-[200px]">
                              "{value}"
                           </span>
                        </div>
                        {highlightedIndex === results.length && (
                           <kbd className="ml-auto text-[10px] font-mono bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">
                              Enter
                           </kbd>
                        )}
                     </div>
                  )}
               </div>

               {/* Footer con resumen */}
               <div className="bg-zinc-950/50 px-3 py-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>{results.length} coincidencias</span>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-1">
                        <kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">↑↓</kbd>{' '}
                        navegar
                     </span>
                     <span className="flex items-center gap-1">
                        <kbd className="bg-zinc-800 px-1 rounded border border-zinc-700">↵</kbd>{' '}
                        seleccionar
                     </span>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
