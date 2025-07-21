import { useState, useMemo, useCallback, useEffect } from 'react';

// Components
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { CustomerSearchModal } from '../components/billing/CustomerSearchModal';
import { CustomerHeader } from '../components/billing/CustomerHeader';
import { DiscountModal } from '../components/billing/DiscountModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { ErrorModal } from '../components/ui/ErrorModal'; // Importamos el nuevo modal
import { PaymentWidget } from '../components/billing/PaymentWidget';
import { BillingTotals } from '../components/billing/BillingTotals';

// Store & Types
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

   const [modals, setModals] = useState({
      productSearch: false,
      customerSearch: false,
      discount: false,
      discardConfirm: false,
      success: false,
      error: false,
   });

   const [finalizedData, setFinalizedData] = useState<CheckoutState | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');

   const subtotal = useMemo(
      () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      [items],
   );

   const discountAmount = useMemo(() => {
      return discount.type === 'percentage'
         ? Math.round(subtotal * (discount.value / 100))
         : discount.value;
   }, [subtotal, discount]);

   const total = Math.max(0, subtotal - discountAmount);

   const cashReceived = useMemo(
      () => parseInt(checkoutData.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10),
      [checkoutData.cashReceivedStr],
   );

   const isPaymentValid =
      items.length > 0 &&
      (checkoutData.paymentMethod === 'transfer' ||
         cashReceived === 0 ||
         (checkoutData.paymentMethod === 'cash' && cashReceived >= total));

   // Handlers
   const toggleModal = useCallback((key: keyof typeof modals, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
   }, []);

   const handleProductSelect = (product: Partial<InvoiceItem>) => {
      addItem(product);
      toggleModal('productSearch', false);
   };

   const handleCustomerSelect = (customer: Partial<CheckoutState['customer']>) => {
      setCheckoutData({ customer: { ...checkoutData.customer, ...customer } });
      toggleModal('customerSearch', false);
   };

   const triggerDiscard = useCallback(() => {
      if (items.length > 0) toggleModal('discardConfirm', true);
   }, [items.length, toggleModal]);

   const handleProcessPayment = useCallback(async () => {
      if (!isPaymentValid || isProcessing) return;

      setIsProcessing(true);
      setErrorMessage('');

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

         if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error desconocido al procesar la venta');
         }

         setFinalizedData({ ...checkoutData });
         toggleModal('success', true);
      } catch (error) {
         console.error(error);
         setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
         toggleModal('error', true);
      } finally {
         setIsProcessing(false);
      }
   }, [
      isPaymentValid,
      isProcessing,
      checkoutData,
      items,
      subtotal,
      discountAmount,
      total,
      toggleModal,
   ]);

   const handleFinalizeSuccess = () => {
      resetInvoice();
      toggleModal('success', false);
      setFinalizedData(null);
   };

   // Keyboard Shortcuts
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
         const isAnyModalOpen = Object.values(modals).some(Boolean);

         if (isAnyModalOpen) return;

         if (!isInputFocused) {
            switch (event.code) {
               case 'Space':
                  event.preventDefault();
                  toggleModal('productSearch', true);
                  break;
               case 'KeyC':
                  event.preventDefault();
                  toggleModal('customerSearch', true);
                  break;
               case 'KeyD':
                  event.preventDefault();
                  toggleModal('discount', true);
                  break;
               case 'KeyX':
                  event.preventDefault();
                  triggerDiscard();
                  break;
            }
         }

         if (event.code === 'Enter' && !isInputFocused && isPaymentValid) {
            event.preventDefault();
            handleProcessPayment();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [modals, isPaymentValid, triggerDiscard, handleProcessPayment, toggleModal]);

   const finalizedCash = finalizedData
      ? parseInt(finalizedData.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10)
      : 0;
   const finalizedChange = finalizedData?.paymentMethod === 'cash' ? finalizedCash - total : -total;

   return (
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:max-h-screen">
         {/* 1. HEADER CLIENTE */}
         <CustomerHeader onSearchRequest={() => toggleModal('customerSearch', true)} />

         <div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden pb-2">
            {/* 2. TABLA DE PRODUCTOS */}
            <div className="h-[500px] lg:h-full flex-1 flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden min-h-0 shrink-0">
               <div className="flex-1 relative bg-zinc-900 h-full min-h-0">
                  <InvoiceTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
               </div>
            </div>

            {/* 3. SIDEBAR (TOTALES Y PAGO) */}
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
                     onOpenDiscount={() => toggleModal('discount', true)}
                     onDiscard={triggerDiscard}
                     onProcessPayment={handleProcessPayment}
                  />
               </div>

               {/* Leyenda de Atajos */}
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
            </aside>
         </div>

         {/* 4. MODALES */}
         <ProductSearchModal
            isOpen={modals.productSearch}
            onClose={() => toggleModal('productSearch', false)}
            onSelectProduct={handleProductSelect}
         />
         <CustomerSearchModal
            isOpen={modals.customerSearch}
            onClose={() => toggleModal('customerSearch', false)}
            onSelectCustomer={handleCustomerSelect}
         />
         <DiscountModal
            isOpen={modals.discount}
            onClose={() => toggleModal('discount', false)}
            onApply={setDiscount}
            currentDiscount={discount}
            subtotal={subtotal}
         />
         <ConfirmModal
            isOpen={modals.discardConfirm}
            onClose={() => toggleModal('discardConfirm', false)}
            onConfirm={resetInvoice}
            title="¿Descartar factura?"
            message="Eliminarás todos los productos agregados."
         />
         <PaymentSuccessModal
            isOpen={modals.success}
            onClose={handleFinalizeSuccess}
            total={total}
            paymentMethod={finalizedData?.paymentMethod || 'cash'}
            cashReceived={finalizedCash}
            change={Math.max(0, finalizedChange)}
         />
         <ErrorModal
            isOpen={modals.error}
            onClose={() => toggleModal('error', false)}
            message={errorMessage}
         />
      </div>
   );
};
