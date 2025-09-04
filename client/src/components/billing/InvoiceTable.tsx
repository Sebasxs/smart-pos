import {
   HiOutlineTrash,
   HiOutlinePencilSquare,
   HiOutlineExclamationTriangle,
} from 'react-icons/hi2';
import { LucidePlus } from 'lucide-react';
import { QuantitySelector } from '../ui/QuantitySelector';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';

// Types
import { type InvoiceItem } from '../../types/billing';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

// Layout de la grilla
const GRID_LAYOUT = 'grid grid-cols-[1fr_7rem_6.5rem_6.5rem_2rem] gap-4 items-center';

const InvoiceItemRow = ({ item, onUpdate, onRemove }: InvoiceItemRowProps) => {
   const handlePriceChange = (newPrice: number | null) => {
      if (newPrice !== null) {
         onUpdate(item.id, { price: newPrice });
      }
   };

   const hasInventoryDiscount = item.discountPercentage > 0;
   const isModified = item.isPriceEdited || item.isDescriptionEdited;
   const isOverStock = item.quantity > item.stock;

   // Estilos de fila
   let rowStyle = 'bg-transparent hover:bg-zinc-800/30';
   let indicatorColor = 'bg-transparent';

   if (isOverStock) {
      rowStyle = 'bg-amber-500/[0.02] hover:bg-amber-500/[0.05]';
      indicatorColor = 'bg-amber-500/50';
   } else if (isModified) {
      rowStyle = 'bg-indigo-500/[0.04] hover:bg-indigo-500/[0.08]';
      indicatorColor = 'bg-indigo-500';
   } else if (hasInventoryDiscount) {
      rowStyle = 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]';
      indicatorColor = 'bg-emerald-500';
   }

   return (
      <div
         className={`
            ${GRID_LAYOUT} 
            group relative px-6 py-2 border-b border-zinc-800/50 transition-all duration-200
            ${rowStyle}
         `}
      >
         {/* Indicador lateral */}
         <div
            className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-200 ${indicatorColor}`}
         />

         {/* 1. PRODUCTO */}
         <div className="flex flex-col min-w-0 pl-2">
            <div className="flex items-center w-full gap-2">
               <input
                  type="text"
                  value={item.description}
                  onChange={e => onUpdate(item.id, { description: e.target.value })}
                  className="w-full bg-transparent border-b border-transparent focus:border-indigo-500 pb-0.5 outline-none truncate transition-colors duration-200 font-medium text-[14px] tracking-wide placeholder:text-zinc-600 text-zinc-100 capitalize"
               />
               {isOverStock && (
                  <div
                     title={`Stock insuficiente:  ${item.stock}`}
                     className="text-amber-500 shrink-0 cursor-help"
                  >
                     <HiOutlineExclamationTriangle size={14} />
                  </div>
               )}
            </div>

            {(isModified || hasInventoryDiscount) && (
               <div className="flex items-center gap-2 mt-0.5 h-4">
                  {isModified && (
                     <div className="flex items-center gap-1 text-[9px] px-1.5 py-px rounded-md font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 leading-none shrink-0">
                        <HiOutlinePencilSquare size={10} />
                        <span>Editado</span>
                     </div>
                  )}
                  {hasInventoryDiscount && !item.isPriceEdited && (
                     <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded-sm leading-none py-0.5 border border-emerald-500/20">
                        -{item.discountPercentage}% Oferta
                     </span>
                  )}
               </div>
            )}
         </div>

         {/* 2. VALOR UNITARIO */}
         <div className="flex flex-col justify-center items-end w-full">
            <div className="relative w-full flex items-center justify-end group/price">
               <SmartNumberInput
                  value={item.price}
                  onValueChange={handlePriceChange}
                  variant="currency"
                  showPrefix={false}
                  onKeyDown={e => {
                     if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                     }
                  }}
                  className={`
                     w-full
                     [&>input]:text-right [&>input]:bg-transparent [&>input]:py-1 [&>input]:px-0
                     
                     /* Reset de estilos del input base */
                     [&>input]:h-auto [&>input]:rounded-none [&>input]:border-0 
                     [&>input]:focus:ring-0 [&>input]:focus:ring-offset-0
                     
                     /* Borde inferior interactivo */
                     [&>input]:border-b [&>input]:border-transparent 
                     
                     /* Tipografía */
                     [&>input]:outline-none [&>input]:font-mono [&>input]:font-medium [&>input]:tracking-tight 
                     [&>input]:transition-all [&>input]:duration-200
                     
                     /* Colores dinámicos */
                     ${
                        hasInventoryDiscount
                           ? '[&>input]:text-emerald-400 [&>input]:font-bold [&>input]:focus:border-emerald-500'
                           : '[&>input]:text-zinc-300 [&>input]:text-[14px] [&>input]:focus:border-indigo-500'
                     }
                  `}
               />
            </div>

            {hasInventoryDiscount && !item.isPriceEdited && (
               <div className="flex items-center gap-1 mt-0.5 justify-end w-full">
                  <span className="text-[10px] text-zinc-500 line-through decoration-zinc-600 font-mono">
                     <SmartNumber value={item.originalPrice} variant="currency" />
                  </span>
               </div>
            )}
         </div>

         {/* 3. CANTIDAD (Selector) */}
         <div className="flex justify-center w-full">
            <QuantitySelector
               value={item.quantity}
               stock={item.stock}
               onIncrease={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
               onDecrease={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
               onQuantityChange={qty => onUpdate(item.id, { quantity: qty > 0 ? qty : 1 })}
            />
         </div>

         {/* 4. SUBTOTAL */}
         <div className="flex flex-col items-end w-full">
            <span className="font-bold text-white tracking-tight text-[15px] font-mono tabular-nums">
               <SmartNumber value={item.quantity * item.price} variant="currency" />
            </span>
         </div>

         {/* 5. ACCIONES */}
         <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
               onClick={() => onRemove(item.id)}
               className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 cursor-pointer active:scale-95"
               title="Eliminar producto"
               tabIndex={-1}
            >
               <HiOutlineTrash size={16} />
            </button>
         </div>
      </div>
   );
};

export type InvoiceTableProps = {
   items: InvoiceItem[];
   onUpdateItem: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemoveItem: (id: string) => void;
   onAddProductClick: () => void;
};

export const InvoiceTable = ({
   items,
   onUpdateItem,
   onRemoveItem,
   onAddProductClick,
}: InvoiceTableProps) => {
   return (
      <div className="flex flex-col h-full bg-zinc-950/50 overflow-x-auto overflow-y-hidden rounded-xl custom-scrollbar">
         <div className="min-w-[640px] flex flex-col h-full">
            <div
               className={`${GRID_LAYOUT} py-2 px-6 mb-0 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 bg-zinc-900/50 shrink-0 select-none`}
            >
               <div className="pl-2">Producto</div>
               <div className="text-right">Valor Und.</div>
               <div className="text-center">Cant.</div>
               <div className="text-right">Subtotal</div>
               <div></div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar pt-0">
               {items.map(item => (
                  <InvoiceItemRow
                     key={item.id}
                     item={item}
                     onUpdate={onUpdateItem}
                     onRemove={onRemoveItem}
                  />
               ))}

               {/* Ghost Row - Notion Style */}
               <div
                  onClick={onAddProductClick}
                  className={`group cursor-pointer px-6 py-3 border-b border-transparent hover:border-zinc-800/60 transition-all duration-200 flex items-center gap-2 ${
                     items.length === 0
                        ? 'text-zinc-300 hover:text-zinc-200 bg-blue-500/70 hover:bg-blue-500/90 lg:text-zinc-500 lg:hover:text-zinc-400 lg:bg-transparent lg:hover:bg-zinc-500/10'
                        : 'text-zinc-500 hover:text-zinc-400'
                  }`}
               >
                  <LucidePlus size={16} className="opacity-70 group-hover:opacity-100" />
                  <span className="text-sm font-medium">Nuevo producto</span>
                  <span className="text-xs opacity-50 ml-auto">ESPACIO</span>
               </div>

               {items.length === 0 && (
                  <div className="hidden lg:flex min-h-[200px] h-full flex-col py-6 items-center justify-center text-zinc-600 animate-in fade-in duration-500">
                     <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-20" />
                        <div className="relative bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 mb-4 shadow-xl">
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
