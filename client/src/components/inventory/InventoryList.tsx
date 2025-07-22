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

   if (isLoading) {
      return (
         <div className="flex flex-col gap-2 animate-pulse">
            {[...Array(5)].map((_, i) => (
               <div key={i} className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />
            ))}
         </div>
      );
   }

   if (products.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
            <HiOutlineArchiveBoxXMark size={48} className="mb-4 opacity-50" />
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm text-zinc-600">Intenta con otra búsqueda o agrega uno nuevo.</p>
         </div>
      );
   }

   return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                     <th className="px-6 py-4">Producto</th>
                     <th className="px-6 py-4 text-right">Precio</th>
                     <th className="px-6 py-4 text-center">Stock</th>
                     <th className="px-6 py-4">Proveedor</th>
                     <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800">
                  {products.map(product => (
                     <tr key={product.id} className="group hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-bold text-zinc-200 text-sm">
                                 {product.name}
                              </span>
                              {product.discount_percentage > 0 && (
                                 <span className="text-[10px] text-green-400 font-medium">
                                    Desc. {product.discount_percentage}% aplicado
                                 </span>
                              )}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-zinc-300 text-sm">
                           {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span
                              className={`
                              px-2.5 py-1 rounded-md text-xs font-bold border
                              ${
                                 product.stock <= 5
                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }
                           `}
                           >
                              {product.stock} Unids.
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{product.supplier}</td>
                        <td className="px-6 py-4">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                 onClick={() => onEdit(product)}
                                 className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                 title="Editar"
                              >
                                 <HiOutlinePencilSquare size={18} />
                              </button>
                              <button
                                 onClick={() => onDelete(product)}
                                 className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                 title="Eliminar"
                              >
                                 <HiOutlineTrash size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};
