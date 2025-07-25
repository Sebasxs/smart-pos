import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineArchiveBoxXMark } from 'react-icons/hi2';

// Types
import { type Product } from '../../types/inventory';

type InventoryListProps = {
   products: Product[];
   isLoading: boolean;
   onEdit: (product: Product) => void;
   onDelete: (product: Product) => void;
};

const GRID_LAYOUT = 'grid grid-cols-[4fr_1.5fr_2fr_1fr_1fr_3.5rem] gap-4 items-center px-6';

export const InventoryList = ({ products, isLoading, onEdit, onDelete }: InventoryListProps) => {
   const formatCurrency = (val: number) => `$${val.toLocaleString('es-CO')}`;

   const calculateStats = (price: number, cost: number, discountPercent: number) => {
      const finalPrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : price;

      if (finalPrice <= 0) return { finalPrice, margin: 0 };
      const margin = Math.round(((finalPrice - cost) / finalPrice) * 100);
      return { finalPrice, margin };
   };

   const getMarginStyle = (margin: number) => {
      if (margin <= 35) return 'text-amber-500 bg-amber-500/10';
      if (margin >= 70) return 'text-emerald-500 bg-emerald-500/10';
      return 'text-blue-400 bg-blue-500/10';
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
         <div className="flex flex-col items-center justify-center h-full text-zinc-500 bg-zinc-900/30 rounded-xl">
            <HiOutlineArchiveBoxXMark size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No se encontraron productos</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
         {/* 1. HEADER (Fijo, fuera del scroll) */}
         <div className="border-b border-zinc-800 bg-zinc-950/50 shrink-0">
            <div
               className={`${GRID_LAYOUT} py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider`}
            >
               <div>Producto / Proveedor</div>
               <div className="text-right">Costo</div>
               <div className="text-right">Precio Venta</div>
               <div className="text-center">Ganancia</div>
               <div className="text-center">Stock</div>
               <div></div>
            </div>
         </div>

         {/* 2. LISTA (Scrollable) */}
         <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-stable">
            <div className="flex flex-col divide-y divide-zinc-800/50">
               {products.map(product => {
                  const { finalPrice, margin } = calculateStats(
                     product.price,
                     product.cost || 0,
                     product.discount_percentage,
                  );
                  const isLowStock = product.stock <= 5;
                  const hasDiscount = product.discount_percentage > 0;

                  const rowClass = hasDiscount
                     ? 'bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]'
                     : 'hover:bg-zinc-800/30';

                  const indicatorClass = hasDiscount ? 'bg-emerald-500' : 'bg-transparent';

                  return (
                     <div
                        key={product.id}
                        className={`relative group transition-colors ${rowClass}`}
                     >
                        {/* Indicador de descuento lateral */}
                        <div
                           className={`absolute left-0 top-0 bottom-0 w-[2px] ${indicatorClass}`}
                        />

                        <div className={`${GRID_LAYOUT} py-3`}>
                           {/* 1. PRODUCTO */}
                           <div className="flex flex-col justify-center min-w-0">
                              <span
                                 className="font-bold text-zinc-200 text-[15px] truncate pr-4"
                                 title={product.name}
                              >
                                 {product.name}
                              </span>
                              <span className="text-sm text-zinc-500 truncate mt-0.5 font-medium">
                                 {product.supplier}
                              </span>
                           </div>

                           {/* 2. COSTO */}
                           <div className="text-right">
                              <span className="font-mono text-zinc-500 text-sm font-medium">
                                 {formatCurrency(product.cost || 0)}
                              </span>
                           </div>

                           {/* 3. PRECIO */}
                           <div className="text-right">
                              <div className="flex flex-col items-end justify-center">
                                 <span
                                    className={`font-mono font-bold text-base ${
                                       hasDiscount ? 'text-emerald-400' : 'text-zinc-200'
                                    }`}
                                 >
                                    {formatCurrency(finalPrice)}
                                 </span>

                                 {hasDiscount && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                       <span className="text-xs text-zinc-600 line-through decoration-zinc-700">
                                          {formatCurrency(product.price)}
                                       </span>
                                       <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded-sm leading-none py-0.5">
                                          -{product.discount_percentage}%
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* 4. GANANCIA */}
                           <div className="text-center">
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
                           <div className="text-center">
                              <div className="flex flex-col items-center justify-center">
                                 <span
                                    className={`
                                    text-lg font-bold font-mono leading-none
                                    ${isLowStock ? 'text-red-400' : 'text-zinc-300'}
                                 `}
                                 >
                                    {product.stock}
                                 </span>
                                 {isLowStock && (
                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1 opacity-80 scale-75 origin-center">
                                       Bajo
                                    </span>
                                 )}
                              </div>
                           </div>

                           {/* 6. ACCIONES */}
                           <div className="text-right">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={() => onEdit(product)}
                                    className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                    title="Editar"
                                 >
                                    <HiOutlinePencilSquare size={18} />
                                 </button>
                                 <button
                                    onClick={() => onDelete(product)}
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
               })}
            </div>
         </div>
      </div>
   );
};
