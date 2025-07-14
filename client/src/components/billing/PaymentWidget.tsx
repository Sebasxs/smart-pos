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
      // CAMBIO: Agregado 'h-full flex flex-col'.
      // Esto fuerza al widget a ocupar toda la altura disponible en el modo Tablet.
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-lg h-full flex flex-col">
         <div className="flex justify-between items-center mb-3">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mt-1 select-none">
               Método de Pago
            </h2>
         </div>

         <div className="bg-zinc-800 p-1 rounded-lg flex gap-1 mb-3 border border-zinc-700/50 shrink-0">
            <button
               onClick={() => setCheckoutData({ paymentMethod: 'cash' })}
               className={`
                  flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all cursor-pointer border
                  ${
                     paymentMethod === 'cash'
                        ? 'bg-green-600/10 text-green-400 border-green-500/20'
                        : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50'
                  }
               `}
            >
               <HiOutlineBanknotes size={16} />
               <span>Efectivo</span>
            </button>
            <button
               onClick={() => setCheckoutData({ paymentMethod: 'transfer' })}
               className={`
                  flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all cursor-pointer border
                  ${
                     paymentMethod === 'transfer'
                        ? 'bg-purple-600/10 text-purple-400 border-purple-500/20'
                        : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50'
                  }
               `}
            >
               <HiOutlineCreditCard size={16} />
               <span>Transf.</span>
            </button>
         </div>

         {/* El contenido condicional usa flex-1 para empujar si fuera necesario, pero el contenedor gris interno es el que da la forma visual */}
         {paymentMethod === 'cash' && (
            <div className="animate-in fade-in zoom-in-95 duration-200 bg-zinc-800/30 rounded-lg p-3 py-2 border border-zinc-700/50">
               <div className="flex items-center justify-between gap-3">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase shrink-0 mr-2 select-none">
                     Recibido
                  </label>
                  <div className="relative flex-1">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">
                        $
                     </span>
                     <input
                        type="text"
                        value={cashReceivedStr}
                        onChange={handleCashChange}
                        className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-2 pl-7 py-1.5 text-right text-sm font-bold text-white outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-zinc-700"
                        placeholder="0"
                     />
                  </div>
               </div>
               <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-700/50">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase select-none">
                     Cambio
                  </span>
                  <span
                     className={`text-base font-bold ${
                        change > 0 ? 'text-green-400' : 'text-zinc-600'
                     }`}
                  >
                     ${change.toLocaleString('es-CO')}
                  </span>
               </div>
            </div>
         )}

         {/* Spacer opcional si se quisiera empujar contenido en modo transferencia, 
             pero generalmente dejarlo vacío es mejor visualmente en dark mode */}
      </div>
   );
};
