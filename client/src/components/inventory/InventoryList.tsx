import {
   HiOutlinePencilSquare,
   HiOutlineTrash,
   HiOutlineArchiveBoxXMark,
   HiOutlineTag,
} from 'react-icons/hi2';
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
      // 1. Calcular precio real de venta
      const finalPrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : price;

      // 2. Calcular margen sobre el precio FINAL
      // Si el precio final es 0 o menor (error de datos), retornamos 0
      if (finalPrice <= 0) return { finalPrice, margin: 0 };

      const margin = Math.round(((finalPrice - cost) / finalPrice) * 100);
      return { finalPrice, margin };
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
         {/* scrollbar-stable evita el salto visual cuando cambia el filtro */}
         <div className="overflow-y-auto custom-scrollbar scrollbar-stable h-full">
            <table className="w-full text-left border-collapse relative">
               <thead className="sticky top-0 z-10">
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-[11px] font-bold text-zinc-500 uppercase tracking-wider shadow-sm">
                     {/* Fusionamos columnas para dar más aire */}
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

                     return (
                        <tr
                           key={product.id}
                           className="group hover:bg-zinc-800/40 transition-colors h-[85px]" // Altura fija mínima para consistencia
                        >
                           {/* 1. PRODUCTO & PROVEEDOR */}
                           <td className="px-6 py-3 align-middle">
                              <div className="flex flex-col justify-center">
                                 <span
                                    className="font-bold text-zinc-200 text-sm truncate pr-4"
                                    title={product.name}
                                 >
                                    {product.name}
                                 </span>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                                       {product.supplier}
                                    </span>
                                    {hasDiscount && (
                                       <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-medium">
                                          <HiOutlineTag size={10} />-{product.discount_percentage}%
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </td>

                           {/* 2. COSTO */}
                           <td className="px-4 py-3 text-right align-middle">
                              <span className="font-mono text-zinc-500 text-xs">
                                 {formatCurrency(product.cost || 0)}
                              </span>
                           </td>

                           {/* 3. PRECIO (Con lógica visual de descuento) */}
                           <td className="px-4 py-3 text-right align-middle">
                              <div className="flex flex-col items-end justify-center">
                                 {hasDiscount && (
                                    <span className="text-[11px] text-zinc-500 line-through decoration-zinc-600 mb-0.5">
                                       {formatCurrency(product.price)}
                                    </span>
                                 )}
                                 <span
                                    className={`font-mono font-medium text-sm ${
                                       hasDiscount ? 'text-blue-300' : 'text-zinc-200'
                                    }`}
                                 >
                                    {formatCurrency(finalPrice)}
                                 </span>
                              </div>
                           </td>

                           {/* 4. GANANCIA (Margen Real) */}
                           <td className="px-4 py-3 text-center align-middle">
                              <div
                                 className={`
                                 inline-flex items-center justify-center px-2 py-1 rounded-md font-mono font-bold text-xs border
                                 ${
                                    margin < 0
                                       ? 'bg-red-500/10 text-red-400 border-red-500/20' // Pérdida
                                       : margin < 20
                                       ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' // Margen bajo
                                       : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' // Margen saludable
                                 }
                              `}
                              >
                                 {margin}%
                              </div>
                           </td>

                           {/* 5. STOCK */}
                           <td className="px-6 py-3 text-center align-middle">
                              <div className="flex flex-col items-center justify-center">
                                 <span
                                    className={`
                                    text-xl font-bold font-mono leading-none
                                    ${isLowStock ? 'text-red-500' : 'text-zinc-400'}
                                 `}
                                 >
                                    {product.stock}
                                 </span>
                                 {isLowStock && (
                                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider mt-1 bg-red-500/10 px-1 rounded">
                                       Bajo
                                    </span>
                                 )}
                              </div>
                           </td>

                           {/* 6. ACCIONES */}
                           <td className="px-4 py-3 text-right align-middle">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
