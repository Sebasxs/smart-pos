import { HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';
import { useState, useEffect } from 'react';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

// Ajusté ligeramente el grid para dar espacio vertical si es necesario
const GRID_LAYOUT = 'grid grid-cols-[1fr_7rem_8rem_6rem_2.5rem] gap-2 items-center';

const EDIT_ICON_CLASSES =
   'absolute left-0 top-1.5 text-indigo-400 pointer-events-none animate-in fade-in duration-200 z-10';
const ICON_SIZE = 14;

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
            p-3 transition-all duration-200 group relative border-l-2
            ${
               isModified
                  ? 'bg-indigo-500/5 border-indigo-500 hover:bg-indigo-500/10'
                  : 'bg-zinc-800/40 border-transparent hover:bg-zinc-800/80 hover:border-zinc-700'
            }
         `}
      >
         {/* 1. COLUMNA PRODUCTO (Rediseñada para incluir metadata) */}
         <div className="w-full relative flex flex-col justify-center min-w-0">
            {/* Fila Superior: Nombre Editable */}
            <div className="relative w-full">
               {item.isManualName && (
                  <HiOutlinePencilSquare className={EDIT_ICON_CLASSES} size={ICON_SIZE} />
               )}
               <input
                  type="text"
                  value={item.name}
                  onChange={e => onUpdate(item.id, { name: e.target.value })}
                  title={item.name}
                  className={`
                     w-full bg-transparent rounded cursor-default focus:cursor-text py-0.5
                     focus:ring-0 border-b border-transparent focus:border-indigo-500/50
                     outline-none truncate transition-all duration-200 font-bold text-zinc-200 text-sm
                     ${item.isManualName ? 'pl-5' : 'pl-0.5'}
                  `}
               />
            </div>

            {/* Fila Inferior: Metadata (Proveedor + Badge) - Estilo consistente con Modal */}
            <div className="flex items-center gap-2 mt-0.5 pl-0.5">
               <span
                  className="text-[10px] text-zinc-500 font-medium truncate max-w-[150px]"
                  title={`Proveedor: ${item.supplier}`}
               >
                  {item.supplier}
               </span>

               {hasInventoryDiscount && (
                  <span className="text-[9px] px-1.5 rounded-[4px] font-bold border bg-green-500/10 text-green-400 border-green-500/20 leading-tight">
                     -{item.discountPercentage}%
                  </span>
               )}
            </div>
         </div>

         {/* 2. COLUMNA VALOR (UNITARIO) */}
         <div className="flex flex-col justify-center items-end w-full relative h-full">
            {hasInventoryDiscount && !item.isManualPrice && (
               <div className="w-full flex justify-end mb-0.5 pr-1">
                  <span className="text-[10px] text-zinc-500 line-through decoration-zinc-500 font-medium">
                     ${item.originalPrice.toLocaleString('es-CO')}
                  </span>
               </div>
            )}

            <div className="relative w-full flex items-center justify-end">
               {item.isManualPrice && (
                  <HiOutlinePencilSquare className={EDIT_ICON_CLASSES} size={ICON_SIZE} />
               )}

               <input
                  type="text"
                  value={localPrice}
                  onChange={handlePriceChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className={`
                     w-full bg-transparent text-right rounded cursor-default focus:cursor-text py-0.5
                     border-b border-transparent focus:border-indigo-500/50
                     outline-none no-spinners transition-all duration-200 font-medium text-zinc-200 text-sm
                     ${item.isManualPrice ? 'text-indigo-300 pr-1 pl-5' : 'pr-1'} 
                  `}
               />
            </div>
         </div>

         {/* 3. COLUMNA CANTIDAD */}
         <div className="flex justify-center w-full pl-4">
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

         {/* 4. COLUMNA SUBTOTAL */}
         <div className="flex justify-end items-center w-full">
            <span className="font-bold text-zinc-100 tracking-tight text-base">
               ${(item.quantity * item.price).toLocaleString('es-CO')}
            </span>
         </div>

         {/* 5. COLUMNA ELIMINAR */}
         <div className="flex justify-end">
            <button
               onClick={() => onRemove(item.id)}
               className="text-zinc-600 p-2 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer"
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
      // CAMBIO PRINCIPAL AQUÍ:
      // 1. Reemplazado 'overflow-hidden' por 'overflow-x-auto overflow-y-hidden'
      // 2. Añadido 'custom-scrollbar' para que el scroll horizontal tenga estilo
      <div className="flex flex-col h-full bg-zinc-950 overflow-x-auto overflow-y-hidden rounded-xl custom-scrollbar">
         <div className="min-w-[700px] h-full flex flex-col">
            {/* HEADER */}
            <div
               className={`${GRID_LAYOUT} bg-zinc-900/80 text-zinc-500 font-bold text-[11px] py-3 px-3 uppercase tracking-wider border-b border-zinc-800 shrink-0 select-none`}
            >
               <div className="text-left pl-3">Producto</div>
               <div className="text-right pr-3">Valor Unidad</div>
               <div className="text-center">Cantidad</div>
               <div className="text-right pr-1">Subtotal</div>
               <div></div>
            </div>

            {/* BODY */}
            <div className="flex flex-col gap-y-1 p-2 flex-1 overflow-y-auto custom-scrollbar">
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
                     <div className="bg-zinc-900/50 p-8 rounded-full mb-4 border border-zinc-800/50">
                        <HiOutlinePencilSquare size={40} className="opacity-20" />
                     </div>
                     <p className="text-zinc-500 font-medium mb-2">La factura está vacía</p>
                     <span className="text-xs bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-500">
                        Presiona <kbd className="font-bold text-zinc-400 mx-1">ESPACIO</kbd> para
                        agregar productos
                     </span>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
