import { HiOutlineDocumentText } from 'react-icons/hi2';

export const Sales = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
               <HiOutlineDocumentText size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Historial de Ventas</h1>
               <p className="text-zinc-400">Registro histórico y reportes de facturación</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Consulta de tabla <code>invoices</code> e <code>invoice_items</code>. Permite ver el
               historial completo de facturas emitidas, filtrar por fecha, cliente o productos, y
               generar reportes de ventas.
            </p>
         </div>
      </div>
   );
};
