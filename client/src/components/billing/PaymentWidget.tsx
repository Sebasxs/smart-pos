import { HiOutlineBanknotes, HiOutlineCreditCard } from 'react-icons/hi2';
import { useBillingStore } from '../../store/billingStore';

type PaymentMethodButtonProps = {
   isActive: boolean;
   onClick: () => void;
   label: string;
   icon: React.ElementType;
   activeClass: string;
   textClass: string;
};

const PaymentMethodButton = ({
   isActive,
   onClick,
   label,
   icon: Icon,
   activeClass,
   textClass,
}: PaymentMethodButtonProps) => {
   const baseClass =
      'relative flex flex-row items-center justify-center gap-2 py-4 px-2 rounded-xl border transition-all duration-200 cursor-pointer group overflow-hidden';
   const inactiveClass =
      'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-300';

   return (
      <button
         onClick={onClick}
         className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
      >
         <div
            className={`rounded-lg transition-colors duration-200 ${
               isActive ? textClass : 'text-zinc-700'
            }`}
         >
            <Icon size={20} />
         </div>
         <span className="font-bold text-sm tracking-wide">{label}</span>
      </button>
   );
};

type PaymentWidgetProps = {
   total: number;
};

export const PaymentWidget = ({ total }: PaymentWidgetProps) => {
   const { checkoutData, setCheckoutData } = useBillingStore();
   const { paymentMethod, cashReceivedStr } = checkoutData;

   const inputVal = parseInt(cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);

   const effectiveReceived = cashReceivedStr === '' || cashReceivedStr === '0' ? total : inputVal;

   const change =
      paymentMethod === 'cash' && effectiveReceived >= total ? effectiveReceived - total : 0;

   const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const formatted = raw ? parseInt(raw, 10).toLocaleString('es-CO') : '';
      setCheckoutData({ cashReceivedStr: formatted });
   };

   return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm flex flex-col overflow-hidden h-full">
         <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Pago</h2>
         </div>

         <div className="p-4 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 pb-1">
               <PaymentMethodButton
                  isActive={paymentMethod === 'cash'}
                  onClick={() => setCheckoutData({ paymentMethod: 'cash' })}
                  label="Efectivo"
                  icon={HiOutlineBanknotes}
                  activeClass="bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]"
                  textClass="text-emerald-400"
               />
               <PaymentMethodButton
                  isActive={paymentMethod === 'transfer'}
                  onClick={() => setCheckoutData({ paymentMethod: 'transfer' })}
                  label="Transferencia"
                  icon={HiOutlineCreditCard}
                  activeClass="bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]"
                  textClass="text-purple-400"
               />
            </div>

            {paymentMethod === 'cash' ? (
               <div className="space-y-4">
                  <div className="relative group">
                     <label className="absolute -top-2.5 left-2 bg-zinc-900 px-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider rounded-full">
                        Recibido
                     </label>
                     <div className="flex items-center border border-zinc-700 rounded-xl px-4 py-3 bg-zinc-800/30 focus-within:bg-zinc-800/50 focus-within:border-emerald-500/50 transition-all">
                        <span className="text-zinc-500 text-xl font-medium mr-2">$</span>
                        <input
                           value={cashReceivedStr}
                           onChange={handleCashChange}
                           className="w-full bg-transparent text-right text-3xl font-mono font-bold text-white outline-none placeholder:text-zinc-700"
                           placeholder={total > 0 ? total.toLocaleString('es-CO') : '0'}
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-center px-3 py-2.5 rounded-xl border border-zinc-800/50 bg-zinc-900/30">
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                        Cambio
                     </span>
                     <span
                        className={`text-2xl font-mono font-bold ${
                           change > 0 ? 'text-emerald-400' : 'text-zinc-600'
                        }`}
                     >
                        ${change.toLocaleString('es-CO')}
                     </span>
                  </div>
               </div>
            ) : (
               <div className="h-[135px] flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-800/10 text-zinc-500 gap-3">
                  <div className="p-3 bg-zinc-800/50 rounded-full">
                     <HiOutlineCreditCard size={24} className="opacity-50" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-medium text-zinc-400">Pago Digital</span>
                     <span className="text-xs text-zinc-600">Validar transacción externa</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
