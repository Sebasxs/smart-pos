import { useState, useEffect, useRef, startTransition } from 'react';
import { HiOutlineUser, HiOutlineIdentification } from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { cn } from '../../utils/cn';

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
};

type CustomerAutocompleteProps = {
   value: string;
   onChange: (value: string) => void;
   onSelectCustomer: (customer: CustomerResult) => void;
   placeholder?: string;
   className?: string;
   id?: string;
};

export const CustomerAutocomplete = ({
   value,
   onChange,
   onSelectCustomer,
   placeholder,
   className,
   id,
}: CustomerAutocompleteProps) => {
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
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
         case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % results.length);
            break;
         case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + results.length) % results.length);
            break;
         case 'Enter':
            e.preventDefault();
            if (results[highlightedIndex]) {
               handleSelect(results[highlightedIndex]);
            }
            break;
         case 'Escape':
            setIsOpen(false);
            break;
      }
   };

   useEffect(() => {
      if (isOpen && dropdownRef.current) {
         const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement;
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

   const showDropdown = isOpen && results.length > 0;

   return (
      <div className="relative group flex-1 min-w-[150px]" ref={containerRef}>
         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none transition-colors group-focus-within:text-blue-500/80 z-10">
            {isLoading ? (
               <CgSpinner className="animate-spin" size={18} />
            ) : (
               <HiOutlineUser size={18} />
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
            onFocus={() => value.trim() !== '' && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            className={cn(
               'w-full bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800',
               'border border-zinc-800 focus:border-zinc-500/70',
               'rounded-lg py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500',
               'outline-none transition-all duration-200',
               'pl-10 pr-3',
               showDropdown && 'rounded-b-none border-b-transparent focus:border-b-transparent',
               className,
            )}
         />

         {showDropdown && (
            <div className="absolute left-0 right-0 z-50 -mt-[1px] bg-zinc-800 border border-zinc-800 group-focus-within:border-zinc-500/70 border-t-0 rounded-b-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in duration-200">
               <div
                  ref={dropdownRef}
                  className="max-h-[280px] overflow-y-auto py-1 custom-scrollbar"
               >
                  {results.map((c, index) => {
                     const isHighlighted = index === highlightedIndex;
                     return (
                        <div
                           key={c.id}
                           onClick={() => handleSelect(c)}
                           onMouseEnter={() => setHighlightedIndex(index)}
                           className={cn(
                              'px-4 py-3 cursor-pointer transition-all duration-150 flex flex-col gap-1',
                              isHighlighted
                                 ? 'bg-zinc-700/50 text-white'
                                 : 'text-zinc-300 hover:bg-zinc-700/30',
                           )}
                        >
                           <span className="text-sm font-medium">{c.name}</span>
                           <div className="flex items-center gap-3 text-xs opacity-70">
                              {c.tax_id && (
                                 <span className="flex items-center gap-1">
                                    <HiOutlineIdentification size={12} /> {c.tax_id}
                                 </span>
                              )}
                              {c.email && (
                                 <span className="flex items-center gap-1 truncate max-w-[150px]">
                                    <HiOutlineMail size={12} /> {c.email}
                                 </span>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </div>
   );
};
