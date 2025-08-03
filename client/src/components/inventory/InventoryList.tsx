import { Virtuoso } from 'react-virtuoso';
import { HiOutlineTrash, HiOutlineArchiveBoxXMark, HiChevronUp, HiChevronDown } from 'react-icons/hi2';
import { useInventoryStore, type SortKey } from '../../store/inventoryStore';
import { formatCurrency } from '../../utils/format';

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
      if (margin <= 39) return 'text-zinc-400 bg-zinc-400/10';
      if (margin >= 60) return 'text-emerald-500 bg-emerald-500/10';
      return 'text-blue-400 bg-blue-500/10';
   };

   const SortableHeader = ({ label, sortKey, align = 'left' }: { label: string, sortKey?: SortKey, align?: 'left' | 'right' | 'center' }) => {
      if (!sortKey) return <div className={`text-${align}`}>{label}</div>;

      const isActive = sortConfig.key === sortKey;

      return (
         <div
            className={`flex items-center gap-1 cursor-pointer hover:text-zinc-300 transition-colors select-none ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'
               }`}
            onClick={() => setSort(sortKey)}
         >
            {label}
            <div className="flex flex-col">
               <HiChevronUp size={10} className={`${isActive && sortConfig.direction === 'asc' ? 'text-blue-400' : 'text-zinc-700'}`} />
               <HiChevronDown size={10} className={`${isActive && sortConfig.direction === 'desc' ? 'text-blue-400' : 'text-zinc-700'}`} style={{ marginTop: -4 }} />
            </div>
         </div>
      );
   };

   const Row = (_index: number, product: Product) => {
      const { finalPrice, margin } = calculateStats(
         product.price,
         product.cost || 0,
         product.discountPercentage,
      );
      const isLowStock = product.stock <= 3;
      const hasDiscount = product.discountPercentage > 0;

      const rowClass = hasDiscount
         ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]'
         : isLowStock
            ? 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
            : 'hover:bg-zinc-800/30';

      const indicatorClass = hasDiscount
         ? 'bg-emerald-500'
         : isLowStock
            ? 'bg-amber-500'
            : 'bg-transparent';

      return (
         <div
            onClick={() => onEdit(product)}
            className={`relative group transition-colors cursor-pointer border-b border-zinc-800/50 ${rowClass}`}
            title="Click para editar"
         >
            {/* Indicador lateral */}
            <div
               className={`absolute left-0 top-0 bottom-0 w-[2px] ${indicatorClass}`}
            />

            <div className={`${GRID_LAYOUT} py-3`}>
               {/* 1. PRODUCTO */}
               <div className="flex flex-col justify-center min-w-0 pr-2">
                  <span
                     className="font-bold text-zinc-200 text-[15px] truncate w-full"
                  >
                     {product.name}
                  </span>
                  <span className="text-sm text-zinc-500 truncate w-full mt-0.5 font-medium">
                     {product.supplier}
                  </span>
               </div>

               {/* 2. COSTO */}
               <div className="text-right">
                  <span className="font-mono text-zinc-400 text-sm font-medium pr-1">
                     {formatCurrency(product.cost || 0, true)}
                  </span>
               </div>

               {/* 3. PRECIO */}
               <div className="text-right">
                  <div className="flex flex-col items-end justify-center pr-1">
                     <span
                        className={`font-mono font-bold text-base ${hasDiscount ? 'text-emerald-400' : 'text-zinc-200'
                           }`}
                     >
                        {formatCurrency(finalPrice, true)}
                     </span>

                     {hasDiscount && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <span className="text-xs text-zinc-500 line-through decoration-zinc-700">
                              {formatCurrency(product.price)}
                           </span>
                           <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded-sm leading-none py-0.5">
                              -{product.discountPercentage}%
                           </span>
                        </div>
                     )}
                  </div>
               </div>

               {/* 4. GANANCIA */}
               <div className="text-center pl-2">
                  <span
                     className={`
                     inline-flex items-center justify-center w-12 py-0.5 rounded-md font-mono font-bold text-sm
                     ${getMarginStyle(margin)}
                  `}
                  >
                     {margin}%
                  </span>
               </div>

               {/* 5. STOCK */}
               <div className="text-center pl-2">
                  <span
                     className={`
                     inline-flex items-center justify-center w-12 py-0.5 rounded-md font-mono font-bold text-sm
                     ${isLowStock
                           ? 'text-amber-500 bg-amber-500/5'
                           : 'text-zinc-400 bg-zinc-400/10'
                        }
                     `}
                  >
                     {product.stock}
                  </span>
               </div>

               {/* 6. ACCIONES */}
               <div className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           onDelete(product);
                        }}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar"
                     >
                        <HiOutlineTrash size={18} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-2 animate-pulse p-4">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
            ))}
         </div>
      );
   }

   if (products.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
            <HiOutlineArchiveBoxXMark size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No se encontraron productos</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-[800px] flex flex-col h-full">
               {/* 1. HEADER */}
               <div className="border-b border-zinc-800 bg-zinc-950/50 shrink-0">
                  <div
                     className={`${GRID_LAYOUT} py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider`}
                  >
                     <SortableHeader label="Producto / Proveedor" sortKey="name" />
                     <SortableHeader label="Costo" sortKey="cost" align="right" />
                     <SortableHeader label="Precio Venta" sortKey="price" align="right" />
                     <SortableHeader label="Ganancia" sortKey="margin" align="center" />
                     <SortableHeader label="Stock" sortKey="stock" align="center" />
                     <div></div>
                  </div>
               </div>

               {/* 2. LISTA VIRTUALIZADA */}
               <div className="flex-1">
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