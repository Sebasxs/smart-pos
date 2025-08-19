import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';

export const Kardex = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200 p-4">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
               <HiOutlineClipboardDocumentList size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Kardex</h1>
               <p className="text-zinc-400">Auditoría de movimientos de inventario</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Auditoría de <code>inventory_movements</code>. Visualización detallada de todas las
               entradas y salidas de productos, permitiendo rastrear el historial de stock y costos.
            </p>
         </div>
      </div>
   );
};
