import { HiOutlinePlus, HiX } from 'react-icons/hi';
import { CustomerBadge } from './CustomerBadge';
import { SplitPaymentWidget } from './SplitPaymentWidget';
import { BillingTotals } from './BillingTotals';
import { type CheckoutState } from '../../store/billingStore';
import type { Discount } from '../../types/billing';

type BillingSidebarProps = {
   checkoutData: CheckoutState;
   subtotal: number;
   discount: Discount;
   discountAmount: number;
   total: number;
   itemsLength: number;
   isPaymentValid: boolean;
   isProcessing: boolean;
   onResetCustomer: () => void;
   onOpenClientSearch: () => void;
   onOpenDiscount: () => void;
   onDiscard: () => void;
   onProcessPayment: () => void;
};

/**
 * Component containing the right-side panel of the billing page.
 * Includes Customer management, Payment widgets, and Totals summary.
 */
export const BillingSidebar = ({
   checkoutData,
   subtotal,
   discount,
   discountAmount,
   total,
   itemsLength,
   isPaymentValid,
   isProcessing,
   onResetCustomer,
   onOpenClientSearch,
   onOpenDiscount,
   onDiscard,
   onProcessPayment,
}: BillingSidebarProps) => {
   return (
      <aside className="w-full lg:w-[340px] lg:shrink-0 flex flex-col h-[600px] lg:h-full lg:max-h-full pr-1 overflow-hidden relative">
         <div className="flex flex-col gap-4 w-full h-full">
            {/* CLIENT SECTION */}
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-sm flex flex-col h-auto shrink-0">
               <div className="py-3 px-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
                  <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">
                     Cliente
                  </h2>
                  {checkoutData.customer.id && (
                     <button
                        onClick={onResetCustomer}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer p-1"
                        title="Desvincular cliente"
                     >
                        <HiX size={16} />
                     </button>
                  )}
               </div>
               <div className="p-4 h-auto">
                  {!checkoutData.customer.id ? (
                     <button
                        onClick={onOpenClientSearch}
                        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950/50 border border-zinc-800 border-dashed rounded-xl text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group cursor-pointer"
                     >
                        <span className="text-sm font-medium">Asociar Cliente</span>
                        <div className="flex items-center gap-2">
                           <kbd className="hidden sm:inline-flex text-[10px] items-center justify-center font-mono bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                              C
                           </kbd>
                           <HiOutlinePlus size={16} />
                        </div>
                     </button>
                  ) : (
                     <CustomerBadge
                        name={checkoutData.customer.name}
                        taxId={checkoutData.customer.taxId}
                        email={checkoutData.customer.email}
                        phone={checkoutData.customer.phone}
                        address={checkoutData.customer.address}
                        city={checkoutData.customer.city}
                        accountBalance={checkoutData.customer.accountBalance}
                     />
                  )}
               </div>
            </div>

            {/* PAYMENTS & TOTALS */}
            <div className="flex flex-col md:flex-row lg:flex-col gap-4 w-full h-auto flex-1 lg:overflow-y-auto lg:custom-scrollbar pb-4 min-h-0">
               <div className="w-full shrink-0">
                  <SplitPaymentWidget total={total} />
               </div>
               <div className="w-full shrink-0">
                  <BillingTotals
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
            </div>

            {/* LEGEND */}
            <div className="mt-4 px-2 grid grid-cols-3 gap-2 text-xs text-zinc-600 text-center uppercase tracking-wide opacity-75 shrink-0">
               <div>
                  <span className="font-bold text-zinc-500">C</span> Cliente
               </div>
               <div>
                  <span className="font-bold text-zinc-500">D</span> Descuento
               </div>
               <div>
                  <span className="font-bold text-zinc-500">X</span> Limpiar
               </div>
            </div>
         </div>
      </aside>
   );
};
