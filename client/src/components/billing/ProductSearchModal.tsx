import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
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

// Types
import { type InvoiceItem } from '../../types/billing';

const API_URL = import.meta.env.VITE_API_URL;

type ProductSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectProduct: (product: Partial<InvoiceItem>) => void;
};

// Hook de búsqueda (Intacto)
const useProductSearch = (isOpen: boolean) => {
   const { token } = useAuthStore();
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<Partial<InvoiceItem & { sku?: string }>[]>([]);
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
               `${API_URL}/api/products?search=${encodeURIComponent(searchTerm)}`,
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

export const ProductSearchModal = ({
   isOpen,
   onClose,
   onSelectProduct,
}: ProductSearchModalProps) => {
   const { searchTerm, setSearchTerm, results, isLoading, error } = useProductSearch(isOpen);
   const [selectedIndex, setSelectedIndex] = useState(0);

   const listRef = useRef<HTMLDivElement>(null); // Contenedor con scroll
   const itemsRef = useRef<(HTMLDivElement | null)[]>([]); // Referencias a cada item
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

   // Lógica de Scroll Automático mejorada (Persigue al elemento)
   useEffect(() => {
      if (isOpen && results.length > 0) {
         const currentItem = itemsRef.current[selectedIndex];
         if (currentItem) {
            currentItem.scrollIntoView({
               block: 'nearest', // Se asegura que entre en visión (arriba o abajo)
               behavior: 'smooth', // Desplazamiento suave
            });
         }
      }
   }, [selectedIndex, isOpen, results.length]);

   const handleSelect = useCallback(
      (product: Partial<InvoiceItem>) => {
         onSelectProduct({ ...product, originalPrice: product.price });
         onClose();
      },
      [onSelectProduct, onClose],
   );

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         const total = results.length;

         if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % total);
         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + total) % total);
         } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
               handleSelect(results[selectedIndex]);
            } else if (searchTerm.trim() !== '') {
               handleSelect({
                  id: '',
                  description: searchTerm,
                  price: 0,
                  stock: 9999,
                  discountPercentage: 0,
               });
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, results, selectedIndex, handleSelect, searchTerm]);

   // Helper de estado simplificado
   const getStockStatus = (stock: number = 0) => {
      if (stock <= 0) {
         return {
            label: 'Agotado',
            classes: 'bg-red-500/10 text-red-400 border-red-500/20',
            icon: <HiOutlineXCircle className="w-3 h-3" />,
         };
      }
      if (stock <= 3) {
         return {
            label: 'Stock Bajo',
            classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            icon: <HiOutlineExclamationCircle className="w-3 h-3" />,
         };
      }
      return {
         label: 'Disponible',
         classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
         icon: <HiOutlineCheckCircle className="w-3 h-3" />,
      };
   };

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
                  <CgSpinner className="animate-spin" size={22} />
               ) : (
                  <HiOutlineSearch size={22} />
               )}
            </div>
            <input
               ref={inputRef}
               type="text"
               placeholder="Buscar productos..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="flex-1 bg-transparent text-lg text-white placeholder:text-zinc-600 outline-none font-medium"
               autoComplete="off"
            />
            <div className="hidden sm:flex gap-2 text-[10px] font-mono text-zinc-600 uppercase tracking-wide">
               <span className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                  <kbd>↑</kbd> <kbd>↓</kbd> Navegar
               </span>
               <span className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                  <kbd>↵</kbd> Seleccionar
               </span>
            </div>
         </div>

         {/* RESULTADOS */}
         <div ref={listRef} className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
            {error ? (
               <div className="h-full flex flex-col items-center justify-center text-red-400 gap-3">
                  <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                     <HiOutlineExclamationCircle size={32} />
                  </div>
                  <span className="font-medium text-sm">{error}</span>
               </div>
            ) : results.length > 0 ? (
               <div className="flex flex-col gap-1.5">
                  {results.map((product: any, index) => {
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
                           className={`
                              group relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all border
                              ${
                                 isSelected
                                    ? 'bg-zinc-900 border-purple-500/50 shadow-lg shadow-purple-900/10 z-10'
                                    : 'bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'
                              }
                           `}
                        >
                           {/* Highlight lateral púrpura */}
                           {isSelected && (
                              <div className="absolute left-0 top-3 bottom-3 w-1 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                           )}

                           {/* IZQUIERDA: Icono + Info */}
                           <div className="flex items-center gap-4 overflow-hidden flex-1">
                              {/* Icono */}
                              <div
                                 className={`
                                    w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                                    ${
                                       isSelected
                                          ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30 scale-105'
                                          : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                                    }
                                 `}
                              >
                                 <HiOutlineCube size={20} />
                              </div>

                              <div className="flex flex-col truncate pr-4 gap-1">
                                 {/* Nombre + Descuento */}
                                 <div className="flex items-center gap-2">
                                    <span
                                       className={`text-[15px] font-semibold truncate leading-tight ${
                                          isSelected ? 'text-white' : 'text-zinc-200'
                                       }`}
                                    >
                                       {product.description}
                                    </span>
                                    {discount > 0 && (
                                       <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-500/10 text-green-400 border border-green-500/20 leading-none shrink-0">
                                          <HiOutlineTag size={10} /> -{discount}%
                                       </span>
                                    )}
                                 </div>

                                 {/* BADGE DE ESTADO (Texto limpio, sin números) */}
                                 <div className="flex">
                                    <span
                                       className={`
                                          flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide uppercase
                                          ${stockStatus.classes}
                                       `}
                                    >
                                       {stockStatus.icon}
                                       {stockStatus.label}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           {/* DERECHA: Precio + Stock Numérico */}
                           <div className="flex flex-col items-end gap-0.5 shrink-0 pl-4">
                              {/* Precio Original si hay descuento */}
                              {discount > 0 && (
                                 <span className="text-[10px] text-zinc-500 line-through decoration-zinc-600">
                                    <SmartNumber
                                       value={product.price}
                                       variant="currency"
                                       showPrefix={true}
                                    />
                                 </span>
                              )}

                              {/* Precio Final */}
                              <SmartNumber
                                 value={finalPrice}
                                 variant="currency"
                                 showPrefix={true}
                                 className={`font-mono font-bold text-lg tracking-tight leading-none ${
                                    isSelected ? 'text-purple-300' : 'text-zinc-200'
                                 }`}
                              />

                              {/* STOCK REAL (Número sutil) */}
                              <span
                                 className={`
                                    text-[11px] font-mono mt-1
                                    ${
                                       product.stock <= 0
                                          ? 'text-red-400 font-medium'
                                          : 'text-zinc-500'
                                    }
                                 `}
                              >
                                 Stock: {product.stock}
                              </span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            ) : (
               /* EMPTY STATE */
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  {searchTerm ? (
                     <div className="flex flex-col items-center pb-3 max-w-[280px]">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800 shadow-inner">
                           <HiOutlineSearch size={28} className="text-zinc-600" />
                        </div>
                        <h3 className="text-zinc-300 font-bold text-lg mb-2">
                           No encontramos "{searchTerm}"
                        </h3>
                        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                           El producto no está en inventario. ¿Deseas agregarlo como ítem manual?
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
                           className="flex items-center gap-3 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-200 transition-all group w-full justify-center shadow-lg cursor-pointer"
                        >
                           <span className="bg-purple-600 text-white rounded p-0.5">
                              <HiOutlinePlus size={14} />
                           </span>
                           <span className="font-medium text-sm">Agregar Manualmente</span>
                        </button>
                        <div className="mt-3 text-[10px] text-zinc-600">
                           O presiona <kbd className="font-sans font-bold text-zinc-500">Enter</kbd>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center opacity-40 hover:opacity-80 transition-opacity duration-500 pt-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center mb-5 border border-zinc-800 shadow-2xl rotate-3">
                           <HiOutlineCube size={40} className="text-purple-500/50" />
                        </div>
                        <h3 className="text-zinc-400 font-medium text-lg">Catálogo de Productos</h3>
                        <p className="text-zinc-600 text-sm mt-1 max-w-[200px]">
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
