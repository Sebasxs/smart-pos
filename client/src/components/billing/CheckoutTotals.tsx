import { HiOutlineTrash, HiOutlineCheckCircle, HiOutlineTag } from 'react-icons/hi2';
import { Button } from '../ui/Button';
import { SmartNumber } from '../ui/SmartNumber';
import { SectionHeader } from '../ui/SectionHeader';
import { type Discount } from '../../types/billing';

type CheckoutTotalsProps = {
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

export const CheckoutTotals = ({
   subtotal,
   discount,
   discountAmount,
   total,
   isPaymentValid,
   isProcessing,
   onOpenDiscount,
   onDiscard,
   onProcessPayment,
}: CheckoutTotalsProps) => {
   return (
      <div className="w-full flex flex-col bg-surface relative">
         <div className="absolute top-0 left-0 right-0 h-4 pointer-events-none" />

         <SectionHeader
            title="Resumen"
            actions={
               <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDiscard}
                  className="h-8 w-8 text-text-dim hover:text-danger-text hover:bg-danger-bg"
                  title="Limpiar todo"
               >
                  <HiOutlineTrash size={16} />
               </Button>
            }
         />

         <div className="px-5 py-5 flex flex-col gap-5">
            <div className="space-y-2.5">
               <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted font-medium">Subtotal</span>
                  <SmartNumber
                     value={subtotal}
                     variant="currency"
                     className="font-mono font-medium text-text-secondary"
                  />
               </div>

               <div className="flex justify-between items-center text-sm">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onOpenDiscount}
                     className="h-auto p-0 flex items-center gap-1.5 text-primary-text hover:text-primary-hover transition-colors text-xs font-bold uppercase tracking-wide group active:scale-100"
                  >
                     <HiOutlineTag size={14} />
                     <span className="border-b border-dashed border-primary/30 group-hover:border-primary-text">
                        Descuento
                     </span>
                  </Button>
                  <div className="flex items-center gap-2">
                     {discount.value > 0 && (
                        <span className="text-text-main text-[10px] font-bold bg-surface-highlight px-1.5 py-0.5 rounded border border-border">
                           {discount.type === 'percentage' ? `${discount.value}%` : '$'}
                        </span>
                     )}
                     <span
                        className={`font-mono font-medium ${
                           discountAmount > 0 ? 'text-danger-text' : 'text-text-dim'
                        }`}
                     >
                        -
                        <SmartNumber value={discountAmount} variant="currency" showPrefix={false} />
                     </span>
                  </div>
               </div>
            </div>

            <div className="border-t border-dashed border-border-hover" />

            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-text-main pb-1">Total</span>
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
                  variant="primary"
                  className="w-full py-4 text-lg"
               >
                  {!isProcessing && (
                     <div className="flex items-center justify-center gap-3">
                        <span>Confirmar Venta</span>
                        {isPaymentValid && (
                           <HiOutlineCheckCircle className="text-white/90" size={24} />
                        )}
                     </div>
                  )}
               </Button>
            </div>
         </div>
      </div>
   );
};
