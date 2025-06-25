import { HiOutlineTrash } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';
import { useState, useEffect } from 'react';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

const InvoiceItemRow = ({ item, onUpdate, onRemove }: InvoiceItemRowProps) => {
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
      <div className="flex items-center gap-2 p-1 rounded-xl hover:bg-zinc-700 min-w-[300px]">
         <div className="flex-1 min-w-24">
            <input
               type="text"
               value={item.name}
               onChange={e => onUpdate(item.id, { name: e.target.value })}
               className="
                  w-full bg-transparent rounded-lg
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none text-ellipsis
               "
            />
         </div>
         <div className="w-22 shrink-0 mr-4">
            <input
               type="text"
               value={localPrice}
               onChange={handlePriceChange}
               onBlur={handleBlur}
               onKeyDown={handleKeyDown}
               onFocus={e => e.target.select()}
               className="
                  w-full bg-transparent text-right font-semibold rounded-lg
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none no-spinners
               "
            />
         </div>
         <div className="w-20 flex justify-center shrink-0">
            <QuantitySelector
               value={item.quantity}
               stock={item.stock}
               onIncrease={() =>
                  onUpdate(item.id, { quantity: Math.min(item.quantity + 1, item.stock) })
               }
               onDecrease={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
               onQuantityChange={newQuantity => {
                  const finalQuantity = newQuantity > 0 ? newQuantity : 1;
                  onUpdate(item.id, { quantity: finalQuantity });
               }}
            />
         </div>
         <div className="w-22 font-semibold text-right shrink-0">
            <span>{(item.quantity * item.price).toLocaleString('es-CO')}</span>
         </div>
         <div className="w-10 flex justify-end shrink-0">
            <button
               onClick={() => onRemove(item.id)}
               className="
                  text-red-500 rounded-full
                  hover:text-red-400 hover:bg-red-900/60
                  transition-colors duration-200
                  cursor-pointer
               "
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
      <div className="bg-zinc-800 p-4 pl-3 rounded-lg flex flex-col h-full overflow-hidden">
         <div className="overflow-x-auto flex-1 custom-scrollbar">
            <div className="flex gap-2 text-left text-zinc-400 font-bold text-sm border-b-2 border-zinc-700 pb-2 mb-2 min-w-[300px]">
               <div className="flex-1 min-w-24">Producto</div>
               <div className="w-22 text-right pr-1 mr-4">Valor</div>
               <div className="w-20 text-center">Cantidad</div>
               <div className="w-22 text-right pr-1">Total</div>
               <div className="w-10"></div>
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
