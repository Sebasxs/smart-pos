import { useState, useMemo, useCallback, useEffect } from 'react';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { type InvoiceItem } from '../types/billing';
import { HiOutlineTrash } from 'react-icons/hi2';
import { DiscountModal } from '../components/billing/DiscountModal';
import { BillingTopbar } from '../components/billing/BillingTopbar';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { CheckoutModal, type CheckoutData } from '../components/billing/CheckoutModal';
import { useBillingStore } from '../store/billingStore';

export const Billing = () => {
   const { items, discount, addItem, updateItem, removeItem, setDiscount, resetInvoice } =
      useBillingStore();

   // --- Estados de UI (Modales) ---
   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
   const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
   const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
   const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

   // Datos temporales para la finalización (se llenan en el CheckoutModal)
   const [finalizedData, setFinalizedData] = useState<CheckoutData | null>(null);

   // --- Cálculos Financieros ---
   const subtotal = useMemo(() => {
      return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
   }, [items]);

   const discountAmount = useMemo(() => {
      if (discount.type === 'percentage') {
         return Math.round(subtotal * (discount.value / 100));
      }
      return discount.value;
   }, [subtotal, discount]);

   const total = subtotal - discountAmount;

   const formatCurrency = (val: number) => val.toLocaleString('es-CO');

   const handleProductSelect = (product: Partial<InvoiceItem>) => {
      addItem(product);
      setIsSearchModalOpen(false);
   };

   const triggerDiscard = useCallback(() => {
      if (items.length > 0) {
         setIsDiscardConfirmOpen(true);
      }
   }, [items.length]);

   const triggerCheckout = useCallback(() => {
      if (items.length === 0) return;
      setIsCheckoutModalOpen(true);
   }, [items]);

   const handleConfirmCheckout = (data: CheckoutData) => {
      console.log('Guardando factura...', {
         items,
         financials: { subtotal, discount: discountAmount, total },
         ...data,
      });

      setFinalizedData(data);
      setIsSuccessModalOpen(true);
   };

   const handleFinalizeSuccess = () => {
      resetInvoice();
      setIsSuccessModalOpen(false);
   };

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
         const isModalOpen =
            isSearchModalOpen ||
            isDiscountModalOpen ||
            isDiscardConfirmOpen ||
            isSuccessModalOpen ||
            isCheckoutModalOpen;

         if (isModalOpen) return;

         if (event.code === 'Space' && !isInputFocused) {
            event.preventDefault();
            setIsSearchModalOpen(true);
         }

         if (event.code === 'KeyE' && !isInputFocused) {
            event.preventDefault();
            triggerDiscard();
         }

         if (event.code === 'Enter' && !isInputFocused) {
            event.preventDefault();
            triggerCheckout();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [
      triggerDiscard,
      triggerCheckout,
      isSearchModalOpen,
      isDiscountModalOpen,
      isDiscardConfirmOpen,
      isSuccessModalOpen,
      isCheckoutModalOpen,
   ]);

   return (
      <div className="relative w-full h-full flex flex-col gap-4">
         <BillingTopbar total={total} />

         {/* Main Layout */}
         <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            {/* Area de Productos (Izquierda) */}
            <div className="flex-1 h-fit h-fit flex flex-col">
               <InvoiceTable items={items} onUpdateItem={updateItem} onRemoveItem={removeItem} />
            </div>

            {/* Barra Lateral (Derecha - Resumen y Acciones) */}
            <aside className="w-full lg:w-80 flex flex-col h-fit sticky top-0">
               <div className="bg-zinc-800 rounded-lg p-4 shrink-0 border border-zinc-700/50 shadow-xl">
                  <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">
                     Resumen
                  </h2>

                  {/* Desglose Financiero */}
                  <div className="flex flex-col gap-y-3 text-sm mb-4">
                     <div className="flex justify-between">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="font-semibold text-zinc-200">
                           ${formatCurrency(subtotal)}
                        </span>
                     </div>

                     <div className="flex justify-between items-center">
                        <button
                           onClick={() => setIsDiscountModalOpen(true)}
                           className="text-blue-400 hover:text-blue-300 underline decoration-dotted cursor-pointer font-medium hover:bg-blue-500/10 px-1 -ml-1 rounded transition-colors"
                        >
                           Descuento
                        </button>
                        <div className="flex items-center gap-2">
                           <span className="text-zinc-500 text-xs">
                              {discount.type === 'percentage' ? `(${discount.value}%)` : '(-$)'}
                           </span>
                           <span
                              className={`font-semibold ${
                                 discountAmount > 0 ? 'text-red-400' : 'text-zinc-200'
                              }`}
                           >
                              -${formatCurrency(discountAmount)}
                           </span>
                        </div>
                     </div>

                     <hr className="border-zinc-700 mt-1" />
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3">
                     <button
                        onClick={triggerDiscard}
                        className="p-4 rounded-xl bg-zinc-700 hover:bg-red-600/60 hover:text-white text-zinc-400 transition-colors cursor-pointer border border-transparent hover:border-red-900/50"
                        title="Eliminar factura (E)"
                     >
                        <HiOutlineTrash size={22} />
                     </button>
                     <button
                        onClick={triggerCheckout}
                        disabled={items.length === 0}
                        className="
                           flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl 
                           transition-all shadow-lg shadow-blue-900/20 cursor-pointer flex justify-center items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
                           hover:scale-[1.02] active:scale-[0.98]
                        "
                        title="Cobrar (Enter)"
                     >
                        <span className="text-lg">Cobrar</span>
                     </button>
                  </div>
               </div>
            </aside>
         </div>

         {/* --- Modales --- */}

         <ProductSearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelectProduct={handleProductSelect}
         />

         <DiscountModal
            isOpen={isDiscountModalOpen}
            onClose={() => setIsDiscountModalOpen(false)}
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

         <CheckoutModal
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            onConfirm={handleConfirmCheckout}
            total={total}
         />

         <PaymentSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={handleFinalizeSuccess}
            total={total}
            paymentMethod={finalizedData?.paymentMethod || 'cash'}
            cashReceived={finalizedData?.cashReceived || 0}
            change={finalizedData?.change || 0}
         />
      </div>
   );
};
