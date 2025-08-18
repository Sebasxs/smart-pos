import { HiOutlineTrash, HiOutlineCheckCircle, HiOutlineTag } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { SmartNumber } from '../ui/SmartNumber';

// Types
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
                  <SmartNumber
                     value={subtotal}
                     variant="currency"
                     className="font-mono font-medium text-zinc-300"
                  />
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
                        -
                        <SmartNumber value={discountAmount} variant="currency" showPrefix={false} />
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-zinc-800 border-dashed">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-lg font-bold text-zinc-300">Total</span>
                  <SmartNumber
                     value={total}
                     variant="currency"
                     className="text-4xl font-mono font-black text-white tracking-tighter"
                  />
               </div>

               <Button
                  onClick={onProcessPayment}
                  disabled={!isPaymentValid || isProcessing}
                  isLoading={isProcessing}
                  className="w-full py-4 text-lg shadow-blue-900/20"
               >
                  {!isProcessing && (
                     <>
                        <span>Confirmar Venta</span>
                        <HiOutlineCheckCircle
                           className={`transition-colors ${
                              isPaymentValid ? 'text-blue-200' : 'text-zinc-600'
                           }`}
                           size={24}
                        />
                     </>
                  )}
               </Button>
            </div>
         </div>
      </div>
   );
};
