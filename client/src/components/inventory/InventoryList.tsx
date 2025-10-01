import { Virtuoso } from 'react-virtuoso';
import { HiOutlineTrash, HiOutlineArchiveBoxXMark, HiOutlineQrCode } from 'react-icons/hi2';
import { useInventoryStore } from '../../store/inventoryStore';
import { SmartNumber } from '../ui/SmartNumber';
import { SortableHeader } from '../ui/SortableHeader';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

// Types
import { type Product } from '../../types/inventory';

type InventoryListProps = {
   products: Product[];
   isLoading: boolean;
   onEdit: (product: Product) => void;
   onDelete: (product: Product) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[1fr_7rem_8rem_6rem_5rem_3.5rem] gap-4 items-center px-6';

export const InventoryList = ({ products, isLoading, onEdit, onDelete }: InventoryListProps) => {
   const { sortConfig, setSort } = useInventoryStore();

   const calculateStats = (price: number, cost: number, discountPercent: number) => {
      const finalPrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : price;

      if (finalPrice <= 0) return { finalPrice, margin: 0 };
      const margin = Math.round(((finalPrice - cost) / finalPrice) * 100);
      return { finalPrice, margin };
   };

   const getMarginStyle = (margin: number) => {
      if (margin <= 39) return 'text-text-muted bg-surface-highlight border-transparent';
      if (margin >= 60) return 'text-success-text bg-success-bg border-success/20';
      return 'text-info-text bg-info-bg border-info/20';
   };

   const Row = (_index: number, product: Product) => {
      const { finalPrice, margin } = calculateStats(
         product.price,
         product.cost || 0,
         product.discountPercentage,
      );
      const isLowStock = product.stock <= 3;
      const hasDiscount = product.discountPercentage > 0;

      return (
         <div
            onClick={() => onEdit(product)}
            className={cn(
               GRID_LAYOUT,
               'group relative py-3 border-b border-border/20 cursor-pointer', // Borde interno muy sutil
               'bg-surface hover:bg-surface-highlight',
               isLowStock && !hasDiscount && 'bg-warning-bg/20 hover:bg-warning-bg/50',
               hasDiscount && 'bg-success-bg/20 hover:bg-success-bg/50',
            )}
         >
            {/* Indicador lateral sutil */}
            <div
               className={cn(
                  'absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors',
                  hasDiscount ? 'bg-success' : isLowStock ? 'bg-warning' : 'bg-transparent',
               )}
            />

            {/* 1. PRODUCT & SKU */}
            <div className="flex flex-col justify-center min-w-0 pr-2 pl-2">
               <span className="font-bold text-text-secondary text-[15px] truncate w-full transition-colors group-hover:text-text-main">
                  {product.description}
               </span>

               <div className="flex items-center gap-2 mt-0.5">
                  {product.sku ? (
                     <div className="flex items-center gap-1 text-text-dim text-xs font-mono bg-canvas/30 px-1.5 py-0.5 rounded border border-transparent">
                        <HiOutlineQrCode size={12} className="shrink-0" />
                        <span className="truncate">{product.sku}</span>
                     </div>
                  ) : (
                     <span className="text-xs text-text-muted/50 italic">Sin SKU</span>
                  )}
               </div>
            </div>

            {/* 2. COST */}
            <div className="text-right">
               <span className="font-mono text-text-dim text-sm font-medium pr-1">
                  <SmartNumber value={product.cost || 0} variant="currency" />
               </span>
            </div>

            {/* 3. PRICE */}
            <div className="text-right">
               <div className="flex flex-col items-end justify-center pr-1">
                  <span
                     className={cn(
                        'font-mono font-bold text-base tracking-tight',
                        hasDiscount ? 'text-success-text' : 'text-text-main',
                     )}
                  >
                     <SmartNumber value={finalPrice} variant="currency" />
                  </span>

                  {hasDiscount && (
                     <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-text-dim line-through decoration-text-dim/50 font-mono">
                           <SmartNumber
                              value={product.price}
                              variant="currency"
                              showPrefix={false}
                           />
                        </span>
                        <span className="text-[10px] font-bold text-success-text bg-success-bg px-1.5 rounded leading-none py-0.5 border border-success/20">
                           -{product.discountPercentage}%
                        </span>
                     </div>
                  )}
               </div>
            </div>

            {/* 4. PROFIT */}
            <div className="text-center pl-2">
               <span
                  className={cn(
                     'inline-flex items-center justify-center w-12 py-0.5 rounded-md font-mono font-bold text-sm border',
                     getMarginStyle(margin),
                  )}
               >
                  {margin}%
               </span>
            </div>

            {/* 5. STOCK */}
            <div className="text-center pl-2">
               <span
                  className={cn(
                     'inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 rounded-md font-mono font-bold text-sm border',
                     isLowStock
                        ? 'text-warning-text bg-warning-bg border-warning/20'
                        : 'text-text-secondary bg-surface-highlight border-transparent', // Sin borde en estado normal
                  )}
               >
                  {product.stock}
               </span>
            </div>

            {/* 6. ACTIONS */}
            <div className="text-right">
               <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={e => {
                        e.stopPropagation();
                        onDelete(product);
                     }}
                     className="h-9 w-9 text-text-dim hover:text-danger-text hover:bg-danger-bg opacity-0 group-hover:opacity-100 transition-opacity"
                     title="Eliminar producto"
                  >
                     <HiOutlineTrash size={18} />
                  </Button>
               </div>
            </div>
         </div>
      );
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-2 animate-pulse p-4">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-16 bg-surface rounded-xl border border-transparent" />
            ))}
         </div>
      );
   }

   if (products.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-text-dim bg-surface/30 rounded-xl border-none p-12">
            <div className="w-20 h-20 bg-surface-highlight rounded-full flex items-center justify-center mb-4 border border-transparent">
               <HiOutlineArchiveBoxXMark size={40} className="opacity-50" />
            </div>
            <p className="font-medium text-lg text-text-secondary">No se encontraron productos</p>
            <p className="text-sm text-text-muted mt-1">
               Intenta ajustar los filtros o agrega uno nuevo.
            </p>
         </div>
      );
   }

   return (
      // SIN BORDE EXTERNO
      <div className="flex flex-col h-full w-full bg-surface rounded-xl overflow-hidden shadow-sm">
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-[800px] flex flex-col h-full">
               {/* 1. HEADER - border-b sutil */}
               <div className="border-b border-border/40 bg-surface-highlight/50 backdrop-blur-sm shadow-sm shrink-0 z-10 select-none">
                  <div
                     className={cn(
                        GRID_LAYOUT,
                        'py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider',
                     )}
                  >
                     <SortableHeader
                        label="Producto"
                        sortKey="description"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        offset={8}
                     />
                     <SortableHeader
                        label="Costo"
                        sortKey="cost"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        align="right"
                        offset={4}
                     />
                     <SortableHeader
                        label="Precio Venta"
                        sortKey="price"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        align="right"
                        offset={4}
                     />
                     <SortableHeader
                        label="Margen"
                        sortKey="margin"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        align="center"
                     />
                     <SortableHeader
                        label="Stock"
                        sortKey="stock"
                        currentSortKey={sortConfig.key}
                        sortDirection={sortConfig.direction}
                        onSort={setSort}
                        align="center"
                     />
                     <div></div>
                  </div>
               </div>

               {/* 2. VIRTUOSO LIST */}
               <div className="flex-1 bg-surface">
                  <Virtuoso
                     data={products}
                     itemContent={Row}
                     className="custom-scrollbar scrollbar-stable"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
