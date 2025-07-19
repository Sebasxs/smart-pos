import { HiOutlineTrash, HiOutlinePencilSquare, HiOutlineTag } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';
import { useState, useEffect } from 'react';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[1fr_7rem_8rem_6rem_1.5rem] gap-6 items-center';

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

   const hasInventoryDiscount = item.discountPercentage > 0;
   const isModified = item.isManualPrice || item.isManualName;

   return (
      <div
         className={`
            ${GRID_LAYOUT} 
            group relative px-3 py-2 mb-2 rounded-xl transition-all duration-200 mx-2
            ${
               isModified
                  ? 'bg-indigo-900/10 hover:bg-indigo-900/20 border border-indigo-500/20'
                  : hasInventoryDiscount
                  ? 'bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/20'
                  : 'bg-zinc-800/50 hover:bg-zinc-800 border border-transparent'
            }
         `}
      >
         {/* Indicador lateral de color */}
         <div
            className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)] ${
               isModified
                  ? 'bg-indigo-500'
                  : hasInventoryDiscount
                  ? 'bg-emerald-500'
                  : 'bg-zinc-600'
            }`}
         />

         {/* 1. PRODUCTO */}
         <div className="flex flex-col min-w-0 pr-2 pl-3">
            <div className="flex items-center w-full">
               <input
                  type="text"
                  value={item.name}
                  onChange={e => onUpdate(item.id, { name: e.target.value })}
                  className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 pb-0.5 outline-none truncate transition-colors duration-200 font-bold text-[15px] tracking-tight placeholder:text-zinc-600 text-zinc-100"
               />
            </div>

            <div className={`flex items-center gap-2 mt-1`}>
               <span
                  className="text-[12px] font-medium truncate text-zinc-500"
                  title={`Proveedor: ${item.supplier}`}
               >
                  {item.supplier}
               </span>

               {/* CAMBIO: Icono de edición ahora aquí */}
               {isModified && (
                  <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 leading-none">
                     <HiOutlinePencilSquare size={11} />
                     <span>Editado</span>
                  </div>
               )}

               {hasInventoryDiscount && (
                  <div className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 leading-none">
                     <HiOutlineTag size={10} />
                     <span>-{item.discountPercentage}%</span>
                  </div>
               )}
            </div>
         </div>

         {/* 2. VALOR UNITARIO */}
         <div className="flex flex-col justify-center items-end w-full pr-2">
            {hasInventoryDiscount && !item.isManualPrice && (
               <div className="text-[10px] text-zinc-500 line-through decoration-zinc-600 mb-0.5 font-mono text-right w-full">
                  ${item.originalPrice.toLocaleString('es-CO')}
               </div>
            )}

            <div className="relative w-full flex items-center justify-end group/price">
               <span className="absolute left-auto right-full mr-1 text-xs font-medium pointer-events-none transition-opacity duration-200 opacity-0 group-focus-within/price:opacity-100 text-zinc-600">
                  $
               </span>
               <input
                  type="text"
                  value={localPrice}
                  onChange={handlePriceChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-right py-1 border-b border-transparent focus:border-indigo-500 outline-none font-mono font-medium text-[15px] tracking-tight transition-colors duration-200 text-zinc-300"
               />
            </div>
         </div>

         {/* 3. CANTIDAD */}
         <div className="flex justify-center w-full">
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

         {/* 4. SUBTOTAL */}
         <div className="flex flex-col items-end w-full pr-2">
            <span className="font-bold text-white tracking-tight text-[17px] font-mono tabular-nums">
               ${(item.quantity * item.price).toLocaleString('es-CO')}
            </span>
         </div>

         {/* 5. ACCIONES */}
         <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
               onClick={() => onRemove(item.id)}
               className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
               title="Eliminar producto"
            >
               <HiOutlineTrash size={18} />
            </button>
         </div>
      </div>
   );
};

export type InvoiceTableProps = {
   items: InvoiceItem[];
   onUpdateItem: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemoveItem: (id: string) => void;
};

export const InvoiceTable = ({ items, onUpdateItem, onRemoveItem }: InvoiceTableProps) => {
   return (
      <div className="flex flex-col h-full bg-transparent overflow-x-auto overflow-y-hidden rounded-xl custom-scrollbar">
         <div className="min-w-[800px] flex flex-col h-full">
            <div
               className={`${GRID_LAYOUT} py-3 px-4 mb-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800/50 shrink-0 select-none`}
            >
               <div>Producto</div>
               <div className="text-right pr-3">Valor Und.</div>
               <div className="text-center pr-3">Cantidad</div>
               <div className="text-right pr-3">Subtotal</div>
               <div></div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar px-1 pt-2">
               {items.map(item => (
                  <InvoiceItemRow
                     key={item.id}
                     item={item}
                     onUpdate={onUpdateItem}
                     onRemove={onRemoveItem}
                  />
               ))}

               {items.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 animate-in fade-in duration-500">
                     <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-20" />
                        <div className="relative bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-4 shadow-xl">
                           <HiOutlinePencilSquare size={32} className="text-zinc-500" />
                        </div>
                     </div>
                     <p className="text-zinc-300 font-bold mb-1 text-lg">Factura Nueva</p>
                     <p className="text-zinc-500 text-sm mb-6">
                        Busca un producto o agrégalo manualmente
                     </p>
                     <span className="text-xs bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 text-zinc-500 shadow-sm">
                        Presiona{' '}
                        <kbd className="font-bold text-zinc-300 font-sans mx-1">ESPACIO</kbd> para
                        buscar
                     </span>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
