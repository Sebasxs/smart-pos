import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import {
   HiOutlinePlus,
   HiOutlineIdentification,
   HiOutlineUser,
   HiOutlineMapPin,
} from 'react-icons/hi2';
import { HiOutlineMail, HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';
import { SmartNumber } from '../ui/SmartNumber';
import { useAuthStore } from '../../store/authStore';
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
   account_balance: number;
};

type CustomerSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectClient: (client: CustomerResult) => void;
   onRequestCreate: (name: string) => void;
};

const useClientSearch = (isOpen: boolean) => {
   const { token } = useAuthStore();
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<CustomerResult[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   useEffect(() => {
      if (!isOpen) {
         setSearchTerm('');
         setResults([]);
         setError('');
         setIsLoading(false);
      }
   }, [isOpen]);

   useEffect(() => {
      if (!isOpen) return;
      if (searchTerm.trim() === '') {
         setResults([]);
         setIsLoading(false);
         return;
      }

      const timeoutId = setTimeout(async () => {
         setIsLoading(true);
         setError('');
         try {
            const res = await fetch(
               `${API_URL}/api/customers/search?search=${encodeURIComponent(searchTerm)}`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               },
            );
            if (!res.ok) throw new Error('Error buscando');
            const data = await res.json();
            setResults(data);
         } catch (err) {
            console.error(err);
            setError('Error de conexión');
            setResults([]);
         } finally {
            setIsLoading(false);
         }
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [searchTerm, isOpen, token]);

   return { searchTerm, setSearchTerm, results, isLoading, error };
};

export const CustomerSearchModal = ({
   isOpen,
   onClose,
   onSelectClient,
   onRequestCreate,
}: CustomerSearchModalProps) => {
   const { searchTerm, setSearchTerm, results, isLoading, error } = useClientSearch(isOpen);
   const [selectedIndex, setSelectedIndex] = useState(0);

   const listRef = useRef<HTMLDivElement>(null);
   const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
   }, [isOpen]);

   useEffect(() => {
      startTransition(() => setSelectedIndex(0));
      if (listRef.current) {
         listRef.current.scrollTo({ top: 0 });
      }
   }, [results]);

   useEffect(() => {
      if (isOpen && (results.length > 0 || searchTerm.trim() !== '')) {
         const currentItem = itemsRef.current[selectedIndex];
         if (currentItem) {
            currentItem.scrollIntoView({
               block: 'nearest',
               behavior: 'smooth',
            });
         }
      }
   }, [selectedIndex, isOpen, results.length, searchTerm]);

   const handleSelect = useCallback(
      (client: CustomerResult) => {
         onSelectClient(client);
         onClose();
      },
      [onSelectClient, onClose],
   );

   const handleCreate = useCallback(() => {
      onRequestCreate(searchTerm);
      onClose();
   }, [onRequestCreate, searchTerm, onClose]);

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         const hasCreateOption = searchTerm.trim() !== '';
         const total = results.length + (hasCreateOption ? 1 : 0);

         if (total === 0) return;

         if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % total);
         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + total) % total);
         } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex === results.length && hasCreateOption) {
               handleCreate();
            } else if (results[selectedIndex]) {
               handleSelect(results[selectedIndex]);
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, results, selectedIndex, handleSelect, handleCreate, searchTerm]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         variant="search"
         className="flex flex-col p-0 bg-zinc-950 border-zinc-800 h-[600px]"
      >
         {/* HEADER */}
         <div className="flex items-center gap-4 px-5 py-5 border-b border-zinc-800/50 shrink-0">
            <div className="text-zinc-500">
               {isLoading ? (
                  <CgSpinner className="animate-spin text-blue-500" size={22} />
               ) : (
                  <HiOutlineSearch size={22} />
               )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
               <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-lg text-white placeholder:text-zinc-600 outline-none font-medium"
                  autoComplete="off"
               />
            </div>

            {isLoading && (
               <span className="hidden sm:flex gap-2 text-md text-sky-500 font-medium animate-pulse pr-2">
                  Buscando...
               </span>
            )}
         </div>

         {/* RESULTS */}
         <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
            {error ? (
               <div className="h-full flex flex-col items-center justify-center text-red-400 gap-3">
                  <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                     <HiOutlineExclamationCircle size={32} />
                  </div>
                  <span className="font-medium text-sm">{error}</span>
               </div>
            ) : results.length > 0 || searchTerm.trim() !== '' ? (
               <div className="flex flex-col gap-1.5">
                  {results.map((client, index) => {
                     const isSelected = index === selectedIndex;

                     return (
                        <div
                           key={client.id}
                           ref={el => {
                              itemsRef.current[index] = el;
                           }}
                           onClick={() => handleSelect(client)}
                           onMouseEnter={() => setSelectedIndex(index)}
                           className={cn(
                              'group relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border',
                              isSelected
                                 ? 'bg-zinc-900 border-blue-500/50 shadow-lg shadow-blue-900/10 z-10'
                                 : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800',
                           )}
                        >
                           {/* Lateral indicator */}
                           {isSelected && (
                              <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                           )}

                           {/* INFO */}
                           <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">
                              {/* Avatar */}
                              <div
                                 className={cn(
                                    'w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all duration-100 font-bold text-xl border-2',
                                    isSelected
                                       ? 'bg-blue-500 text-white border-blue-400/50 shadow-lg shadow-blue-500/20'
                                       : 'bg-zinc-900 text-zinc-500 border-zinc-800',
                                 )}
                              >
                                 {client.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="flex flex-col truncate flex-1 min-w-0 gap-0.5">
                                 {/* Name */}
                                 <span
                                    className={cn(
                                       'text-base font-bold truncate leading-tight transition-colors',
                                       isSelected ? 'text-white' : 'text-zinc-200',
                                    )}
                                 >
                                    {client.name}
                                 </span>

                                 {/* Email */}
                                 <div
                                    className={cn(
                                       'flex items-center gap-1.5 text-sm truncate transition-colors',
                                       isSelected ? 'text-blue-200' : 'text-zinc-500',
                                    )}
                                 >
                                    <HiOutlineMail size={13} className="shrink-0" />
                                    <span className="truncate">
                                       {client.email || 'Sin correo electrónico'}
                                    </span>
                                 </div>

                                 {/* Technical info */}
                                 <div className="flex items-center gap-x-4 gap-y-1 text-xs font-medium flex-wrap">
                                    <span
                                       className={cn(
                                          'flex items-center gap-1 transition-colors',
                                          isSelected ? 'text-blue-100/60' : 'text-zinc-500',
                                       )}
                                    >
                                       <HiOutlineIdentification size={13} />
                                       {client.tax_id}
                                    </span>

                                    {client.city && (
                                       <span
                                          className={cn(
                                             'flex items-center gap-1 transition-colors',
                                             isSelected ? 'text-blue-100/60' : 'text-zinc-500',
                                          )}
                                       >
                                          <HiOutlineMapPin size={13} />
                                          {client.city}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>

                           {/* Balance */}
                           {client.account_balance !== 0 && (
                              <div className="flex flex-col items-end gap-1 shrink-0 pl-4 border-l border-zinc-800/50">
                                 <span
                                    className={cn(
                                       'text-[10px] uppercase tracking-wider font-bold transition-colors',
                                       isSelected ? 'text-zinc-300' : 'text-zinc-500',
                                    )}
                                 >
                                    Saldo
                                 </span>
                                 <SmartNumber
                                    value={client.account_balance}
                                    variant="currency"
                                    showPrefix={true}
                                    className={cn(
                                       'font-mono font-bold text-base tracking-tight leading-none',
                                       client.account_balance > 0
                                          ? 'text-emerald-400'
                                          : client.account_balance < 0
                                          ? 'text-red-400'
                                          : isSelected
                                          ? 'text-zinc-300'
                                          : 'text-zinc-500',
                                    )}
                                 />
                              </div>
                           )}
                        </div>
                     );
                  })}

                  {searchTerm.trim() !== '' && (
                     <div
                        ref={el => {
                           itemsRef.current[results.length] = el;
                        }}
                        onClick={handleCreate}
                        onMouseEnter={() => setSelectedIndex(results.length)}
                        className={cn(
                           'mt-2 flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all border border-dashed',
                           selectedIndex === results.length
                              ? 'bg-blue-900/20 border-blue-500/50 text-blue-400'
                              : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900/50',
                        )}
                     >
                        <div
                           className={cn(
                              'w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                              selectedIndex === results.length
                                 ? 'bg-blue-500 text-white border-blue-500'
                                 : 'bg-zinc-900 text-zinc-500 border-zinc-800',
                           )}
                        >
                           <HiOutlinePlus size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">Crear nuevo cliente</span>
                           <span className="text-xs opacity-70 truncate max-w-[200px]">
                              "{searchTerm}"
                           </span>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               /* EMPTY STATE */
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity duration-500">
                     <div className="w-20 h-20 bg-terraform-gradient rounded-3xl flex items-center justify-center mb-5 border border-zinc-800 shadow-2xl -rotate-3">
                        <HiOutlineUser size={40} className="text-blue-500/50" />
                     </div>
                     <h3 className="text-zinc-400 font-medium text-lg">Directorio de Clientes</h3>
                     <p className="text-zinc-600 text-sm mt-1 max-w-[240px]">
                        Busca por nombre, identificación o correo electrónico.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </Modal>
   );
};
