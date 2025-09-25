import { useState, useMemo } from 'react';
import { HiOutlineComputerDesktop } from 'react-icons/hi2';
import { CgSpinner } from 'react-icons/cg';

// Components
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ShiftOpeningScreen } from '../components/billing/ShiftOpeningScreen';
import { BillingModalsWrapper } from '../components/billing/BillingModalsWrapper';
import { BillingSidebar } from '../components/billing/BillingSidebar';

// Stores & Hooks
import { useBillingStore } from '../store/billingStore';
import { useCashShiftStore } from '../store/cashShiftStore';
import { useBillingPayment } from '../hooks/useBillingPayment';
import { useBillingModals } from '../hooks/useBillingModals';
import { useBillingHotkeys } from '../hooks/useBillingHotKeys';

export const Billing = () => {
   // Global Store
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
      addPayment,
      updatePayment,
   } = useBillingStore();

   const { isOpen, loading: shiftLoading } = useCashShiftStore();

   // Local Hooks
   const { modals, toggleModal } = useBillingModals();

   // Local State
   const [createClientName, setCreateClientName] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

   // Calculations
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

   const totalPaid = useMemo(
      () => checkoutData.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      [checkoutData.payments],
   );

   const isPaymentValid =
      items.length > 0 && totalPaid >= total && checkoutData.payments.length > 0;

   // Payment Logic Hook
   const {
      processPayment,
      isProcessing,
      generatedInvoiceId,
      generatedInvoiceNumber,
      finalizedPayments,
      resetPaymentState,
   } = useBillingPayment({
      onSuccess: () => toggleModal('success', true),
      onError: msg => {
         setErrorMessage(msg);
         toggleModal('error', true);
      },
   });

   // --- Handlers ---

   const handleProductSelect = (product: any) => {
      addItem(product);
      toggleModal('productSearch', false);
   };

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
      toggleModal('clientSearch', false);
   };

   const handleRequestCreateClient = (name: string) => {
      setCreateClientName(name);
      toggleModal('clientCreate', true);
      toggleModal('clientSearch', false);
   };

   const handleClientCreated = (client: any) => {
      handleClientSelect(client);
      toggleModal('clientCreate', false);
   };

   const handleFinalizeSuccess = () => {
      resetInvoice();
      resetPaymentState();
      toggleModal('success', false);
   };

   const handlePaymentProcess = () => {
      if (isPaymentValid && !isProcessing) {
         processPayment(subtotal, discountAmount, total);
      }
   };

   const handleSmartEnter = () => {
      // Smart enter: add full cash payment or update it automatically
      const { payments } = checkoutData;
      if (payments.length === 0) {
         addPayment('cash', total);
      } else if (payments.length === 1 && payments[0].method === 'cash') {
         if (Math.abs((payments[0].amount || 0) - total) > 0.01) {
            updatePayment(payments[0].id, total);
         }
      }
   };

   // --- Hotkeys ---
   useBillingHotkeys({
      modals,
      itemsLength: items.length,
      isPaymentValid,
      onProductSearch: () => toggleModal('productSearch', true),
      onClientSearch: () => toggleModal('clientSearch', true),
      onDiscount: () => toggleModal('discount', true),
      onDiscard: () => toggleModal('discardConfirm', true),
      onProcessPayment: handlePaymentProcess,
      onSmartEnter: handleSmartEnter,
   });

   // --- Render ---

   if (shiftLoading && !isOpen) {
      return (
         <div className="flex h-full w-full items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-3">
               <CgSpinner className="h-8 w-8 animate-spin text-blue-500" />
               <p className="text-sm text-zinc-500 font-medium">Verificando turno de caja...</p>
            </div>
         </div>
      );
   }

   if (!isOpen) {
      return <ShiftOpeningScreen />;
   }

   return (
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:max-h-screen">
         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-end justify-between relative">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <HiOutlineComputerDesktop size={24} />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-white">Facturar</h1>
                  <p className="text-zinc-400">Punto de venta</p>
               </div>
            </div>
         </div>

         {/* MAIN CONTENT */}
         <div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0 lg:overflow-hidden pb-2">
            {/* PRODUCT TABLE */}
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

            {/* SIDEBAR COMPONENT */}
            <BillingSidebar
               checkoutData={checkoutData}
               subtotal={subtotal}
               discount={discount}
               discountAmount={discountAmount}
               total={total}
               itemsLength={items.length}
               isPaymentValid={isPaymentValid}
               isProcessing={isProcessing}
               onResetCustomer={resetCustomer}
               onOpenClientSearch={() => toggleModal('clientSearch', true)}
               onOpenDiscount={() => toggleModal('discount', true)}
               onDiscard={() => toggleModal('discardConfirm', true)}
               onProcessPayment={handlePaymentProcess}
            />
         </div>

         {/* MODALS WRAPPER */}
         <BillingModalsWrapper
            modals={modals}
            toggleModal={toggleModal}
            handlers={{
               onSelectProduct: handleProductSelect,
               onSelectClient: handleClientSelect,
               onCreateClientRequest: handleRequestCreateClient,
               onClientCreated: handleClientCreated,
               onDiscountApply: setDiscount,
               onDiscardConfirm: resetInvoice,
               onSuccessClose: handleFinalizeSuccess,
            }}
            data={{
               createClientName,
               discount,
               subtotal,
               total,
               finalizedPayments,
               generatedInvoiceNumber,
               generatedInvoiceId,
               errorMessage,
            }}
         />
      </div>
   );
};
