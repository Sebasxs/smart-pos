import { HiOutlineBanknotes, HiOutlineCreditCard, HiOutlineWallet } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { useBillingStore, type PaymentMethodType } from '../../store/billingStore';

type PaymentWidgetProps = {
   total: number;
};

const PAYMENT_METHODS: {
   value: PaymentMethodType;
   label: string;
   icon: React.ElementType;
   color: string;
   bgColor: string;
   borderColor: string;
   shadowColor: string;
   btnClass: string;
}[] = [
   {
      value: 'cash',
      label: 'Efectivo',
      icon: HiOutlineBanknotes,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/50',
      shadowColor: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]',
      btnClass:
         'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40',
   },
   {
      value: 'bank_transfer',
      label: 'Transferencia',
      icon: HiOutlineCreditCard,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
      shadowColor: 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]',
      btnClass:
         'text-purple-400 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/40',
   },
   {
      value: 'account_balance',
      label: 'Saldo a Favor',
      icon: HiOutlineWallet,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/50',
      shadowColor: 'shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]',
      btnClass:
         'text-blue-400 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40',
   },
];

export const SplitPaymentWidget = ({ total }: PaymentWidgetProps) => {
   const { checkoutData, addPayment, updatePayment, removePayment } = useBillingStore();
   const { payments, customer } = checkoutData;

   const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

   const balance = total - totalPaid;
   const remaining = Math.max(0, balance);
   const change = balance < 0 ? Math.abs(balance) : 0;

   const handleAddPayment = (method: PaymentMethodType) => {
      const amountToAdd = remaining > 0 ? remaining : 0;

      if (method === 'account_balance') {
         const maxBalance = customer.accountBalance || 0;
         if (maxBalance <= 0) return;
         addPayment(method, Math.min(amountToAdd, maxBalance));
      } else {
         addPayment(method, amountToAdd > 0 ? amountToAdd : null);
      }
   };

   const getPaymentMethodInfo = (method: PaymentMethodType) => {
      return PAYMENT_METHODS.find(pm => pm.value === method);
   };

   return (
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-sm flex flex-col overflow-hidden h-full">
         <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
               Métodos de Pago
            </h2>
         </div>

         <div className="p-4 flex flex-col gap-4">
            {/* Payment Entries */}
            {payments.length > 0 && (
               <div className="space-y-2">
                  {payments.map(payment => {
                     const info = getPaymentMethodInfo(payment.method);
                     if (!info) return null;

                     const Icon = info.icon;

                     return (
                        <div
                           key={payment.id}
                           className={`p-3 rounded-lg border ${info.borderColor} ${info.bgColor} flex flex-col gap-2`}
                        >
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Icon size={16} className={info.color} />
                                 <span className={`text-sm font-medium ${info.color}`}>
                                    {info.label}
                                 </span>
                              </div>
                              <button
                                 onClick={() => removePayment(payment.id)}
                                 className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                              >
                                 <HiX size={14} />
                              </button>
                           </div>

                           <SmartNumberInput
                              value={payment.amount}
                              onValueChange={v => updatePayment(payment.id, v)}
                              variant="currency"
                              showPrefix={true}
                              placeholder="0"
                              className="[\u0026\u003einput]:w-full [\u0026\u003einput]:bg-transparent [\u0026\u003einput]:text-right [\u0026\u003einput]:text-xl [\u0026\u003einput]:font-mono [\u0026\u003einput]:font-bold [\u0026\u003einput]:text-white [\u0026\u003einput]:outline-none [\u0026\u003einput]:placeholder:text-zinc-700 [\u0026\u003einput]:border-0 [\u0026\u003einput]:px-2 [\u0026\u003einput]:py-1 [\u0026\u003einput]:focus:ring-0"
                           />
                        </div>
                     );
                  })}
               </div>
            )}

            {/* Add Payment Buttons */}
            <div className="grid grid-cols-3 gap-2">
               {PAYMENT_METHODS.map(method => {
                  const isDisabled =
                     method.value === 'account_balance' && (customer.accountBalance || 0) <= 0;

                  return (
                     <button
                        key={method.value}
                        onClick={() => handleAddPayment(method.value)}
                        disabled={isDisabled}
                        className={`
                           p-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1.5
                           ${
                              isDisabled
                                 ? 'bg-zinc-900/50 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50'
                                 : method.btnClass
                           }
                        `}
                        title={
                           isDisabled
                              ? 'Cliente no tiene saldo disponible'
                              : `Agregar ${method.label}`
                        }
                     >
                        <method.icon size={16} />
                        <span className="text-xs font-bold">+</span>
                     </button>
                  );
               })}
            </div>

            {/* Remaining/Complete Indicator */}
            <div
               className={`
                  flex justify-between items-center px-3 py-2.5 rounded-xl border transition-all duration-300
                  ${
                     remaining > 0
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : change > 0
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-emerald-500/10 border-emerald-500/30'
                  }
               `}
            >
               <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  {remaining > 0 ? 'Faltante' : change > 0 ? 'Cambio' : 'Pago Completo'}
               </span>

               <SmartNumber
                  value={remaining > 0 ? remaining : change}
                  variant="currency"
                  className={`text-2xl font-mono font-bold ${
                     remaining > 0
                        ? 'text-amber-400'
                        : change > 0
                        ? 'text-blue-400'
                        : 'text-emerald-400'
                  }`}
               />
            </div>
         </div>
      </div>
   );
};
