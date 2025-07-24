import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineArchiveBoxXMark } from 'react-icons/hi2';

// Types
import { type Product } from '../../types/inventory';

type InventoryListProps = {
   products: Product[];
   isLoading: boolean;
   onEdit: (product: Product) => void;
   onDelete: (product: Product) => void;
};

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
         <div className="flex flex-col gap-2 animate-pulse">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-20 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
            ))}
         </div>
      );
   }

   if (products.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
            <HiOutlineArchiveBoxXMark size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No se encontraron productos</p>
         </div>
      );
   }

   return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
         <div className="overflow-y-auto custom-scrollbar scrollbar-stable h-full">
            <table className="w-full text-left border-collapse relative">
               <thead className="sticky top-0 z-10">
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-bold text-zinc-500 uppercase tracking-wider shadow-sm">
                     <th className="px-6 py-4 w-[40%]">Producto / Proveedor</th>
                     <th className="px-4 py-4 text-right w-[15%]">Costo</th>
                     <th className="px-4 py-4 text-right w-[20%]">Precio Venta</th>
                     <th className="px-4 py-4 text-center w-[10%]">Ganancia</th>
                     <th className="px-6 py-4 text-center w-[10%]">Stock</th>
                     <th className="px-4 py-4 text-right w-[5%]"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50">
                  {products.map(product => {
                     const { finalPrice, margin } = calculateStats(
                        product.price,
                        product.cost || 0,
                        product.discount_percentage,
                     );
                     const isLowStock = product.stock <= 5;
                     const hasDiscount = product.discount_percentage > 0;

                     const rowClass = hasDiscount
                        ? 'border-l-2 border-l-emerald-500 bg-emerald-500/[0.02]'
                        : 'border-l-2 border-l-transparent hover:bg-zinc-800/30';

                     return (
                        <tr
                           key={product.id}
                           className={`group transition-colors h-[80px] ${rowClass}`}
                        >
                           {/* 1. PRODUCTO */}
                           <td className="px-6 py-2 align-middle">
                              <div className="flex flex-col justify-center">
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
                           </td>

                           {/* 2. COSTO */}
                           <td className="px-4 py-2 text-right align-middle">
                              <span className="font-mono text-zinc-500 text-sm font-medium">
                                 {formatCurrency(product.cost || 0)}
                              </span>
                           </td>

                           {/* 3. PRECIO */}
                           <td className="px-4 py-2 text-right align-middle">
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
                                       <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 rounded-sm">
                                          -{product.discount_percentage}%
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </td>

                           {/* 4. GANANCIA */}
                           <td className="px-4 py-2 text-center align-middle">
                              <div
                                 className={`
                                 inline-flex items-center justify-center w-14 py-1 rounded-md font-mono font-bold text-sm
                                 ${getMarginStyle(margin)}
                              `}
                              >
                                 {margin}%
                              </div>
                           </td>

                           {/* 5. STOCK */}
                           <td className="px-6 py-2 text-center align-middle">
                              <div className="flex flex-col items-center justify-center">
                                 <span
                                    className={`
                                    text-xl font-bold font-mono leading-none
                                    ${isLowStock ? 'text-red-400' : 'text-zinc-300'}
                                 `}
                                 >
                                    {product.stock}
                                 </span>
                                 {isLowStock && (
                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest mt-1 opacity-80">
                                       Bajo
                                    </span>
                                 )}
                              </div>
                           </td>

                           {/* 6. ACCIONES */}
                           <td className="px-4 py-2 text-right align-middle">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={() => onEdit(product)}
                                    className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                 >
                                    <HiOutlinePencilSquare size={18} />
                                 </button>
                                 <button
                                    onClick={() => onDelete(product)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                 >
                                    <HiOutlineTrash size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </div>
   );
};
