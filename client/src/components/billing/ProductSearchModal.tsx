import { useState, useEffect, useRef, useCallback } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { type InvoiceItem } from '../../types/billing';
import { Modal } from '../ui/Modal';

const dummyResults: Partial<InvoiceItem>[] = [
   { id: '1', name: 'Teclado Mecánico Kumara K552', stock: 15, price: 180000, supplier: 'Kumara' },
   { id: '2', name: 'Mouse Logitech G203', stock: 22, price: 95000, supplier: 'Logitech' },
   { id: '3', name: 'Monitor Gamer 24" 144Hz', stock: 8, price: 850000, supplier: 'Samsung' },
   { id: '4', name: 'Diadema HyperX Cloud Stinger', stock: 5, price: 220000, supplier: 'HyperX' },
   { id: '5', name: 'Silla Gamer Ergonomica', stock: 2, price: 120000, supplier: 'Genérico' },
];

type ProductSearchModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onSelectProduct: (product: Partial<InvoiceItem>) => void;
};

export const ProductSearchModal = ({
   isOpen,
   onClose,
   onSelectProduct,
}: ProductSearchModalProps) => {
   const [selectedIndex, setSelectedIndex] = useState(0);

   const [searchTerm, setSearchTerm] = useState('');
   const listRef = useRef<HTMLDivElement>(null);

   const results = dummyResults.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   const handleSelect = useCallback(
      (product: Partial<InvoiceItem>) => {
         onSelectProduct(product);
         onClose();
      },
      [onSelectProduct, onClose],
   );

   useEffect(() => {
      const id = window.setTimeout(() => setSelectedIndex(0), 0);
      return () => clearTimeout(id);
   }, [searchTerm]);

   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
         } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
               handleSelect(results[selectedIndex]);
            } else if (searchTerm.trim() !== '') {
               handleSelect({ name: searchTerm, price: 0, stock: 1 });
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selectedIndex, results, handleSelect, searchTerm, isOpen]);

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-xl p-0 overflow-hidden">
         <div className="flex flex-col gap-y-2 w-full">
            <div className="relative px-4 pt-4">
               <HiOutlineSearch
                  size={22}
                  className="absolute top-1/2 -translate-y-1 left-7 text-zinc-400"
               />
               <input
                  type="text"
                  placeholder="Buscar producto..."
                  autoFocus
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="
                     w-full bg-zinc-800 focus:bg-zinc-800 text-lg text-white rounded-full
                     mb-1 pl-10 py-2
                     border-2 border-zinc-600 focus:border-purple-800
                     outline-none
                  "
               />
            </div>

            <div className="h-[1px] bg-zinc-800 w-full" />

            <div
               ref={listRef}
               className="flex flex-col pb-2 max-h-[400px] h-fit m-2 overflow-y-auto custom-scrollbar"
            >
               {results.length > 0 ? (
                  results.map((product, index) => {
                     const isSelected = index === selectedIndex;
                     return (
                        <div
                           key={product.id}
                           onMouseEnter={() => setSelectedIndex(index)}
                           onClick={() => handleSelect(product)}
                           className={`
                                        mx-2 flex justify-between items-center px-4 pt-1 pb-2 rounded-2xl my-1
                                        cursor-pointer transition-all duration-150
                                        ${
                                           isSelected
                                              ? 'bg-purple-800 text-white'
                                              : 'hover:bg-zinc-800 text-zinc-200'
                                        }
                                    `}
                        >
                           <div className="flex flex-col">
                              <span className="font-medium text-base">{product.name}</span>
                              <span
                                 className={`text-xs font-medium ${
                                    isSelected ? 'text-white' : 'text-zinc-400'
                                 }`}
                              >
                                 {product.supplier}
                              </span>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="font-medium text-md">
                                 ${product.price?.toLocaleString('es-CO')}
                              </span>
                              <span
                                 className={`text-xs font-medium ${
                                    isSelected ? 'text-white' : 'text-zinc-400'
                                 }`}
                              >
                                 {product.stock} disponibles
                              </span>
                           </div>
                        </div>
                     );
                  })
               ) : (
                  <div className="px-6 pb-2 text-zinc-500 text-center">
                     <p>No se encontraron resultados.</p>
                     <p className="text-xs mt-1 text-zinc-600">
                        Presiona <kbd className="font-sans bg-zinc-800 px-1 rounded">Enter</kbd>{' '}
                        para agregar como ítem temporal.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </Modal>
   );
};
