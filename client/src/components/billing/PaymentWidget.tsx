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
      <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700 shadow-lg mb-3">
         <div className="flex justify-between items-center mb-3">
            <h2 className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
               Método de Pago
            </h2>
         </div>

         {/* Segmented Control */}
         <div className="bg-zinc-900 p-1 rounded-lg flex gap-1 mb-3">
            <button
               onClick={() => setCheckoutData({ paymentMethod: 'cash' })}
               className={`
                  flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer
                  ${
                     paymentMethod === 'cash'
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }
               `}
            >
               <HiOutlineBanknotes size={16} />
               <span>Efectivo</span>
            </button>
            <button
               onClick={() => setCheckoutData({ paymentMethod: 'transfer' })}
               className={`
                  flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm font-bold transition-all cursor-pointer
                  ${
                     paymentMethod === 'transfer'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }
               `}
            >
               <HiOutlineCreditCard size={16} />
               <span>Transf.</span>
            </button>
         </div>

         {/* Cash Input Compacto */}
         {paymentMethod === 'cash' && (
            <div className="animate-in fade-in zoom-in-95 duration-200 bg-zinc-900/50 rounded-lg p-2 border border-zinc-800">
               <div className="flex items-center justify-between gap-3">
                  <label className="text-xs text-zinc-400 font-medium shrink-0">Recibido:</label>
                  <div className="relative flex-1">
                     <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold">
                        $
                     </span>
                     <input
                        type="text"
                        value={cashReceivedStr}
                        onChange={handleCashChange}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 pl-6 py-1 text-right text-sm font-bold text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        placeholder="0"
                     />
                  </div>
               </div>
               <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-800/50">
                  <span className="text-zinc-500 text-xs font-bold uppercase">Cambio</span>
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
      </div>
   );
};
