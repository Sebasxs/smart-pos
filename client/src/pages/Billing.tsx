import { useState, useMemo, useCallback, useEffect } from 'react';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';

// Components
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { ClientCombobox } from '../components/billing/ClientCombobox';
import { ClientBadge } from '../components/billing/ClientBadge';
import { CreateClientModal } from '../components/billing/CreateClientModal';
import { DiscountModal } from '../components/billing/DiscountModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { ErrorModal } from '../components/ui/ErrorModal';
import { SplitPaymentWidget } from '../components/billing/SplitPaymentWidget';
import { BillingTotals } from '../components/billing/BillingTotals';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';

// Types
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
      resetCustomer,
      resetInvoice,
   } = useBillingStore();
   const { decreaseStockBatch } = useInventoryStore();
   const { updateCustomerAfterPurchase } = useCustomerStore();

   const [modals, setModals] = useState({
      productSearch: false,
      clientCreate: false,
      discount: false,
      discardConfirm: false,
      success: false,
      error: false,
   });

   const [searchInputValue, setSearchInputValue] = useState('');
   const [createClientName, setCreateClientName] = useState('');
   const [finalizedData, setFinalizedData] = useState<CheckoutState | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [generatedInvoiceId, setGeneratedInvoiceId] = useState<number | undefined>(undefined);
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

   // Check if payments are valid
   const totalPaid = useMemo(
      () => checkoutData.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      [checkoutData.payments],
   );

   const isPaymentValid =
      items.length > 0 && totalPaid >= total && checkoutData.payments.length > 0;

   const toggleModal = useCallback((key: keyof typeof modals, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
   }, []);

   const handleProductSelect = (product: Partial<InvoiceItem>) => {
      addItem(product);
      toggleModal('productSearch', false);
   };

   const triggerDiscard = useCallback(() => {
      if (items.length > 0) toggleModal('discardConfirm', true);
   }, [items.length, toggleModal]);

   const handleClientSelect = (client: any) => {
      setCheckoutData({
         customer: {
            id: client.id,
            name: client.name,
            email: client.email || '',
            taxId: client.tax_id || '',
            documentType: client.document_type || '31',
            phone: client.phone || '',
            city: client.city || '',
            address: client.address || '',
            accountBalance: client.account_balance || 0,
         },
      });
      setSearchInputValue(client.name);
   };

   const handleClientCreated = (client: any) => {
      handleClientSelect(client);
      toggleModal('clientCreate', false);
   };

   const handleRequestCreateClient = (name: string) => {
      setCreateClientName(name);
      toggleModal('clientCreate', true);
   };

   const handleRemoveClient = () => {
      resetCustomer();
      setSearchInputValue('');
   };

   const handlePaymentProcess = useCallback(async () => {
      if (!isPaymentValid || isProcessing) return;

      setIsProcessing(true);
      setErrorMessage('');

      try {
         const payload = {
            customer: checkoutData.customer,
            items: items.map(i => ({
               id: i.isDatabaseItem ? i.id : null,
               description: i.description,
               price: i.price,
               quantity: i.quantity,
               originalPrice: i.originalPrice,
               discountPercentage: i.discountPercentage,
               isPriceEdited: i.isPriceEdited,
               isDescriptionEdited: i.isDescriptionEdited,
            })),
            payments: checkoutData.payments.map(p => ({
               method: p.method,
               amount: p.amount || 0,
               reference_code: null,
            })),
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

         const responseData = await res.json();

         decreaseStockBatch(
            items.filter(i => i.isDatabaseItem).map(i => ({ id: i.id, quantity: i.quantity })),
         );

         if (checkoutData.customer.id) {
            updateCustomerAfterPurchase(checkoutData.customer.id, total, new Date().toISOString());
         }

         setFinalizedData({ ...checkoutData });
         setGeneratedInvoiceId(responseData.invoiceId);
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
      decreaseStockBatch,
      updateCustomerAfterPurchase,
   ]);

   const handleFinalizeSuccess = () => {
      resetInvoice();
      setSearchInputValue('');
      toggleModal('success', false);
      setFinalizedData(null);
      setGeneratedInvoiceId(undefined);
   };

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
                  document.getElementById('client-search-input')?.focus();
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
            handlePaymentProcess();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [modals, isPaymentValid, triggerDiscard, handlePaymentProcess, toggleModal]);

   // Calculate finalized payment info for success modal
   const finalizedCashPayment = finalizedData?.payments.find(p => p.method === 'cash');
   const finalizedCashAmount = finalizedCashPayment?.amount || 0;
   const finalizedChange =
      finalizedCashPayment && finalizedCashAmount > total ? finalizedCashAmount - total : 0;

   return (
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:max-h-screen p-4">
         {/* PAGE HEADER WITH CLIENT SEARCH */}
         <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <HiOutlineComputerDesktop size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white">Facturar</h1>
                  <p className="text-zinc-400">Punto de venta</p>
               </div>
            </div>

            {/* Client Search / Badge */}
            <div className="flex items-center gap-3">
               {!checkoutData.customer.id ? (
                  <div className="w-80">
                     <ClientCombobox
                        id="client-search-input"
                        value={searchInputValue}
                        onChange={setSearchInputValue}
                        onSelectCustomer={handleClientSelect}
                        onRequestCreate={handleRequestCreateClient}
                        placeholder="Buscar cliente..."
                     />
                  </div>
               ) : (
                  <ClientBadge
                     name={checkoutData.customer.name}
                     accountBalance={checkoutData.customer.accountBalance}
                     onRemove={handleRemoveClient}
                  />
               )}
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden pb-2">
            {/* 2. TABLA DE PRODUCTOS */}
            <div className="h-[500px] lg:h-full flex-1 flex flex-col bg-zinc-900/50 rounded-xl border border-zinc-800 shadow-sm overflow-hidden min-h-0 shrink-0">
               <div className="flex-1 relative bg-zinc-900/50 h-full min-h-0">
                  <InvoiceTable
                     items={items}
                     onUpdateItem={updateItem}
                     onRemoveItem={removeItem}
                     onAddProductClick={() => toggleModal('productSearch', true)}
                  />
               </div>
            </div>

            {/* 3. RESUMEN */}
            <aside className="w-full lg:w-[340px] lg:shrink-0 flex flex-col h-fit lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-1">
               <div className="flex flex-col md:flex-row lg:flex-col gap-3 w-full shrink-0">
                  <div className="w-full md:flex-1">
                     <SplitPaymentWidget total={total} />
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
                     onProcessPayment={handlePaymentProcess}
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

         <CreateClientModal
            isOpen={modals.clientCreate}
            onClose={() => toggleModal('clientCreate', false)}
            initialName={createClientName}
            onClientCreated={handleClientCreated}
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
            paymentMethod={finalizedData?.payments[0]?.method || 'cash'}
            cashReceived={finalizedCashAmount}
            change={Math.max(0, finalizedChange)}
            invoiceId={generatedInvoiceId}
         />
         <ErrorModal
            isOpen={modals.error}
            onClose={() => toggleModal('error', false)}
            message={errorMessage}
         />
      </div>
   );
};
