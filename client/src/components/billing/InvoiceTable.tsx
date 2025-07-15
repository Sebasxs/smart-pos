import { HiOutlineTrash, HiOutlinePencilSquare } from 'react-icons/hi2';
import { QuantitySelector } from '../ui/QuantitySelector';
import { type InvoiceItem } from '../../types/billing';
import { useState, useEffect } from 'react';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[1fr_7rem_8rem_6rem_2.5rem] gap-2 items-center';

// Icono más sutil
const EDIT_ICON_CLASSES =
   'absolute left-0 top-1.5 text-indigo-400 pointer-events-none animate-in fade-in duration-200 z-10 opacity-70';
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
      // CAMBIO VISUAL IMPORTANTE:
      // 1. Eliminado 'bg-zinc-800/40' y border-l-2.
      // 2. Ahora es border-b border-zinc-800 (estilo ledger).
      // 3. Hover sutil bg-zinc-800/30.
      <div
         className={`
            ${GRID_LAYOUT} 
            px-4 py-3 transition-colors duration-150 group relative border-b border-zinc-800/50
            ${
               isModified
                  ? 'bg-indigo-500/5 hover:bg-indigo-500/10' // Modificado (Sutil tinte azul)
                  : 'hover:bg-zinc-800/30' // Normal (Hover gris sutil)
            }
         `}
      >
         {/* Indicador de modificación lateral sutil (opcional, reemplaza el border-l-2 grueso) */}
         {isModified && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500" />}

         {/* 1. COLUMNA PRODUCTO */}
         <div className="w-full relative flex flex-col justify-center min-w-0">
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

         {/* 2. COLUMNA VALOR */}
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

         {/* 4. COLUMNA SUBTOTAL */}
         <div className="flex justify-end items-center w-full pr-1">
            <span className="font-bold text-zinc-100 tracking-tight text-base">
               ${(item.quantity * item.price).toLocaleString('es-CO')}
            </span>
         </div>

         {/* 5. COLUMNA ELIMINAR */}
         <div className="flex justify-end">
            {/* El botón de borrar ahora aparece más sutil, solo visible fuerte al hover de la fila o del botón */}
            <button
               onClick={() => onRemove(item.id)}
               className="text-zinc-600 p-2 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 cursor-pointer opacity-50 group-hover:opacity-100"
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
      // CAMBIO: Eliminado 'bg-zinc-950' del contenedor principal.
      // Ahora es transparente para heredar el zinc-900 del padre en Billing.tsx
      <div className="flex flex-col h-full bg-transparent overflow-x-auto overflow-y-hidden rounded-xl custom-scrollbar">
         <div className="min-w-[700px] h-full flex flex-col">
            {/* HEADER: Fondo sólido para sticky header si fuera necesario, o transparente blending */}
            <div
               className={`${GRID_LAYOUT} bg-zinc-900/95 backdrop-blur-sm text-zinc-500 font-bold text-[11px] py-3 px-4 uppercase tracking-wider border-b border-zinc-800 shrink-0 select-none z-10`}
            >
               <div className="text-left pl-1">Producto</div>
               <div className="text-right">Valor Unidad</div>
               <div className="text-center">Cantidad</div>
               <div className="text-right">Subtotal</div>
               <div></div>
            </div>

            {/* BODY: Sin padding extra, las filas definen su espacio */}
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar bg-zinc-900">
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
                     {/* Círculo decorativo más sutil */}
                     <div className="bg-zinc-800/50 p-6 rounded-full mb-4 border border-zinc-800/50">
                        <HiOutlinePencilSquare size={32} className="opacity-20" />
                     </div>
                     <p className="text-zinc-500 font-medium mb-2">La factura está vacía</p>
                     <span className="text-xs bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-500">
                        Presiona <kbd className="font-bold text-zinc-400 mx-1">ESPACIO</kbd> para
                        agregar productos
                     </span>
                  </div>
               )}

               {/* Generar filas vacías visuales para llenar el espacio si hay pocos items (Efecto Papel) */}
               {items.length > 0 && items.length < 8 && (
                  <div className="flex-1 bg-[linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:100%_4rem] opacity-5 pointer-events-none" />
               )}
            </div>
         </div>
      </div>
   );
};
