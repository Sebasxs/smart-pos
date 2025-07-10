import { useState, useMemo, useCallback, useEffect } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { CustomerSearchModal } from '../components/billing/CustomerSearchModal';
import { CustomerHeader } from '../components/billing/CustomerHeader';
import { DiscountModal } from '../components/billing/DiscountModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { PaymentWidget } from '../components/billing/PaymentWidget';
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

   // Modales
   const [isProdSearchOpen, setIsProdSearchOpen] = useState(false);
   const [isCustSearchOpen, setIsCustSearchOpen] = useState(false);
   const [isDiscountOpen, setIsDiscountOpen] = useState(false);
   const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

   const [finalizedData, setFinalizedData] = useState<CheckoutState | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   // Cálculos Financieros
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

   // Validaciones
   const cashReceived = parseInt(checkoutData.cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);
   const isPaymentValid =
      items.length > 0 &&
      (checkoutData.paymentMethod === 'transfer' ||
         cashReceived === 0 ||
         (checkoutData.paymentMethod === 'cash' && cashReceived >= total));

   // Handlers
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

   // Shortcuts
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
      // Cambio: Se eliminaron clases de overflow hidden y altura fija en desktop (lg:h-full)
      // Ahora permite scroll global en toda la página Billing
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:overflow-hidden">
         <CustomerHeader onSearchRequest={() => setIsCustSearchOpen(true)} />

         <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
            {/* 
                Cambio: Se eliminó min-h-[500px].
                Ahora es h-fit para ajustarse al contenido de la InvoiceTable.
                min-h-0 permite que el flexbox no fuerce alturas extrañas.
            */}
            <div className="flex-1 h-fit lg:h-full flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
               <div className="flex-1 relative bg-zinc-900">
                  <InvoiceTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
               </div>
            </div>

            <aside className="w-full lg:w-80 lg:shrink-0 flex flex-col h-fit">
               <PaymentWidget total={total} />

               <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-xl">
                  <div className="flex flex-col gap-y-3 text-sm mb-5">
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
                           Subtotal
                        </span>
                        <span className="font-bold text-zinc-200 text-base">
                           ${subtotal.toLocaleString('es-CO')}
                        </span>
                     </div>

                     <div className="flex justify-between items-center">
                        <button
                           onClick={() => setIsDiscountOpen(true)}
                           className="text-blue-400 hover:text-blue-300 underline decoration-dotted cursor-pointer font-bold text-xs uppercase tracking-wider hover:bg-blue-500/10 px-1 -ml-1 rounded transition-colors text-left"
                        >
                           Descuento
                        </button>
                        <div className="flex items-center gap-2">
                           <span className="text-zinc-500 text-[10px] font-medium">
                              {discount.type === 'percentage' ? `(${discount.value}%)` : '(-$)'}
                           </span>
                           <span
                              className={`font-bold text-base ${
                                 discountAmount > 0 ? 'text-red-400' : 'text-zinc-200'
                              }`}
                           >
                              -${discountAmount.toLocaleString('es-CO')}
                           </span>
                        </div>
                     </div>

                     <div className="pt-3 mt-1 border-t border-zinc-800 flex justify-between items-center">
                        <span className="text-lg font-black text-white uppercase tracking-tight">
                           Total
                        </span>
                        <span className="text-3xl font-black text-white tracking-tight">
                           ${total.toLocaleString('es-CO')}
                        </span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button
                        onClick={triggerDiscard}
                        className="p-3 rounded-xl bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-zinc-400 transition-colors cursor-pointer border border-transparent hover:border-red-900/50"
                        title="Descartar (X)"
                     >
                        <HiOutlineTrash size={20} />
                     </button>
                     <button
                        onClick={handleProcessPayment}
                        disabled={!isPaymentValid || isProcessing}
                        className={`
                           flex-1 font-bold py-3 rounded-xl text-base
                           transition-all shadow-lg flex justify-center items-center gap-2
                           ${
                              isPaymentValid && !isProcessing
                                 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                                 : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                           }
                        `}
                     >
                        <span>{isProcessing ? '...' : 'Confirmar'}</span>
                     </button>
                  </div>
               </div>

               <div className="mt-4 px-2 grid grid-cols-3 gap-2 text-[11px] text-zinc-600 font-bold text-center uppercase tracking-wide opacity-75">
                  <div>
                     <span className="font-bold text-zinc-500">C</span> Cliente
                  </div>
                  <div>
                     <span className="font-bold text-zinc-500">X</span> Limpiar
                  </div>
                  <div>
                     <span className="font-bold text-zinc-500">Enter</span> Pagar
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
