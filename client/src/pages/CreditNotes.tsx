import { HiOutlineDocumentMinus } from 'react-icons/hi2';

export const CreditNotes = () => {
   return (
      <div className="flex flex-col h-full text-zinc-200">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
               <HiOutlineDocumentMinus size={24} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-white">Devoluciones (Notas Crédito)</h1>
               <p className="text-zinc-400">Gestión de devoluciones de clientes</p>
            </div>
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-white mb-2">Detalles Técnicos</h3>
            <p className="text-zinc-400 leading-relaxed">
               Gestión de la tabla <code>credit_notes</code>. Permite registrar devoluciones de
               productos por parte de los clientes, afectando el inventario y generando saldo a
               favor o devoluciones de dinero.
            </p>
         </div>
      </div>
   );
};
