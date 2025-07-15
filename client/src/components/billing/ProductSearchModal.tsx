import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { HiOutlineSearch, HiOutlineExclamationCircle } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';
import { Modal } from '../ui/Modal';
import { type InvoiceItem } from '../../types/billing';

const API_URL = import.meta.env.VITE_API_URL;

type ProductSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectProduct: (product: Partial<InvoiceItem>) => void;
};

const useProductSearch = (isOpen: boolean) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [results, setResults] = useState<Partial<InvoiceItem>[]>([]); // Usamos el tipo RAW de DB
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
            if (!res.ok) throw new Error('Error al buscar productos');
            const data = await res.json();
            setResults(data);
         } catch (err) {
            console.error(err);
            setError('Error al buscar productos');
            setResults([]);
         } finally {
            setIsLoading(false);
         }
      }, 300);

      return () => clearTimeout(timeoutId);
   }, [searchTerm, isOpen]);

   return { searchTerm, setSearchTerm, results, isLoading, error };
};

const useKeyboardNavigation = (
   isOpen: boolean,
   results: Partial<InvoiceItem>[],
   onSelect: (p: Partial<InvoiceItem>) => void,
   searchTerm: string,
) => {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const listRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      startTransition(() => {
         setSelectedIndex(0);
      });
      listRef.current?.scrollTo(0, 0);
   }, [results]);

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
               onSelect(results[selectedIndex]);
            } else if (searchTerm.trim() !== '') {
               onSelect({
                  id: '',
                  name: searchTerm,
                  price: 0,
                  stock: 9999,
                  supplier: 'Genérico',
                  discountPercentage: 0,
               });
            }
            return;
         }

         if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => {
               const nextIndex =
                  e.key === 'ArrowDown'
                     ? (prev + 1) % results.length
                     : (prev - 1 + results.length) % results.length;

               listRef.current?.children[nextIndex]?.scrollIntoView({ block: 'nearest' });
               return nextIndex;
            });
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, results, selectedIndex, onSelect, searchTerm]);

   return { selectedIndex, setSelectedIndex, listRef };
};

const ProductItem = ({
   product,
   isSelected,
   onClick,
   onHover,
}: {
   product: Partial<InvoiceItem>;
   isSelected: boolean;
   onClick: () => void;
   onHover: () => void;
}) => {
   const originalPrice = product.price || 0;
   const discount = product.discountPercentage || 0;
   const hasDiscount = discount > 0;
   const finalPrice = hasDiscount
      ? Math.round(originalPrice * (1 - discount / 100))
      : originalPrice;

   return (
      <div
         onMouseEnter={onHover}
         onClick={onClick}
         className={`
                mx-2 flex justify-between items-center px-4 py-2 rounded-xl my-1
                cursor-pointer transition-all duration-50 border border-transparent
                ${
                   isSelected
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 scale-[1.02]'
                      : 'hover:bg-zinc-800 text-zinc-200 border-zinc-800/50'
                }
            `}
      >
         <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm">{product.name}</span>
            <div className="flex items-center gap-2">
               <span
                  className={`text-xs font-medium ${
                     isSelected ? 'text-indigo-200' : 'text-zinc-500'
                  }`}
               >
                  {product.supplier}
               </span>
               {hasDiscount && (
                  <span
                     className={`text-[10px] px-1.5 rounded-md font-bold border ${
                        isSelected
                           ? 'bg-white/20 text-white border-white/30'
                           : 'bg-green-500/10 text-green-400 border-green-500/20'
                     }`}
                  >
                     -{discount}%
                  </span>
               )}
            </div>
         </div>

         <div className="flex flex-col items-end">
            {hasDiscount ? (
               <>
                  <span
                     className={`text-xs line-through ${
                        isSelected ? 'text-indigo-300' : 'text-zinc-500'
                     }`}
                  >
                     ${originalPrice.toLocaleString('es-CO')}
                  </span>
                  <span className="font-bold text-sm tracking-tight">
                     ${finalPrice.toLocaleString('es-CO')}
                  </span>
               </>
            ) : (
               <span className="font-bold text-sm tracking-tight">
                  ${originalPrice.toLocaleString('es-CO')}
               </span>
            )}
            <span
               className={`text-[10px] font-medium mt-0.5 ${
                  isSelected ? 'text-indigo-200' : 'text-zinc-500'
               }`}
            >
               {product.stock} disponibles
            </span>
         </div>
      </div>
   );
};

export const ProductSearchModal = ({
   isOpen,
   onClose,
   onSelectProduct,
}: ProductSearchModalProps) => {
   const { searchTerm, setSearchTerm, results, isLoading, error } = useProductSearch(isOpen);

   const handleSelect = useCallback(
      (product: Partial<InvoiceItem>) => {
         // Mapeo ligero solo para asegurar que el Store reciba price como originalPrice
         onSelectProduct({
            ...product,
            originalPrice: product.price, // El RPC devuelve el precio lista en 'price'
         });
         onClose();
      },
      [onSelectProduct, onClose],
   );
   const { selectedIndex, setSelectedIndex, listRef } = useKeyboardNavigation(
      isOpen,
      results,
      handleSelect,
      searchTerm,
   );

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
                  placeholder="Buscar producto..."
                  autoFocus
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 text-lg text-white rounded-full mb-1 pl-11 py-2 border-2 border-zinc-600 focus:border-indigo-500 outline-none transition-colors duration-300"
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
                  results.map((product, index) => (
                     <ProductItem
                        key={product.id || index}
                        product={product}
                        isSelected={index === selectedIndex}
                        onClick={() => handleSelect(product)}
                        onHover={() => setSelectedIndex(index)}
                     />
                  ))
               ) : (
                  <div className="px-6 py-8 text-zinc-500 text-center flex flex-col items-center gap-2">
                     {searchTerm ? (
                        <>
                           <p>No se encontraron productos.</p>
                           <p className="text-sm mt-1 text-zinc-600 bg-zinc-800/50 px-3 py-1 rounded-full">
                              Presiona{' '}
                              <kbd className="font-sans font-bold text-zinc-400">Enter</kbd> para
                              agregar{' '}
                              <span className="font-semibold text-zinc-400">"{searchTerm}"</span>{' '}
                              manualmente.
                           </p>
                        </>
                     ) : (
                        <p className="text-md">Escribe para buscar en el inventario...</p>
                     )}
                  </div>
               )}
            </div>
         </div>
      </Modal>
   );
};
