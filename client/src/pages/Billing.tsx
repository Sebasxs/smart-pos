import { useState, useMemo, useCallback, useEffect } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { CustomerSearchModal } from '../components/billing/CustomerSearchModal';
import { CustomerHeader } from '../components/billing/CustomerHeader';
import { DiscountModal } from '../components/billing/DiscountModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { PaymentWidget } from '../components/billing/PaymentWidget';
import { BillingTotals } from '../components/billing/BillingTotals';
import { useBillingStore, type CheckoutState } from '../store/billingStore';
import { type InvoiceItem } from '../types/billing';

const API_URL = import.meta.env.VITE_API_URL;

export const Billing = () => {
   const {
      items,
      discount,
      checkoutData,
      addItem,
      updateItem,
      removeItem,
      setDiscount,
      setCheckoutData,
      resetInvoice,
   } = useBillingStore();

   const [isProdSearchOpen, setIsProdSearchOpen] = useState(false);
   const [isCustSearchOpen, setIsCustSearchOpen] = useState(false);
   const [isDiscountOpen, setIsDiscountOpen] = useState(false);
   const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

   const [finalizedData, setFinalizedData] = useState<CheckoutState | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   const subtotal = useMemo(
      () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      [items],
   );

   const discountAmount = useMemo(() => {
      if (discount.type === 'percentage') {
         return Math.round(subtotal * (discount.value / 100));
      }
      return discount.value;
   }, [subtotal, discount]);

   const total = Math.max(0, subtotal - discountAmount);

   const cashReceived = parseInt(checkoutData.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);
   const isPaymentValid =
      items.length > 0 &&
      (checkoutData.paymentMethod === 'transfer' ||
         cashReceived === 0 ||
         (checkoutData.paymentMethod === 'cash' && cashReceived >= total));

   const handleProductSelect = (product: Partial<InvoiceItem>) => {
      addItem(product);
      setIsProdSearchOpen(false);
   };

   const handleCustomerSelect = (customer: Partial<CheckoutState['customer']>) => {
      setCheckoutData({ customer: { ...checkoutData.customer, ...customer } });
      setIsCustSearchOpen(false);
   };

   const triggerDiscard = useCallback(() => {
      if (items.length > 0) setIsDiscardConfirmOpen(true);
   }, [items.length]);

   const handleProcessPayment = useCallback(async () => {
      if (!isPaymentValid || isProcessing) return;

      setIsProcessing(true);
      try {
         const payload = {
            customer: checkoutData.customer,
            items: items.map(i => ({
               id: i.id.length === 36 ? i.id : null,
               name: i.name,
               price: i.price,
               quantity: i.quantity,
               originalPrice: i.originalPrice,
               discountPercentage: i.discountPercentage,
               isManualPrice: i.isManualPrice,
               isManualName: i.isManualName,
            })),
            paymentMethod: checkoutData.paymentMethod,
            subtotal,
            discount: discountAmount,
            total,
         };

         const res = await fetch(`${API_URL}/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error('Error al procesar venta');

         setFinalizedData({ ...checkoutData });
         setIsSuccessModalOpen(true);
      } catch (error) {
         console.error(error);
         alert('Hubo un error al procesar la venta');
      } finally {
         setIsProcessing(false);
      }
   }, [isPaymentValid, isProcessing, checkoutData, items, subtotal, discountAmount, total]);

   const handleFinalizeSuccess = () => {
      resetInvoice();
      setIsSuccessModalOpen(false);
      setFinalizedData(null);
   };

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
         const isModalOpen =
            isProdSearchOpen || isCustSearchOpen || isDiscountOpen || isDiscardConfirmOpen;

         if (isModalOpen) return;

         if (event.code === 'Space' && !isInputFocused) {
            event.preventDefault();
            setIsProdSearchOpen(true);
         }

         if ((event.code === 'KeyC' || event.key === 'c') && !isInputFocused) {
            event.preventDefault();
            setIsCustSearchOpen(true);
         }

         if ((event.code === 'KeyD' || event.key === 'd') && !isInputFocused) {
            event.preventDefault();
            setIsDiscountOpen(true);
         }

         if ((event.code === 'KeyX' || event.key === 'x') && !isInputFocused) {
            event.preventDefault();
            triggerDiscard();
         }

         if (event.code === 'Enter' && !isInputFocused) {
            event.preventDefault();
            if (isPaymentValid) handleProcessPayment();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [
      isProdSearchOpen,
      isCustSearchOpen,
      isDiscountOpen,
      isDiscardConfirmOpen,
      isPaymentValid,
      triggerDiscard,
      handleProcessPayment,
   ]);

   return (
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:max-h-screen">
         <CustomerHeader onSearchRequest={() => setIsCustSearchOpen(true)} />

         <div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden pb-2">
            {/* Tabla */}
            <div className="h-[500px] lg:h-full flex-1 flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden min-h-0 shrink-0">
               <div className="flex-1 relative bg-zinc-900 h-full min-h-0">
                  <InvoiceTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
               </div>
            </div>

            {/* Sidebar derecha */}
            {/* CAMBIO: lg:w-[340px] para hacer el sidebar más angosto en desktop */}
            <aside className="w-full lg:w-[340px] lg:shrink-0 flex flex-col h-fit lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-1">
               <div className="flex flex-col md:flex-row lg:flex-col gap-3 w-full shrink-0">
                  <div className="w-full md:flex-1">
                     <PaymentWidget total={total} />
                  </div>

                  <BillingTotals
                     subtotal={subtotal}
                     discount={discount}
                     discountAmount={discountAmount}
                     total={total}
                     isPaymentValid={isPaymentValid}
                     isProcessing={isProcessing}
                     onOpenDiscount={() => setIsDiscountOpen(true)}
                     onDiscard={triggerDiscard}
                     onProcessPayment={handleProcessPayment}
                  />
               </div>

               <div className="mt-4 px-2 grid grid-cols-3 gap-2 text-xs text-zinc-600 font-bold text-center uppercase tracking-wide opacity-75 shrink-0">
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
            </aside>
         </div>

         <ProductSearchModal
            isOpen={isProdSearchOpen}
            onClose={() => setIsProdSearchOpen(false)}
            onSelectProduct={handleProductSelect}
         />
         <CustomerSearchModal
            isOpen={isCustSearchOpen}
            onClose={() => setIsCustSearchOpen(false)}
            onSelectCustomer={handleCustomerSelect}
         />
         <DiscountModal
            isOpen={isDiscountOpen}
            onClose={() => setIsDiscountOpen(false)}
            onApply={setDiscount}
            currentDiscount={discount}
            subtotal={subtotal}
         />
         <ConfirmModal
            isOpen={isDiscardConfirmOpen}
            onClose={() => setIsDiscardConfirmOpen(false)}
            onConfirm={resetInvoice}
            title="¿Descartar factura?"
            message="Eliminarás todos los productos agregados."
         />
         <PaymentSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={handleFinalizeSuccess}
            total={total}
            paymentMethod={finalizedData?.paymentMethod || 'cash'}
            cashReceived={
               parseInt(finalizedData?.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10) || 0
            }
            change={
               (finalizedData?.paymentMethod === 'cash'
                  ? parseInt(finalizedData?.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10)
                  : 0) - total
            }
         />
      </div>
   );
};
