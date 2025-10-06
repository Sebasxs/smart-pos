import { useMemo, useState } from 'react';
import { HiOutlineUserPlus, HiXMark } from 'react-icons/hi2';
import { Spinner } from '../components/ui/Spinner';

// Components
import { PageHeader } from '../components/layout/PageHeader';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ShiftOpeningScreen } from '../components/billing/ShiftOpeningScreen';
import { BillingModalsWrapper } from '../components/billing/BillingModalsWrapper';
import { CheckoutSidebar } from '../components/billing/CheckoutSidebar';
import { ShortcutLegend } from '../components/billing/ShortcutLegend';
import { Button } from '../components/ui/Button';

// Logic & State
import { useBillingStore } from '../store/billingStore';
import { useCashShiftStore } from '../store/cashShiftStore';
import { useBillingPayment } from '../hooks/useBillingPayment';
import { useBillingModals } from '../hooks/useBillingModals';
import { useBillingHotkeys } from '../hooks/useBillingHotKeys';
import { calculateInvoiceTotals, isPaymentSufficient } from '../utils/calculation';

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
      addPayment,
      updatePayment,
   } = useBillingStore();

   const { isOpen, loading: shiftLoading } = useCashShiftStore();
   const { modals, toggleModal } = useBillingModals();
   const [createClientName, setCreateClientName] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

   // Calculated values
   const { subtotal, discountAmount, total } = useMemo(
      () => calculateInvoiceTotals(items, discount),
      [items, discount],
   );

   const totalPaid = useMemo(
      () => checkoutData.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      [checkoutData.payments],
   );

   const isPaymentValid =
      items.length > 0 && isPaymentSufficient(totalPaid, total) && checkoutData.payments.length > 0;

   // Payment hook
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

   // Handlers
   const handleProductSelect = (p: any) => {
      addItem(p);
      toggleModal('productSearch', false);
   };

   const handleClientSelect = (c: any) => {
      setCheckoutData({
         customer: {
            id: c.id,
            name: c.name,
            email: c.email || '',
            taxId: c.tax_id || '',
            documentType: c.document_type || '31',
            phone: c.phone || '',
            city: c.city || '',
            address: c.address || '',
            accountBalance: c.account_balance || 0,
         },
      });
      toggleModal('clientSearch', false);
   };

   const handleRequestCreateClient = (name: string) => {
      setCreateClientName(name);
      toggleModal('clientCreate', true);
      toggleModal('clientSearch', false);
   };
   const handleClientCreated = (c: any) => {
      handleClientSelect(c);
      toggleModal('clientCreate', false);
   };

   const handleFinalizeSuccess = () => {
      resetInvoice();
      resetPaymentState();
      toggleModal('success', false);
   };

   const handlePaymentProcess = () => {
      if (isPaymentValid && !isProcessing) processPayment(subtotal, discountAmount, total);
   };

   const handleSmartEnter = () => {
      const { payments } = checkoutData;
      if (payments.length === 0) {
         addPayment('cash', total);
      } else if (payments.length === 1 && payments[0].method === 'cash') {
         if (Math.abs((payments[0].amount || 0) - total) > 0.01) {
            updatePayment(payments[0].id, total);
         }
      }
   };

   // Hotkeys
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

   if (shiftLoading && !isOpen) {
      return (
         <div className="flex h-full w-full items-center justify-center bg-canvas gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-text-dim font-medium">Verificando turno de caja...</p>
         </div>
      );
   }

   if (!isOpen) return <ShiftOpeningScreen />;

   return (
      <div className="flex flex-col w-full h-full bg-canvas overflow-hidden">
         <PageHeader
            title="Facturar"
            // Search slot for Client Selector
            search={
               <div className="w-full flex items-center justify-start md:justify-center">
                  {!checkoutData.customer.id ? (
                     <Button
                        variant="secondary"
                        onClick={() => toggleModal('clientSearch', true)}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-highlight/60 hover:bg-surface-active text-text-secondary hover:text-text-main rounded-xl border-none outline-none w-full md:w-auto justify-start md:justify-center h-10"
                     >
                        <HiOutlineUserPlus
                           size={18}
                           className="text-text-dim group-hover:text-primary-text transition-colors"
                        />
                        <span className="text-sm font-semibold">Seleccionar Cliente</span>
                     </Button>
                  ) : (
                     <div
                        onClick={() => toggleModal('clientSearch', true)}
                        className="flex items-center bg-surface-highlight/60 hover:bg-surface-active rounded-xl px-3 py-1.5 gap-3 transition-all cursor-pointer group animate-in fade-in zoom-in duration-300 w-full md:w-auto h-10 border border-transparent hover:border-border-hover"
                     >
                        <div className="flex flex-col leading-tight min-w-0">
                           <span className="text-[9px] font-bold text-text-dim uppercase tracking-tighter group-hover:text-primary-text transition-colors">
                              Cliente
                           </span>
                           <span className="text-sm font-bold text-text-main truncate max-w-[150px]">
                              {checkoutData.customer.name}
                           </span>
                        </div>
                        <div className="h-5 w-px bg-border/40" />
                        <div className="flex flex-col leading-tight">
                           <span className="text-[9px] font-medium text-text-dim uppercase">
                              ID
                           </span>
                           <span className="text-xs font-mono text-text-secondary">
                              {checkoutData.customer.taxId}
                           </span>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={e => {
                              e.stopPropagation();
                              resetCustomer();
                           }}
                           className="ml-1 h-7 w-7 hover:bg-danger-bg hover:text-danger-text p-0 rounded-lg"
                           title="Quitar cliente"
                        >
                           <HiXMark size={14} />
                        </Button>
                     </div>
                  )}
               </div>
            }
            // Info Slot
            info={
               <>
                  <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest border-r border-border/20 pr-3 mr-3">
                     Sede principal
                  </span>
                  <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest">
                     Caja 01
                  </span>
               </>
            }
         />

         <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 min-h-0 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-4 flex-1 lg:overflow-hidden">
               <div className="flex-1 flex flex-col bg-surface rounded-2xl shadow-sm overflow-hidden min-h-0">
                  <InvoiceTable
                     items={items}
                     onUpdateItem={updateItem}
                     onRemoveItem={removeItem}
                     onAddProductClick={() => toggleModal('productSearch', true)}
                  />
               </div>
               <CheckoutSidebar
                  subtotal={subtotal}
                  discount={discount}
                  discountAmount={discountAmount}
                  total={total}
                  itemsLength={items.length}
                  isPaymentValid={isPaymentValid}
                  isProcessing={isProcessing}
                  onOpenDiscount={() => toggleModal('discount', true)}
                  onDiscard={() => toggleModal('discardConfirm', true)}
                  onProcessPayment={handlePaymentProcess}
               />
            </div>
            <ShortcutLegend />
         </main>

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
