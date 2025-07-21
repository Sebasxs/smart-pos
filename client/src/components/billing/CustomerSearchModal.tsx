import { useState, useEffect, useRef, startTransition, useCallback } from 'react';
import {
   HiOutlineSearch,
   HiOutlineUser,
   HiOutlineExclamationCircle,
   HiOutlineIdentification,
   HiOutlineMail,
   HiOutlineUserGroup,
} from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';
import { type CheckoutState } from '../../store/billingStore';

const API_URL = import.meta.env.VITE_API_URL;

type CustomerResult = {
   id: string;
   name: string;
   tax_id: string;
   email: string;
   city: string;
};

type CustomerSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectCustomer: (customer: Partial<CheckoutState['customer']>) => void;
};

export const CustomerSearchModal = ({
   isOpen,
   onClose,
   onSelectCustomer,
}: CustomerSearchModalProps) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<CustomerResult[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [selectedIndex, setSelectedIndex] = useState(0);
   const listRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   // Reset state on close / Focus on open
   useEffect(() => {
      if (!isOpen) {
         setSearchTerm('');
         setResults([]);
         setError('');
         setIsLoading(false);
      } else {
         setTimeout(() => inputRef.current?.focus(), 50);
      }
   }, [isOpen]);

   // Search effect
   useEffect(() => {
      if (!isOpen || searchTerm.trim() === '') {
         setResults([]);
         return;
      }

      const timeoutId = setTimeout(async () => {
         setIsLoading(true);
         setError('');
         try {
            const res = await fetch(
               `${API_URL}/customers/search?search=${encodeURIComponent(searchTerm)}`,
            );
            if (!res.ok) throw new Error('Error buscando clientes');
            const data = await res.json();
            setResults(data);
            startTransition(() => setSelectedIndex(0));
         } catch (err) {
            console.error(err);
            setError('Error de conexión');
         } finally {
            setIsLoading(false);
         }
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [searchTerm, isOpen]);

   const handleSelect = useCallback(
      (c: CustomerResult) => {
         onSelectCustomer({
            name: c.name,
            email: c.email || '',
            taxId: c.tax_id || '',
            city: c.city || '',
         });
         onClose();
      },
      [onSelectCustomer, onClose],
   );

   // Keyboard navigation
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) handleSelect(results[selectedIndex]);
         } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => {
               const next =
                  e.key === 'ArrowDown'
                     ? (prev + 1) % results.length
                     : (prev - 1 + results.length) % results.length;
               const el = listRef.current?.children[next] as HTMLElement;
               el?.scrollIntoView({ block: 'nearest' });
               return next;
            });
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, results, selectedIndex, handleSelect]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         variant="search"
         className="flex flex-col p-0 bg-zinc-950 border-zinc-800"
      >
         <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-800/50">
            <div className="text-zinc-500">
               {isLoading ? (
                  <CgSpinner className="animate-spin" size={24} />
               ) : (
                  <HiOutlineSearch size={24} />
               )}
            </div>
            <input
               ref={inputRef}
               type="text"
               placeholder="Buscar cliente (Nombre, NIT, Email)..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="flex-1 bg-transparent text-xl text-white placeholder:text-zinc-600 outline-none font-medium"
               autoComplete="off"
            />
         </div>

         <div
            ref={listRef}
            className="flex-1 overflow-y-auto custom-scrollbar max-h-[50vh] min-h-[300px] p-2 relative"
         >
            {error ? (
               <div className="h-full flex flex-col items-center justify-center text-red-400 gap-3">
                  <div className="p-4 bg-red-500/10 rounded-full">
                     <HiOutlineExclamationCircle size={32} />
                  </div>
                  <span className="font-medium">{error}</span>
               </div>
            ) : results.length > 0 ? (
               results.map((c, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                     <div
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                           group flex justify-between items-center px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all border
                           ${
                              isSelected
                                 ? 'bg-blue-600/10 border-blue-500/30'
                                 : 'bg-transparent border-transparent hover:bg-zinc-900'
                           }
                        `}
                     >
                        <div className="flex items-center gap-4 overflow-hidden w-full">
                           <div
                              className={`
                              p-2.5 rounded-xl shrink-0 transition-colors
                              ${isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}
                           `}
                           >
                              <HiOutlineUser size={20} />
                           </div>
                           <div className="flex flex-col truncate flex-1">
                              <span
                                 className={`text-base font-medium truncate ${
                                    isSelected ? 'text-white' : 'text-zinc-200'
                                 }`}
                              >
                                 {c.name}
                              </span>
                              <div className="flex items-center gap-4 text-xs opacity-70 mt-0.5">
                                 {c.tax_id && (
                                    <span className="flex items-center gap-1 text-zinc-400">
                                       <HiOutlineIdentification size={14} /> {c.tax_id}
                                    </span>
                                 )}
                                 {c.email && (
                                    <span className="flex items-center gap-1 text-zinc-400 truncate">
                                       <HiOutlineMail size={14} /> {c.email}
                                    </span>
                                 )}
                              </div>
                           </div>
                           {c.city && (
                              <div className="text-xs text-zinc-500 font-medium px-2 shrink-0">
                                 {c.city}
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500 pt-12">
                  {searchTerm ? (
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800 shadow-inner">
                           <HiOutlineUserGroup size={28} className="text-zinc-600" />
                        </div>
                        <h3 className="text-zinc-300 font-bold text-lg mb-1">Sin resultados</h3>
                        <p className="text-zinc-500 text-sm max-w-[250px]">
                           No encontramos clientes que coincidan con "{searchTerm}".
                        </p>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
                        <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center mb-5 border border-zinc-800 shadow-xl -rotate-3">
                           <HiOutlineUser size={40} className="text-blue-500/80" />
                        </div>
                        <h3 className="text-zinc-400 font-medium text-lg">Base de Clientes</h3>
                        <p className="text-zinc-600 text-sm mt-1">Busca por nombre, NIT o email</p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </Modal>
   );
};
