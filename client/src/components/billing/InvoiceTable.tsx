import { HiOutlineTrash } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

const InvoiceItemRow = ({ item, onUpdate, onRemove }: InvoiceItemRowProps) => {
   return (
      <div className="grid grid-cols-12 gap-4 gap-x-2 items-center p-1 rounded-xl hover:bg-zinc-700">
         <div className="col-span-5 pl-1">
            <input
               type="text"
               value={item.name}
               onChange={e => onUpdate(item.id, { name: e.target.value })}
               className="
                  w-full bg-transparent rounded-lg p-1
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800 pl-2
                  outline-none
               "
            />
         </div>
         <div className="col-span-2">
            <input
               type="text"
               value={item.price.toLocaleString('es-CO')}
               onChange={e => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  onUpdate(item.id, { price: Number(rawValue) });
               }}
               onFocus={e => e.target.select()}
               className="
                  w-full bg-transparent font-semibold text-center rounded-lg p-1
                  hover:ring-1 hover:ring-zinc-500 hover:bg-zinc-800
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-zinc-800
                  outline-none
                  no-spinners
               "
            />
         </div>
         <div className="col-span-2 flex justify-center">
            <QuantitySelector
               value={item.quantity}
               onIncrease={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
               onDecrease={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
               onQuantityChange={newQuantity => {
                  const finalQuantity = newQuantity > 0 ? newQuantity : 1;
                  onUpdate(item.id, { quantity: finalQuantity });
               }}
            />
         </div>
         <div className="col-span-2 font-semibold text-center">
            <span>{(item.quantity * item.price).toLocaleString('es-CO')}</span>
         </div>
         <div className="col-span-1 flex justify-end">
            <button
               onClick={() => onRemove(item.id)}
               className="
                  text-red-500 rounded-full p-2
                  hover:text-red-400 hover:bg-red-900/60 transition-colors duration-200
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
      <div className="bg-zinc-800 p-4 pl-3 rounded-lg">
         <div className="grid grid-cols-12 gap-4 text-left text-zinc-400 font-bold text-sm border-b-2 border-zinc-700 pb-2 mb-2">
            <div className="col-span-5 pl-4">Producto</div>
            <div className="col-span-2 text-center">Valor</div>
            <div className="col-span-2 text-center">Cantidad</div>
            <div className="col-span-2 text-center pr-1">Total</div>
            <div className="col-span-1"></div>
         </div>

         <div className="flex flex-col">
            {items.map(item => (
               <InvoiceItemRow
                  key={item.id}
                  item={item}
                  onUpdate={onUpdateItem}
                  onRemove={onRemoveItem}
               />
            ))}
         </div>
      </div>
   );
};
