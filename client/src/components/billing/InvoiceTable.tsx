import { HiOutlineTrash } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';
import { useState, useEffect, useRef } from 'react';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[minmax(6rem,1fr)_6rem_6rem_5rem_2rem] gap-3 items-center px-1';

// ... (El componente InvoiceItemRow se mantiene igual, lo omito por brevedad) ...
const InvoiceItemRow = ({ item, onUpdate, onRemove }: InvoiceItemRowProps) => {
   const originalValues = useRef({
      name: item.name,
      price: item.price,
   });

   const isNameModified = item.name !== originalValues.current.name;
   const isPriceModified = item.price !== originalValues.current.price;

   const [localPrice, setLocalPrice] = useState(item.price.toLocaleString('es-CO'));

   useEffect(() => {
      const currentNumeric = parseInt(localPrice.replace(/\./g, '') || '0', 10);
      if (currentNumeric !== item.price) {
         setLocalPrice(item.price.toLocaleString('es-CO'));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [item.price]);

   const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setLocalPrice(rawValue);
      const numericValue = parseInt(rawValue.replace(/[^0-9]/g, '') || '0', 10);
      onUpdate(item.id, { price: numericValue });
   };

   const handleBlur = () => {
      const numericValue = parseInt(localPrice.replace(/[^0-9]/g, '') || '0', 10);
      setLocalPrice(numericValue.toLocaleString('es-CO'));
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
         e.currentTarget.blur();
      }
   };

   return (
      <div
         className={`${GRID_LAYOUT} bg-zinc-700/30 hover:bg-zinc-700/50 py-1.5 transition-colors duration-200 border border-transparent hover:border-zinc-700 pl-2`}
      >
         <div className="w-full">
            <input
               type="text"
               value={item.name}
               onChange={e => onUpdate(item.id, { name: e.target.value })}
               title={item.name}
               className={`
                  w-full bg-transparent rounded-lg cursor-default focus:cursor-text pl-3 py-1
                  hover:ring-1 hover:ring-zinc-600 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none text-ellipsis transition-colors duration-200
                  ${isNameModified ? 'text-amber-400 italic' : 'text-zinc-200 font-medium'}
               `}
            />
         </div>

         <div className="w-full">
            <input
               type="text"
               value={localPrice}
               onChange={handlePriceChange}
               onBlur={handleBlur}
               onKeyDown={handleKeyDown}
               className={`
                  w-full bg-transparent text-right rounded-xl cursor-default focus:cursor-text pr-2 py-1
                  hover:ring-1 hover:ring-zinc-600 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none no-spinners transition-colors duration-200
                  ${isPriceModified ? 'text-amber-400 italic' : 'text-zinc-200 font-medium'}
               `}
            />
         </div>

         <div className="flex justify-center">
            <QuantitySelector
               value={item.quantity}
               stock={item.stock}
               onIncrease={() =>
                  onUpdate(item.id, { quantity: Math.min(item.quantity + 1, item.stock) })
               }
               onDecrease={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
               onQuantityChange={qty => onUpdate(item.id, { quantity: qty > 0 ? qty : 1 })}
            />
         </div>

         <div className="font-semibold text-right text-zinc-200">
            <span>{(item.quantity * item.price).toLocaleString('es-CO')}</span>
         </div>

         <div className="flex justify-end">
            <button
               onClick={() => onRemove(item.id)}
               className="text-zinc-500 p-1 rounded-full hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200 cursor-pointer"
            >
               <HiOutlineTrash size={18} />
            </button>
         </div>
      </div>
   );
};

type InvoiceTableProps = {
   items: InvoiceItem[];
   onUpdateItem: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemoveItem: (id: string) => void;
};

export const InvoiceTable = ({ items, onUpdateItem, onRemoveItem }: InvoiceTableProps) => {
   return (
      // Cambio: bg-zinc-900 (antes 800) para coincidir con Sidebar. Eliminado borde inferior fijo para limpieza.
      <div className="flex flex-col h-full overflow-hidden bg-zinc-900">
         <div
            className={`${GRID_LAYOUT} text-zinc-500 font-bold text-[11px] pb-3 p-4 uppercase tracking-wider`}
         >
            <div className="text-left pl-4">Producto</div>
            <div className="text-right pr-2">Valor</div>
            <div className="text-center">Cantidad</div>
            <div className="text-right">Total</div>
            <div></div>
         </div>

         <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="flex flex-col gap-y-1 min-h-full">
               {items.map(item => (
                  <InvoiceItemRow
                     key={item.id}
                     item={item}
                     onUpdate={onUpdateItem}
                     onRemove={onRemoveItem}
                  />
               ))}

               {items.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 h-full animate-in fade-in duration-500">
                     <span className="text-sm bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-800">
                        Presiona{' '}
                        <kbd className="font-sans font-bold text-zinc-300 bg-zinc-700 px-2 py-0.5 rounded border border-zinc-600 shadow-sm mx-1">
                           ESPACIO
                        </kbd>{' '}
                        para buscar productos
                     </span>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
