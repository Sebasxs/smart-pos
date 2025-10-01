import { HiX } from 'react-icons/hi';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { useBillingStore, type PaymentMethodType } from '../../store/billingStore';
import { CustomSelect } from '../ui/CustomSelect';
import { HiOutlineBanknotes, HiOutlineCreditCard, HiOutlineWallet } from 'react-icons/hi2';
import { Button } from '../ui/Button';

type PaymentWidgetProps = {
   total: number;
};

const METHOD_CONFIG: Record<
   string,
   { label: string; icon: any; bgClass: string; borderClass: string; textClass: string }
> = {
   cash: {
      label: 'Efectivo',
      icon: HiOutlineBanknotes,
      bgClass: 'bg-emerald-500/5',
      borderClass: 'border-emerald-500/20',
      textClass: 'text-emerald-400',
   },
   bank_transfer: {
      label: 'Transferencia',
      icon: HiOutlineCreditCard,
      bgClass: 'bg-purple-500/5',
      borderClass: 'border-purple-500/20',
      textClass: 'text-purple-400',
   },
   credit_card: {
      label: 'Tarjeta',
      icon: HiOutlineCreditCard,
      bgClass: 'bg-blue-500/5',
      borderClass: 'border-blue-500/20',
      textClass: 'text-blue-400',
   },
   account_balance: {
      label: 'Saldo a Favor',
      icon: HiOutlineWallet,
      bgClass: 'bg-amber-500/5',
      borderClass: 'border-amber-500/20',
      textClass: 'text-amber-400',
   },
};

const PAYMENT_OPTIONS = [
   { value: 'cash', label: 'Efectivo' },
   { value: 'bank_transfer', label: 'Transferencia Bancaria' },
   { value: 'credit_card', label: 'Tarjeta Crédito / Débito' },
   { value: 'account_balance', label: 'Saldo a Favor' },
];

export const SplitPaymentWidget = ({ total }: PaymentWidgetProps) => {
   const { checkoutData, addPayment, updatePayment, removePayment } = useBillingStore();
   const { payments, customer } = checkoutData;

   const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
   const balance = total - totalPaid;
   const remaining = Math.max(0, balance);
   const change = balance < 0 ? Math.abs(balance) : 0;

   const handleAddPayment = (method: string) => {
      const amountToAdd = remaining > 0 ? remaining : 0;

      if (method === 'account_balance') {
         const maxBalance = customer.accountBalance || 0;
         if (maxBalance <= 0) return;
         addPayment(method as PaymentMethodType, Math.min(amountToAdd, maxBalance));
      } else {
         addPayment(method as PaymentMethodType, amountToAdd > 0 ? amountToAdd : null);
      }
   };

   const availableOptions = PAYMENT_OPTIONS.filter(opt => {
      if (payments.some(p => p.method === opt.value)) return false;
      if (opt.value === 'account_balance') {
         return (customer.accountBalance || 0) > 0;
      }
      return true;
   });

   return (
      <div className="flex flex-col">
         {/* HEADER CONSISTENTE CON RESUMEN E INVOICE TABLE */}
         <div className="h-[48px] px-5 bg-surface-highlight/50 backdrop-blur-sm border-b border-border/40 flex items-center justify-between shrink-0">
            <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
               Medios de Pago
            </h2>
            {(customer.accountBalance || 0) > 0 &&
               !payments.some(p => p.method === 'account_balance') && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                     Saldo: ${customer.accountBalance}
                  </span>
               )}
         </div>

         <div className="px-5 pb-2 pt-5 flex flex-col gap-4">
            {/* SELECT CON ESTILO SÓLIDO/ACTIVO */}
            <div>
               <CustomSelect
                  value=""
                  onChange={handleAddPayment}
                  options={availableOptions}
                  placeholder={
                     availableOptions.length > 0 ? 'Añadir medio de pago...' : 'No hay más opciones'
                  }
                  color="dark"
               />
            </div>

            <div className="flex flex-col gap-2">
               {payments.length > 0 ? (
                  payments.map(payment => {
                     const config = METHOD_CONFIG[payment.method] || METHOD_CONFIG.cash;
                     const Icon = config.icon;

                     return (
                        <div
                           key={payment.id}
                           className={`p-3 rounded-xl border flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200 group transition-colors ${config.bgClass} ${config.borderClass}`}
                        >
                           <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 ${config.textClass}`}>
                                 <Icon size={16} />
                                 <span className="text-xs font-bold tracking-wide uppercase">
                                    {config.label}
                                 </span>
                              </div>
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 onClick={() => removePayment(payment.id)}
                                 className="text-text-dim hover:text-danger-text h-6 w-6 p-0 transition-opacity opacity-60 hover:opacity-100"
                              >
                                 <HiX size={14} />
                              </Button>
                           </div>

                           <SmartNumberInput
                              value={payment.amount}
                              onValueChange={v => updatePayment(payment.id, v)}
                              variant="currency"
                              showPrefix={true}
                              placeholder="0"
                              className="[&>input]:bg-transparent [&>input]:border-none [&>input]:text-right [&>input]:text-lg [&>input]:font-mono [&>input]:font-black [&>input]:text-text-main [&>input]:p-0 [&>input]:h-auto [&>input]:focus:ring-0 [&>input]:placeholder:text-white/10"
                           />
                        </div>
                     );
                  })
               ) : (
                  <div className="flex flex-col items-center justify-center text-text-dim/40 border-2 border-dashed border-border/40 rounded-xl py-6">
                     <span className="text-xs font-medium uppercase tracking-widest">
                        Esperando pago
                     </span>
                  </div>
               )}
            </div>

            {/* Diferencia/Faltante */}
            {remaining > 0 || change > 0 ? (
               <div
                  className={`
                  flex justify-between items-center px-4 py-3 rounded-xl border transition-all duration-300 shadow-sm
                  ${
                     remaining > 0
                        ? 'bg-warning-bg/10 border-warning/20'
                        : 'bg-success-bg/10 border-success/20'
                  }
               `}
               >
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wide">
                     {remaining > 0 ? 'Faltante' : 'Cambio'}
                  </span>

                  <span
                     className={`text-xl font-mono font-black ${
                        remaining > 0 ? 'text-warning-text' : 'text-success-text'
                     }`}
                  >
                     $ {new Intl.NumberFormat('es-CO').format(remaining > 0 ? remaining : change)}
                  </span>
               </div>
            ) : null}
         </div>
      </div>
   );
};
