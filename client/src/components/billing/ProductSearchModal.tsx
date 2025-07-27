import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import {
   HiOutlineSearch,
   HiOutlineExclamationCircle,
   HiOutlineCube,
   HiOutlinePlus,
} from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';

// Types
import { type InvoiceItem } from '../../types/billing';

const API_URL = import.meta.env.VITE_API_URL;

type ProductSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectProduct: (product: Partial<InvoiceItem>) => void;
};

const useProductSearch = (isOpen: boolean) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<Partial<InvoiceItem>[]>([]);
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
            const res = await fetch(`${API_URL}/products?search=${encodeURIComponent(searchTerm)}`);
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
   }, [searchTerm, isOpen]);

   return { searchTerm, setSearchTerm, results, isLoading, error };
};

export const ProductSearchModal = ({
   isOpen,
   onClose,
   onSelectProduct,
}: ProductSearchModalProps) => {
   const { searchTerm, setSearchTerm, results, isLoading, error } = useProductSearch(isOpen);
   const [selectedIndex, setSelectedIndex] = useState(0);
   const listRef = useRef<HTMLDivElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
   }, [isOpen]);

   useEffect(() => {
      startTransition(() => setSelectedIndex(0));
      listRef.current?.scrollTo(0, 0);
   }, [results]);

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
         if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
               handleSelect(results[selectedIndex]);
            } else if (searchTerm.trim() !== '') {
               handleSelect({
                  id: '',
                  name: searchTerm,
                  price: 0,
                  stock: 9999,
                  supplier: 'No especificado',
                  discountPercentage: 0,
               });
            }
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
   }, [isOpen, results, selectedIndex, handleSelect, searchTerm]);

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
               placeholder="Buscar productos..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="flex-1 bg-transparent text-xl text-white placeholder:text-zinc-600 outline-none font-medium"
               autoComplete="off"
            />
         </div>

         <div
            ref={listRef}
            className="flex-1 overflow-y-auto custom-scrollbar max-h-[60vh] min-h-[300px] p-2 relative"
         >
            {error ? (
               <div className="h-full flex flex-col items-center justify-center text-red-400 gap-3">
                  <div className="p-4 bg-red-500/10 rounded-full">
                     <HiOutlineExclamationCircle size={32} />
                  </div>
                  <span className="font-medium">{error}</span>
               </div>
            ) : results.length > 0 ? (
               results.map((product, index) => {
                  const isSelected = index === selectedIndex;
                  const discount = product.discountPercentage || 0;
                  const finalPrice =
                     discount > 0
                        ? (product.price || 0) * (1 - discount / 100)
                        : product.price || 0;

                  return (
                     <div
                        key={product.id || index}
                        onClick={() => handleSelect(product)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                           group flex justify-between items-center px-4 py-3 rounded-xl mb-1 cursor-pointer transition-all border
                           ${
                              isSelected
                                 ? 'bg-purple-600/10 border-purple-500/30'
                                 : 'bg-transparent border-transparent hover:bg-zinc-900'
                           }
                        `}
                     >
                        <div className="flex items-center gap-4 overflow-hidden">
                           <div
                              className={`
                              p-2.5 rounded-xl shrink-0 transition-colors
                              ${
                                 isSelected
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-zinc-800 text-zinc-500'
                              }
                           `}
                           >
                              <HiOutlineCube size={20} />
                           </div>
                           <div className="flex flex-col truncate pr-4">
                              <div className="flex items-center gap-2">
                                 <span
                                    className={`text-base font-medium truncate ${
                                       isSelected ? 'text-white' : 'text-zinc-200'
                                    }`}
                                 >
                                    {product.name}
                                 </span>
                                 {discount > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                       -{discount}%
                                    </span>
                                 )}
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                 <span className="text-zinc-500">{product.supplier}</span>
                                 {product.stock && product.stock < 5 && (
                                    <span className="text-amber-500 font-bold">
                                       • Pocas unidades
                                    </span>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-4">
                           <div className="flex items-center gap-2">
                              {discount > 0 && (
                                 <span className="text-xs text-zinc-500 line-through decoration-red-500/50">
                                    ${product.price?.toLocaleString('es-CO')}
                                 </span>
                              )}
                              <span
                                 className={`font-mono font-bold text-lg ${
                                    isSelected ? 'text-purple-200' : 'text-zinc-200'
                                 }`}
                              >
                                 ${finalPrice.toLocaleString('es-CO')}
                              </span>
                           </div>
                           <span
                              className={`text-xs font-medium ${
                                 isSelected ? 'text-purple-300/80' : 'text-zinc-500'
                              }`}
                           >
                              {product.stock} en stock
                           </span>
                        </div>
                     </div>
                  );
               })
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                  {searchTerm ? (
                     <div className="flex flex-col items-center pb-3">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800 shadow-inner">
                           <HiOutlineSearch size={28} className="text-zinc-600" />
                        </div>
                        <h3 className="text-zinc-300 font-bold text-lg mb-1">
                           No encontramos "{searchTerm}"
                        </h3>
                        <p className="text-zinc-500 text-sm mb-6 max-w-[250px]">
                           El producto no está en el inventario, pero puedes agregarlo ahora.
                        </p>

                        <button
                           onClick={() =>
                              handleSelect({
                                 id: '',
                                 name: searchTerm,
                                 price: 0,
                                 stock: 9999,
                                 supplier: 'No especificado',
                                 discountPercentage: 0,
                              })
                           }
                           className="flex items-center gap-3 px-5 py-2.5 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-300 transition-all group cursor-pointer"
                        >
                           <span className="bg-purple-500 text-white rounded p-0.5">
                              <HiOutlinePlus size={14} />
                           </span>
                           <span className="font-medium text-sm">Agregar Manualmente</span>
                           <kbd className="hidden sm:inline text-[10px] font-sans bg-purple-900/40 px-2 py-0.5 rounded border border-purple-500/20 text-purple-200 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                              Enter
                           </kbd>
                        </button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-500 pt-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center mb-5 border border-zinc-800 shadow-xl rotate-3">
                           <HiOutlineCube size={40} className="text-purple-500/80" />
                        </div>
                        <h3 className="text-zinc-400 font-medium text-lg">Inventario</h3>
                        <p className="text-zinc-600 text-sm mt-1">
                           Busca por nombre, referencia o código
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>
      </Modal>
   );
};
