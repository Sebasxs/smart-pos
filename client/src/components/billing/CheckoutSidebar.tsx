import { SplitPaymentWidget } from './SplitPaymentWidget';
import { CheckoutTotals } from './CheckoutTotals';
import type { Discount } from '../../types/billing';

type CheckoutSidebarProps = {
   subtotal: number;
   discount: Discount;
   discountAmount: number;
   total: number;
   itemsLength: number;
   isPaymentValid: boolean;
   isProcessing: boolean;
   onOpenDiscount: () => void;
   onDiscard: () => void;
   onProcessPayment: () => void;
};

export const CheckoutSidebar = ({
   subtotal,
   discount,
   discountAmount,
   total,
   itemsLength,
   isPaymentValid,
   isProcessing,
   onOpenDiscount,
   onDiscard,
   onProcessPayment,
}: CheckoutSidebarProps) => {
   return (
      // Sidebar como unidad sólida con un solo scroll
      <aside className="w-full lg:w-[360px] lg:shrink-0 flex flex-col h-fit max-h-full bg-surface rounded-2xl shadow-sm overflow-hidden border border-border/20">
         <div className="flex-1 overflow-y-auto custom-scrollbar p-0 min-h-0">
            {/* Widget de pagos */}
            <SplitPaymentWidget total={total} />

            <div className="my-2" />

            {/* Totales fluyendo naturalmente debajo de los pagos */}
            <CheckoutTotals
               subtotal={subtotal}
               discount={discount}
               discountAmount={discountAmount}
               total={total}
               isPaymentValid={isPaymentValid}
               isProcessing={isProcessing}
               onOpenDiscount={onOpenDiscount}
               onDiscard={() => itemsLength > 0 && onDiscard()}
               onProcessPayment={onProcessPayment}
            />
         </div>
      </aside>
   );
};
