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

   const calculateMargin = (price: number, cost: number) => {
      if (price === 0) return 0;
      return Math.round(((price - cost) / price) * 100);
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
         <div className="overflow-auto custom-scrollbar h-full">
            <table className="w-full text-left border-collapse relative">
               <thead className="sticky top-0 z-10">
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-[11px] font-bold text-zinc-500 uppercase tracking-wider shadow-sm">
                     <th className="px-6 py-4">Producto</th>
                     <th className="px-6 py-4 text-right">Costo</th>
                     <th className="px-6 py-4 text-right">Precio</th>
                     <th className="px-4 py-4 text-center">Desc.</th>
                     <th className="px-4 py-4 text-center">Ganancia</th>
                     <th className="px-6 py-4 text-center">Stock</th>
                     <th className="px-6 py-4">Proveedor</th>
                     <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50">
                  {products.map(product => {
                     const margin = calculateMargin(product.price, product.cost || 0);
                     const isLowStock = product.stock <= 5;

                     return (
                        <tr
                           key={product.id}
                           className="group hover:bg-zinc-800/40 transition-colors"
                        >
                           <td className="px-6 py-4">
                              <span
                                 className="font-bold text-zinc-200 text-sm block truncate max-w-[200px]"
                                 title={product.name}
                              >
                                 {product.name}
                              </span>
                           </td>

                           <td className="px-6 py-4 text-right font-mono text-zinc-500 text-xs">
                              {formatCurrency(product.cost || 0)}
                           </td>

                           <td className="px-6 py-4 text-right font-mono text-zinc-200 font-medium text-sm">
                              {formatCurrency(product.price)}
                           </td>

                           <td className="px-4 py-4 text-center">
                              {product.discount_percentage > 0 ? (
                                 <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                                    {product.discount_percentage}%
                                 </span>
                              ) : (
                                 <span className="text-zinc-600 text-xs">-</span>
                              )}
                           </td>

                           <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                 <span
                                    className={`
                                    font-mono font-bold text-sm
                                    ${margin < 20 ? 'text-amber-500' : 'text-zinc-300'}
                                 `}
                                 >
                                    {margin}%
                                 </span>
                              </div>
                           </td>

                           <td className="px-6 py-4 text-center">
                              <span
                                 className={`
                                 text-xl font-bold font-mono
                                 ${isLowStock ? 'text-red-400' : 'text-zinc-400'}
                              `}
                              >
                                 {product.stock}
                              </span>
                              {isLowStock && (
                                 <div className="text-[9px] text-red-500 font-bold uppercase tracking-wide mt-[-2px]">
                                    Bajo
                                 </div>
                              )}
                           </td>

                           <td
                              className="px-6 py-4 text-sm text-zinc-500 truncate max-w-[150px]"
                              title={product.supplier}
                           >
                              {product.supplier}
                           </td>

                           <td className="px-6 py-4">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button
                                    onClick={() => onEdit(product)}
                                    className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                    title="Editar"
                                 >
                                    <HiOutlinePencilSquare size={18} />
                                 </button>
                                 <button
                                    onClick={() => onDelete(product)}
                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                    title="Eliminar"
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
