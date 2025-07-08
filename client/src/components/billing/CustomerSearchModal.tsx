import { useState, useEffect, useRef, startTransition, useCallback } from 'react';
import { HiOutlineSearch, HiOutlineUser, HiOutlineExclamationCircle } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';
import { type CheckoutState } from '../../store/billingStore';

const API_URL = import.meta.env.VITE_API_URL;

type CustomerSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectCustomer: (customer: Partial<CheckoutState['customer']>) => void;
};

type CustomerResult = {
   id: string;
   name: string;
   tax_id: string;
   email: string;
   city: string;
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

   // Reset state on close
   useEffect(() => {
      if (!isOpen) {
         setSearchTerm('');
         setResults([]);
         setError('');
         setIsLoading(false);
      }
   }, [isOpen]);

   // Search Logic
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

   // Keyboard Navigation
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

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
               handleSelect(results[selectedIndex]);
            }
         } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => {
               const next =
                  e.key === 'ArrowDown'
                     ? (prev + 1) % results.length
                     : (prev - 1 + results.length) % results.length;
               listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
               return next;
            });
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, results, selectedIndex, handleSelect]);

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-lg p-0 overflow-hidden">
         <div className="flex flex-col gap-y-1 w-full">
            <div className="relative px-4 pt-4">
               <div className="absolute top-1/2 -translate-y-1 left-8 text-zinc-400">
                  {isLoading ? (
                     <CgSpinner className="animate-spin" size={22} />
                  ) : (
                     <HiOutlineSearch size={22} />
                  )}
               </div>
               <input
                  type="text"
                  placeholder="Buscar cliente (Nombre o NIT)..."
                  autoFocus
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 text-lg text-white rounded-full mb-1 pl-11 py-2 border-2 border-zinc-600 focus:border-blue-500 outline-none transition-colors duration-300"
               />
            </div>

            <div className="h-[1px] bg-zinc-800 w-full mt-1" />

            <div
               ref={listRef}
               className="flex flex-col pb-1 max-h-[300px] min-h-[100px] h-fit mb-2 mx-2 overflow-y-auto custom-scrollbar"
            >
               {error ? (
                  <div className="text-red-400 flex flex-col items-center justify-center py-8 gap-2">
                     <HiOutlineExclamationCircle size={30} />
                     <span>{error}</span>
                  </div>
               ) : results.length > 0 ? (
                  results.map((c, index) => (
                     <div
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                           mx-2 flex items-center gap-3 px-4 py-2 rounded-xl my-1 cursor-pointer transition-all
                           ${
                              index === selectedIndex
                                 ? 'bg-blue-600 text-white'
                                 : 'hover:bg-zinc-800 text-zinc-300'
                           }
                        `}
                     >
                        <HiOutlineUser className="shrink-0 opacity-70" size={20} />
                        <div className="flex flex-col overflow-hidden">
                           <span className="font-bold text-sm truncate">{c.name}</span>
                           <div className="flex gap-2 text-xs opacity-80">
                              <span>{c.tax_id}</span>
                              {c.city && <span>• {c.city}</span>}
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="px-6 py-8 text-zinc-500 text-center">
                     {searchTerm ? (
                        'No se encontraron clientes.'
                     ) : (
                        <span className="text-sm">Escribe para buscar en la base de datos...</span>
                     )}
                  </div>
               )}
            </div>
         </div>
      </Modal>
   );
};
