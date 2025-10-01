import {
   HiOutlineTrash,
   HiOutlinePencilSquare,
   HiOutlineExclamationTriangle,
   HiOutlinePlus,
} from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { QuantitySelector } from '../ui/QuantitySelector';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { useEffect, useRef } from 'react';

// Types
import { type InvoiceItem } from '../../types/billing';

type InvoiceItemRowProps = {
   item: InvoiceItem;
   onUpdate: (id: string, newValues: Partial<InvoiceItem>) => void;
   onRemove: (id: string) => void;
};

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

   let rowStyle = 'bg-transparent hover:bg-surface-highlight/30 text-text-secondary';
   let indicatorColor = 'bg-transparent';

   if (isOverStock) {
      rowStyle = 'bg-warning-bg/30 hover:bg-warning-bg/50 text-text-main';
      indicatorColor = 'bg-warning';
   } else if (isModified) {
      rowStyle = 'bg-info-bg/30 hover:bg-info-bg/50 text-text-main';
      indicatorColor = 'bg-info';
   } else if (hasInventoryDiscount) {
      rowStyle = 'bg-success-bg/30 hover:bg-success-bg/50 text-text-main';
      indicatorColor = 'bg-success';
   }

   return (
      <div
         className={`
            ${GRID_LAYOUT} 
            group relative px-6 py-2.5 border-b border-border/30 transition-all duration-200
            ${rowStyle}
         `}
      >
         {/* Lateral indicator */}
         <div
            className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-200 ${indicatorColor}`}
         />

         {/* Product */}
         <div className="flex flex-col min-w-0 pl-2">
            <div className="flex items-center w-full gap-2">
               <input
                  type="text"
                  value={item.description}
                  onChange={e => onUpdate(item.id, { description: e.target.value })}
                  className="w-full bg-transparent border-b border-transparent focus:border-primary/50 pb-0.5 outline-none truncate transition-colors duration-200 font-medium text-[14px] tracking-wide placeholder:text-text-dim text-inherit capitalize"
               />
               {isOverStock && (
                  <div
                     title={`Stock insuficiente: ${item.stock}`}
                     className="text-warning shrink-0 cursor-help"
                  >
                     <HiOutlineExclamationTriangle size={16} />
                  </div>
               )}
            </div>

            {(isModified || hasInventoryDiscount) && (
               <div className="flex items-center gap-2 mt-1 h-4">
                  {isModified && (
                     <div className="flex items-center gap-1 text-[9px] px-1.5 py-px rounded-md font-bold bg-info-bg border border-info/30 text-info-text leading-none shrink-0">
                        <HiOutlinePencilSquare size={10} />
                        <span>Editado</span>
                     </div>
                  )}
                  {hasInventoryDiscount && !item.isPriceEdited && (
                     <span className="text-[9px] font-bold text-success-text bg-success-bg px-1.5 rounded-sm leading-none py-0.5 border border-success/30">
                        -{item.discountPercentage}% Oferta
                     </span>
                  )}
               </div>
            )}
         </div>

         {/* Unit price */}
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
                     [&>input]:h-auto [&>input]:rounded-none [&>input]:border-0 
                     [&>input]:focus:ring-0 [&>input]:focus:ring-offset-0
                     [&>input]:border-b [&>input]:border-transparent 
                     [&>input]:outline-none [&>input]:font-mono [&>input]:font-medium [&>input]:tracking-tight 
                     [&>input]:transition-all [&>input]:duration-200
                     ${
                        hasInventoryDiscount
                           ? '[&>input]:text-success-text [&>input]:font-bold [&>input]:focus:border-success'
                           : '[&>input]:text-text-main [&>input]:text-[14px] [&>input]:focus:border-primary'
                     }
                  `}
               />
            </div>

            {hasInventoryDiscount && !item.isPriceEdited && (
               <div className="flex items-center gap-1 mt-0.5 justify-end w-full">
                  <span className="text-[10px] text-text-dim line-through decoration-text-dim/50 font-mono">
                     <SmartNumber value={item.originalPrice} variant="currency" />
                  </span>
               </div>
            )}
         </div>

         {/* Quantity selector */}
         <div className="flex justify-center w-full">
            <QuantitySelector
               value={item.quantity}
               stock={item.stock}
               onIncrease={() => onUpdate(item.id, { quantity: item.quantity + 1 })}
               onDecrease={() => onUpdate(item.id, { quantity: Math.max(1, item.quantity - 1) })}
               onQuantityChange={qty => onUpdate(item.id, { quantity: qty > 0 ? qty : 1 })}
            />
         </div>

         {/* Subtotal */}
         <div className="flex flex-col items-end w-full">
            <span className="font-bold text-text-main tracking-tight text-[15px] font-mono tabular-nums">
               <SmartNumber value={item.quantity * item.price} variant="currency" />
            </span>
         </div>

         {/* Actions */}
         <div className="flex justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
               variant="ghost"
               size="icon"
               onClick={() => onRemove(item.id)}
               className="h-7 w-7 text-text-dim hover:text-danger-text hover:bg-danger-bg p-0"
               title="Eliminar producto"
               tabIndex={-1}
            >
               <HiOutlineTrash size={16} />
            </Button>
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
   const scrollContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const updateWidth = () => {
         const width = container.clientWidth;
         container.style.setProperty('--sticky-width', `${width}px`);
      };

      updateWidth();

      const observer = new ResizeObserver(updateWidth);
      observer.observe(container);

      return () => observer.disconnect();
   }, []);

   const isEmptyList = items.length === 0;

   return (
      <div className="flex flex-col h-full bg-surface rounded-xl shadow-sm overflow-hidden">
         <div
            ref={scrollContainerRef}
            className={`flex-1 custom-scrollbar relative ${
               isEmptyList ? 'overflow-hidden' : 'overflow-auto'
            }`}
         >
            <div className="min-w-[640px] flex flex-col min-h-0">
               <div
                  className={`
                     sticky top-0 z-20 ${GRID_LAYOUT} 
                     py-4 px-6 mb-0 
                     bg-surface-highlight/50 backdrop-blur-sm
                     text-[10px] font-bold text-text-muted uppercase tracking-wider 
                     border-b border-border/40 
                     shrink-0 select-none shadow-sm
                  `}
               >
                  <div className="pl-2">Producto</div>
                  <div className="text-right">Valor Und.</div>
                  <div className="text-center">Cant.</div>
                  <div className="text-right">Subtotal</div>
                  <div></div>
               </div>

               <div className="flex flex-col flex-1 pb-2 bg-surface">
                  {items.map(item => (
                     <InvoiceItemRow
                        key={item.id}
                        item={item}
                        onUpdate={onUpdateItem}
                        onRemove={onRemoveItem}
                     />
                  ))}

                  <div
                     className="sticky left-0 z-10 max-w-full overflow-hidden self-start mt-auto pb-4"
                     style={{ width: 'var(--sticky-width, 100vw)' }}
                  >
                     <div className="px-6 py-4">
                        <Button
                           variant="ghost"
                           onClick={onAddProductClick}
                           className={`
                               group cursor-pointer w-full py-5 rounded-xl block h-auto
                               border border-dashed border-primary/30 
                               bg-primary-subtle/30 hover:bg-primary-subtle 
                               text-primary-text hover:text-primary-hover
                               flex items-center justify-center gap-2 
                               transition-all duration-200
                               font-medium text-sm active:scale-100
                            `}
                        >
                           <HiOutlinePlus
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                           />
                           <span>Nuevo producto</span>
                           <span className="hidden sm:inline-block text-[10px] opacity-70 ml-2 font-mono border border-primary/30 px-1 rounded bg-primary/10">
                              ESPACIO
                           </span>
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
