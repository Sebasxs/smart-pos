import { HiOutlineTrash, HiOutlineCheckCircle, HiOutlineTag } from 'react-icons/hi2';
import { type Discount } from '../../types/billing';

type BillingTotalsProps = {
   subtotal: number;
   discount: Discount;
   discountAmount: number;
   total: number;
   isPaymentValid: boolean;
   isProcessing: boolean;
   onOpenDiscount: () => void;
   onDiscard: () => void;
   onProcessPayment: () => void;
};

export const BillingTotals = ({
   subtotal,
   discount,
   discountAmount,
   total,
   isPaymentValid,
   isProcessing,
   onOpenDiscount,
   onDiscard,
   onProcessPayment,
}: BillingTotalsProps) => {
   const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-CO')}`;

   const buttonBaseClass =
      'w-full font-bold py-4 rounded-xl text-lg tracking-wide transition-all duration-200 shadow-lg flex justify-center items-center gap-1.5 group relative overflow-hidden';

   const buttonStateClass =
      isPaymentValid && !isProcessing
         ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/20 translate-y-0 hover:-translate-y-0.5 cursor-pointer'
         : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700 shadow-none';

   return (
      <div className="w-full md:flex-1 bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm shrink-0 flex flex-col overflow-hidden">
         <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
               Resumen
            </h2>
            <button
               onClick={onDiscard}
               className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
               title="Limpiar todo"
            >
               <HiOutlineTrash size={16} />
            </button>
         </div>

         <div className="p-5 flex flex-col h-full gap-4">
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 font-medium">Subtotal</span>
                  <span className="font-mono font-medium text-zinc-300">
                     {formatCurrency(subtotal)}
                  </span>
               </div>

               <div className="flex justify-between items-center text-sm">
                  <button
                     onClick={onOpenDiscount}
                     className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors text-xs font-bold uppercase tracking-wide group"
                  >
                     <HiOutlineTag />
                     <span className="border-b border-blue-500/30 group-hover:border-blue-400">
                        Descuento
                     </span>
                  </button>
                  <div className="flex items-center gap-2">
                     {discount.value > 0 && (
                        <span className="text-zinc-500 text-md">
                           ({discount.type === 'percentage' ? `${discount.value}%` : '$'})
                        </span>
                     )}
                     <span
                        className={`font-mono font-medium ${
                           discountAmount > 0 ? 'text-red-400' : 'text-zinc-500'
                        }`}
                     >
                        -{formatCurrency(discountAmount)}
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-800 border-dashed">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-zinc-300">Total</span>
                  <span className="text-4xl font-mono font-black text-white tracking-tighter">
                     {formatCurrency(total)}
                  </span>
               </div>

               <button
                  onClick={onProcessPayment}
                  disabled={!isPaymentValid || isProcessing}
                  className={`${buttonBaseClass} ${buttonStateClass}`}
               >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {isProcessing ? (
                     <span className="flex items-center gap-2">Procesando...</span>
                  ) : (
                     <>
                        <span>Confirmar Venta</span>
                        <HiOutlineCheckCircle
                           className={`group-hover:text-white transition-colors ${
                              isPaymentValid ? 'text-blue-200' : 'text-zinc-600'
                           }`}
                           size={24}
                        />
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};
