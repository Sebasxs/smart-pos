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
      <div className={`${GRID_LAYOUT} rounded-xl hover:bg-zinc-700 bg-zinc-700 py-1`}>
         <div className="w-full">
            <input
               type="text"
               value={item.name}
               onChange={e => onUpdate(item.id, { name: e.target.value })}
               title={item.name}
               className={`
                  w-full bg-transparent rounded-xl cursor-pointer focus:cursor-text pl-2 py-1
                  hover:ring-1 hover:ring-zinc-600 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none text-ellipsis transition-colors duration-200
                  ${isNameModified ? 'text-amber-400 italic' : 'text-zinc-100 font-semibold'}
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
                  w-full bg-transparent text-right rounded-xl cursor-pointer focus:cursor-text pr-2 py-1
                  hover:ring-1 hover:ring-zinc-600 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none no-spinners transition-colors duration-200
                  ${isPriceModified ? 'text-amber-400 italic' : 'text-zinc-100 font-semibold'}
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

         <div className="font-semibold text-right">
            <span>{(item.quantity * item.price).toLocaleString('es-CO')}</span>
         </div>

         <div className="flex justify-end">
            <button
               onClick={() => onRemove(item.id)}
               className="text-red-500 p-1 rounded-full hover:text-zinc-800 hover:bg-red-600/60 transition-colors duration-200 cursor-pointer"
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
      <div className="bg-zinc-800 p-4 rounded-lg flex flex-col h-full overflow-hidden">
         <div className="overflow-x-auto flex-1 custom-scrollbar">
            <div
               className={`${GRID_LAYOUT} pl-3 text-zinc-400 font-bold text-sm border-b-2 border-zinc-700 pb-2 mb-2`}
            >
               <div>Producto</div>
               <div className="text-right pr-2">Valor</div>
               <div className="text-center">Cantidad</div>
               <div className="text-right">Total</div>
               <div></div>
            </div>

            <div className="flex flex-col gap-y-1">
               {items.map(item => (
                  <InvoiceItemRow
                     key={item.id}
                     item={item}
                     onUpdate={onUpdateItem}
                     onRemove={onRemoveItem}
                  />
               ))}
               {items.length === 0 && (
                  <div className="text-center py-10 text-zinc-500 italic">
                     No hay productos. Presiona ESPACIO para buscar.
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
