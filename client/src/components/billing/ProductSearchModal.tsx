import { useState, useEffect, useRef } from 'react';
import {
   HiOutlineSearch,
   HiOutlineExclamationCircle,
   HiOutlineCube,
   HiOutlinePlus,
   HiOutlineTag,
   HiOutlineXCircle,
   HiOutlineCheckCircle,
} from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';
import { SmartNumber } from '../ui/SmartNumber';
import { useAuthStore } from '../../store/authStore';
import { useListNavigation } from '../../hooks/useListNavigation';
import { cn } from '../../utils/cn';

// Types
import { type InvoiceItem } from '../../types/billing';

const API_URL = import.meta.env.VITE_API_URL;

type ProductSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectProduct: (product: Partial<InvoiceItem>) => void;
};

// Helper para badges de estado
const getStockStatus = (stock: number = 0) => {
   if (stock <= 0) {
      return {
         label: 'Agotado',
         classes: 'bg-danger-bg text-danger-text ring-1 ring-danger/20',
         icon: <HiOutlineXCircle className="w-3 h-3" />,
      };
   }
   if (stock <= 3) {
      return {
         label: 'Bajo',
         classes: 'bg-warning-bg text-warning-text ring-1 ring-warning/20',
         icon: <HiOutlineExclamationCircle className="w-3 h-3" />,
      };
   }
   return {
      label: 'Disp.',
      classes: 'bg-success-bg text-success-text ring-1 ring-success/20',
      icon: <HiOutlineCheckCircle className="w-3 h-3" />,
   };
};

export const ProductSearchModal = ({
   isOpen,
   onClose,
   onSelectProduct,
}: ProductSearchModalProps) => {
   const { token } = useAuthStore();
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const inputRef = useRef<HTMLInputElement>(null);

   // Navigation Hook
   const { selectedIndex, setSelectedIndex, listRef, itemsRef, handleKeyDown } = useListNavigation({
      items: results,
      customActionCount: 0,
      onSelect: (product, isCustom) => {
         if (product) {
            handleSelect(product);
         } else if (isCustom || (searchTerm.trim() !== '' && results.length === 0)) {
            // Fallback manual si fuera necesario
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
               `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}`,
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

      const onKeyDown = (e: KeyboardEvent) => {
         // Special case: Enter on empty results -> Manual Add
         if (e.key === 'Enter' && results.length === 0 && searchTerm.trim() !== '') {
            e.preventDefault();
            handleSelect({
               id: '',
               description: searchTerm,
               price: 0,
               stock: 9999,
               discountPercentage: 0,
            });
            return;
         }
         handleKeyDown(e);
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
   }, [isOpen, results, searchTerm, handleKeyDown]);

   const handleSelect = (product: Partial<InvoiceItem>) => {
      onSelectProduct({ ...product, originalPrice: product.price });
      onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         variant="search"
         className="flex flex-col p-0 bg-surface border border-border h-[600px] shadow-2xl shadow-black/80"
      >
         {/* HEADER DE BÚSQUEDA */}
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
                  placeholder="Buscar productos por nombre o código..."
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

         {/* RESULTADOS */}
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
            ) : results.length > 0 ? (
               <div className="flex flex-col gap-1.5 p-1">
                  {results.map((product, index) => {
                     const isSelected = index === selectedIndex;
                     const discount = product.discountPercentage || 0;
                     const finalPrice =
                        discount > 0
                           ? (product.price || 0) * (1 - discount / 100)
                           : product.price || 0;
                     const stockStatus = getStockStatus(product.stock);

                     return (
                        <div
                           key={product.id || index}
                           ref={el => {
                              itemsRef.current[index] = el;
                           }}
                           onClick={() => handleSelect(product)}
                           onMouseEnter={() => setSelectedIndex(index)}
                           className={cn(
                              'group relative flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-150',
                              isSelected
                                 ? 'bg-surface-highlight shadow-md ring-1 ring-border-hover z-10 translate-x-1'
                                 : 'bg-transparent hover:bg-surface-highlight/50 text-text-secondary',
                           )}
                        >
                           {/* Indicador de selección */}
                           <div
                              className={cn(
                                 'absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors',
                                 isSelected
                                    ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                                    : 'bg-transparent',
                              )}
                           />

                           <div className="flex items-center gap-4 overflow-hidden flex-1 pl-2">
                              <div
                                 className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 border shadow-inner',
                                    isSelected
                                       ? 'bg-primary/20 text-primary-text border-primary/30'
                                       : 'bg-surface text-text-dim border-border',
                                 )}
                              >
                                 <HiOutlineCube size={20} />
                              </div>
                              <div className="flex flex-col truncate pr-4 gap-0.5">
                                 <div className="flex items-center gap-2">
                                    <span
                                       className={cn(
                                          'text-[15px] font-semibold truncate leading-tight transition-colors',
                                          isSelected ? 'text-white' : 'text-text-main',
                                       )}
                                    >
                                       {product.description}
                                    </span>
                                    {discount > 0 && (
                                       <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-success-bg text-success-text ring-1 ring-success/20 leading-none shrink-0">
                                          <HiOutlineTag size={10} /> -{discount}%
                                       </span>
                                    )}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <span
                                       className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${stockStatus.classes}`}
                                    >
                                       {stockStatus.icon} {stockStatus.label}: {product.stock}
                                    </span>
                                    {product.sku && (
                                       <span className="text-xs text-text-dim font-mono">
                                          {product.sku}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-col items-end gap-0.5 shrink-0 pl-4">
                              {discount > 0 && (
                                 <span className="text-[10px] text-text-muted line-through decoration-text-dim">
                                    <SmartNumber
                                       value={product.price}
                                       variant="currency"
                                       showPrefix={true}
                                    />
                                 </span>
                              )}
                              <SmartNumber
                                 value={finalPrice}
                                 variant="currency"
                                 showPrefix={true}
                                 className={cn(
                                    'font-mono font-bold text-lg tracking-tight leading-none transition-colors',
                                    isSelected ? 'text-primary-text' : 'text-text-main',
                                 )}
                              />
                           </div>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  {searchTerm ? (
                     <div className="flex flex-col items-center pb-3 max-w-[280px]">
                        <div className="w-16 h-16 bg-surface-highlight rounded-2xl flex items-center justify-center mb-6 border border-border shadow-inner">
                           <HiOutlineSearch size={28} className="text-text-dim" />
                        </div>
                        <h3 className="text-text-main font-bold text-lg mb-2">
                           Sin resultados para "{searchTerm}"
                        </h3>
                        <p className="text-text-muted text-sm mb-6 leading-relaxed">
                           ¿Deseas agregar este ítem como producto manual temporalmente?
                        </p>
                        <button
                           onClick={() =>
                              handleSelect({
                                 id: '',
                                 description: searchTerm,
                                 price: 0,
                                 stock: 9999,
                                 discountPercentage: 0,
                              })
                           }
                           className="flex items-center gap-3 px-5 py-3 bg-surface hover:bg-surface-highlight border border-border hover:border-primary/50 rounded-xl text-text-main transition-all group w-full justify-center shadow-lg cursor-pointer"
                        >
                           <span className="bg-primary text-white rounded p-0.5 shadow-sm">
                              <HiOutlinePlus size={14} />
                           </span>
                           <span className="font-medium text-sm">Agregar Manualmente</span>
                        </button>
                        <div className="mt-4 text-[10px] text-text-dim">
                           o presiona{' '}
                           <kbd className="font-sans font-bold text-text-muted pl-0.5 bg-surface-highlight px-1 rounded border border-border">
                              ENTER
                           </kbd>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-500 pt-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-surface to-surface-highlight rounded-3xl flex items-center justify-center mb-5 border border-border shadow-2xl rotate-3">
                           <HiOutlineCube size={40} className="text-primary/40" />
                        </div>
                        <h3 className="text-text-secondary font-medium text-lg">
                           Catálogo de Productos
                        </h3>
                        <p className="text-text-muted text-sm mt-1 max-w-[200px]">
                           Escribe para buscar por nombre o código.
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </Modal>
   );
};
