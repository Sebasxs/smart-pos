import { useState, useEffect, useRef } from 'react';
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
import { useListNavigation } from '../../hooks/useListNavigation';

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

export const CustomerSearchModal = ({
   isOpen,
   onClose,
   onSelectClient,
   onRequestCreate,
}: CustomerSearchModalProps) => {
   const { token } = useAuthStore();
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<CustomerResult[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const inputRef = useRef<HTMLInputElement>(null);

   const hasCreateOption = searchTerm.trim() !== '';

   // Navigation Hook
   const { selectedIndex, setSelectedIndex, listRef, itemsRef, handleKeyDown } = useListNavigation({
      items: results,
      customActionCount: hasCreateOption ? 1 : 0,
      onSelect: (client, isCustom) => {
         if (client) {
            onSelectClient(client);
            onClose();
         } else if (isCustom) {
            onRequestCreate(searchTerm);
            onClose();
         }
      },
   });

   // Search Logic
   useEffect(() => {
      if (!isOpen) {
         setSearchTerm('');
         setResults([]);
         setError('');
         setIsLoading(false);
         return;
      }
      setTimeout(() => inputRef.current?.focus(), 50);
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
               { headers: { Authorization: `Bearer ${token}` } },
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

   // Attach Key Listener
   useEffect(() => {
      if (!isOpen) return;
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, handleKeyDown]);

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         variant="search"
         className="flex flex-col p-0 bg-surface border border-border h-[600px] shadow-2xl shadow-black/80 rounded-2xl"
      >
         {/* HEADER */}
         <div className="flex items-center gap-4 px-6 py-5 border-b border-border shrink-0 bg-surface z-10">
            <div className="text-text-muted">
               {isLoading ? (
                  <CgSpinner className="animate-spin text-primary" size={24} />
               ) : (
                  <HiOutlineSearch size={24} />
               )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
               <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar clientes por nombre, NIT o email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xl text-text-main placeholder:text-text-dim outline-none font-medium"
                  autoComplete="off"
               />
            </div>
            {isLoading && (
               <span className="hidden sm:flex gap-2 text-sm text-primary font-medium animate-pulse pr-2">
                  Buscando...
               </span>
            )}
         </div>

         {/* RESULTS */}
         <div
            ref={listRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-2 relative bg-canvas/30"
         >
            {error ? (
               <div className="h-full flex flex-col items-center justify-center text-danger-text gap-3 opacity-80">
                  <div className="p-4 bg-danger-bg rounded-full ring-1 ring-danger/20">
                     <HiOutlineExclamationCircle size={32} />
                  </div>
                  <span className="font-medium text-sm">{error}</span>
               </div>
            ) : results.length > 0 || searchTerm.trim() !== '' ? (
               <div className="flex flex-col gap-1.5 p-1">
                  {results.map((client, index) => {
                     const isSelected = index === selectedIndex;
                     return (
                        <div
                           key={client.id}
                           ref={el => {
                              itemsRef.current[index] = el;
                           }}
                           onClick={() => {
                              onSelectClient(client);
                              onClose();
                           }}
                           onMouseEnter={() => setSelectedIndex(index)}
                           className={cn(
                              'group relative flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150',
                              isSelected
                                 ? 'bg-surface-highlight shadow-lg ring-1 ring-border-hover z-10 translate-x-1'
                                 : 'bg-transparent border-transparent hover:bg-surface-highlight/50',
                           )}
                        >
                           {isSelected && (
                              <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                           )}
                           <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0 pl-2">
                              <div
                                 className={cn(
                                    'w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-100 font-bold text-lg border-2',
                                    isSelected
                                       ? 'bg-primary text-white border-primary/50 shadow-md shadow-primary/20'
                                       : 'bg-surface text-text-muted border-border',
                                 )}
                              >
                                 {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col truncate flex-1 min-w-0 gap-0.5">
                                 <span
                                    className={cn(
                                       'text-[15px] font-bold truncate leading-tight transition-colors',
                                       isSelected ? 'text-white' : 'text-text-main',
                                    )}
                                 >
                                    {client.name}
                                 </span>
                                 <div
                                    className={cn(
                                       'flex items-center gap-1.5 text-sm truncate transition-colors',
                                       isSelected ? 'text-primary-text' : 'text-text-dim',
                                    )}
                                 >
                                    <HiOutlineMail size={13} className="shrink-0" />
                                    <span className="truncate">
                                       {client.email || 'Sin correo electrónico'}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-x-4 gap-y-1 text-xs font-medium flex-wrap mt-0.5">
                                    <span
                                       className={cn(
                                          'flex items-center gap-1 transition-colors',
                                          isSelected ? 'text-text-secondary' : 'text-text-muted',
                                       )}
                                    >
                                       <HiOutlineIdentification size={13} /> {client.tax_id}
                                    </span>
                                    {client.city && (
                                       <span
                                          className={cn(
                                             'flex items-center gap-1 transition-colors',
                                             isSelected ? 'text-text-secondary' : 'text-text-muted',
                                          )}
                                       >
                                          <HiOutlineMapPin size={13} /> {client.city}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>
                           {client.account_balance !== 0 && (
                              <div className="flex flex-col items-end gap-1 shrink-0 pl-4 border-l border-border/50">
                                 <span
                                    className={cn(
                                       'text-[10px] uppercase tracking-wider font-bold transition-colors',
                                       isSelected ? 'text-text-secondary' : 'text-text-dim',
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
                                          ? 'text-success-text'
                                          : client.account_balance < 0
                                          ? 'text-danger-text'
                                          : isSelected
                                          ? 'text-text-main'
                                          : 'text-text-dim',
                                    )}
                                 />
                              </div>
                           )}
                        </div>
                     );
                  })}

                  {hasCreateOption && (
                     <div
                        ref={el => {
                           itemsRef.current[results.length] = el;
                        }}
                        onClick={() => {
                           onRequestCreate(searchTerm);
                           onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(results.length)}
                        className={cn(
                           'mt-2 flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all border border-dashed mx-1',
                           selectedIndex === results.length
                              ? 'bg-primary-subtle border-primary/50 text-primary-text'
                              : 'border-border text-text-muted hover:bg-surface-highlight',
                        )}
                     >
                        <div
                           className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                              selectedIndex === results.length
                                 ? 'bg-primary text-white border-primary'
                                 : 'bg-surface text-text-dim border-border',
                           )}
                        >
                           <HiOutlinePlus size={20} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold">Crear nuevo cliente</span>
                           <span className="text-xs opacity-80 truncate max-w-[200px]">
                              Usar nombre: "{searchTerm}"
                           </span>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
                     <div className="w-20 h-20 bg-gradient-to-br from-surface to-surface-highlight rounded-3xl flex items-center justify-center mb-5 border border-border shadow-2xl -rotate-3">
                        <HiOutlineUser size={40} className="text-primary/40" />
                     </div>
                     <h3 className="text-text-secondary font-medium text-lg">
                        Directorio de Clientes
                     </h3>
                     <p className="text-text-muted text-sm mt-1 max-w-[240px]">
                        Busca por nombre, identificación o correo electrónico.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </Modal>
   );
};
