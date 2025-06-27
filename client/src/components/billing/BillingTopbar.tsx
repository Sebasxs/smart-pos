type BillingTopbarProps = {
   total: number;
};

export const BillingTopbar = ({ total }: BillingTopbarProps) => {
   const formatCurrency = (val: number) => `$${val.toLocaleString('es-CO')}`;

   return (
      <div className="shrink-0 flex justify-between items-center bg-zinc-900 border-b border-zinc-800 p-2">
         <div
            className="
               max-w-0 opacity-0 
               md:max-w-full md:opacity-100 
               transition-all duration-500
               overflow-hidden
            "
         >
            <h1 className="text-2xl font-bold text-white">Factura</h1>
            <div className="text-zinc-500 text-xs mt-1 flex gap-3 font-medium">
               <span className="flex items-center gap-1">
                  <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300 min-w-[20px] text-center">
                     ESPACIO
                  </kbd>{' '}
                  Buscar
               </span>
               <span className="flex items-center gap-1">
                  <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300 min-w-[20px] text-center">
                     ↩
                  </kbd>{' '}
                  Cobrar
               </span>
               <span className="flex items-center gap-1">
                  <kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300 min-w-[20px] text-center">
                     E
                  </kbd>{' '}
                  Eliminar factura
               </span>
            </div>
         </div>

         <div className="flex flex-col items-end py-3 rounded-xl border border-zinc-800/50">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
               Total a Pagar
            </span>
            <span className="text-4xl font-black text-white tracking-tight whitespace-nowrap">
               {formatCurrency(total)}
            </span>
         </div>
      </div>
   );
};
