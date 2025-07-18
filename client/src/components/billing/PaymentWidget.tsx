import { HiOutlineBanknotes, HiOutlineCreditCard } from 'react-icons/hi2';
import { useBillingStore } from '../../store/billingStore';

type PaymentWidgetProps = {
   total: number;
};

export const PaymentWidget = ({ total }: PaymentWidgetProps) => {
   const { checkoutData, setCheckoutData } = useBillingStore();
   const { paymentMethod, cashReceivedStr } = checkoutData;

   const cashReceived = parseInt(cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);
   const change = paymentMethod === 'cash' && cashReceived > total ? cashReceived - total : 0;

   const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const formatted = raw ? parseInt(raw, 10).toLocaleString('es-CO') : '';
      setCheckoutData({ cashReceivedStr: formatted });
   };

   return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm flex flex-col overflow-hidden h-full">
         <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Pago</h2>
         </div>

         <div className="p-4 flex flex-col gap-5">
            {/* Segmented Control */}
            <div className="bg-zinc-950/50 p-1 rounded-xl flex relative gap-2 border border-zinc-800">
               <button
                  onClick={() => setCheckoutData({ paymentMethod: 'cash' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all z-10 cursor-pointer ${
                     paymentMethod === 'cash'
                        ? 'text-zinc-200 bg-zinc-400/10 border-2 border-green-400/20 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 border-2 border-transparent'
                  }`}
               >
                  <HiOutlineBanknotes size={18} /> Efectivo
               </button>
               <button
                  onClick={() => setCheckoutData({ paymentMethod: 'transfer' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all z-10 cursor-pointer ${
                     paymentMethod === 'transfer'
                        ? 'text-purple-400 bg-purple-400/10 border-2 border-purple-400/20 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300 border-2 border-transparent'
                  }`}
               >
                  <HiOutlineCreditCard size={18} /> Transferencia
               </button>
            </div>

            {/* Contenido Condicional (Sin animaciones CSS para evitar glitch) */}
            {paymentMethod === 'cash' ? (
               <div className="space-y-4">
                  <div className="relative group">
                     <label className="absolute -top-2.5 left-2 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Recibido
                     </label>
                     <div className="flex items-center border border-zinc-700 rounded-xl px-4 py-3 bg-zinc-800/30 focus-within:bg-zinc-800/50 focus-within:border-green-500/50 transition-all">
                        <span className="text-zinc-500 text-xl font-medium mr-2">$</span>
                        <input
                           type="text"
                           value={cashReceivedStr}
                           onChange={handleCashChange}
                           className="w-full bg-transparent text-right text-3xl font-mono font-bold text-white outline-none placeholder:text-zinc-700"
                           placeholder="0"
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-center px-2 py-2 rounded-lg border border-zinc-800/50">
                     <span className="text-xs font-bold text-zinc-500 uppercase">Cambio</span>
                     <span
                        className={`text-2xl font-mono font-bold ${
                           change > 0 ? 'text-green-400' : 'text-zinc-600'
                        }`}
                     >
                        ${change.toLocaleString('es-CO')}
                     </span>
                  </div>
               </div>
            ) : (
               <div className="h-[120px] flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-800/20 text-zinc-500 gap-2">
                  <HiOutlineCreditCard size={28} className="opacity-50" />
                  <span className="text-xs font-medium">Validar transacción externa</span>
               </div>
            )}
         </div>
      </div>
   );
};
