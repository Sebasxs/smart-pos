import { useMemo, useState } from 'react';
import { HiOutlineUserPlus, HiXMark } from 'react-icons/hi2';
import { CgSpinner } from 'react-icons/cg';

// Components
import { PageHeader } from '../components/layout/PageHeader';
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ShiftOpeningScreen } from '../components/billing/ShiftOpeningScreen';
import { BillingModalsWrapper } from '../components/billing/BillingModalsWrapper';
import { CheckoutSidebar } from '../components/billing/CheckoutSidebar';
import { ShortcutLegend } from '../components/billing/ShortcutLegend';
import { Button } from '../components/ui/Button';

// Stores & Hooks
import { useBillingStore } from '../store/billingStore';
import { useCashShiftStore } from '../store/cashShiftStore';
import { useBillingPayment } from '../hooks/useBillingPayment';
import { useBillingModals } from '../hooks/useBillingModals';
import { useBillingHotkeys } from '../hooks/useBillingHotKeys';

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
      const { payments } = checkoutData;
      if (payments.length === 0) {
         addPayment('cash', total);
      } else if (payments.length === 1 && payments[0].method === 'cash') {
         if (Math.abs((payments[0].amount || 0) - total) > 0.01) {
            updatePayment(payments[0].id, total);
         }
      }
   };

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
         <div className="flex h-full w-full items-center justify-center bg-canvas">
            <div className="flex flex-col items-center gap-3">
               <CgSpinner className="h-8 w-8 animate-spin text-blue-500" />
               <p className="text-sm text-text-dim font-medium">Verificando turno de caja...</p>
            </div>
         </div>
      );
   }

   if (!isOpen) {
      return <ShiftOpeningScreen />;
   }

   return (
      <div className="flex flex-col w-full h-full bg-canvas overflow-hidden">
         <PageHeader>
            {/* Grupo Izquierda crece para empujar la info de sede/caja a la derecha */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
               <h1 className="text-xl font-bold text-text-main tracking-tight shrink-0">
                  Facturar
               </h1>

               <div className="h-6 w-px bg-border/40 hidden sm:block" />

               {/* Selector de Cliente */}
               <div className="flex items-center min-w-0">
                  {!checkoutData.customer.id ? (
                     <Button
                        variant="secondary"
                        onClick={() => toggleModal('clientSearch', true)}
                        className="flex items-center gap-2 px-3 py-2 bg-surface-highlight/60 hover:bg-surface-active text-text-secondary hover:text-text-main rounded-xl transition-all border-none outline-none group h-auto active:scale-100"
                     >
                        <HiOutlineUserPlus
                           size={18}
                           className="text-text-dim group-hover:text-primary-text transition-colors"
                        />
                        <span className="text-sm font-semibold hidden sm:inline">Cliente</span>
                     </Button>
                  ) : (
                     <div
                        onClick={() => toggleModal('clientSearch', true)}
                        className="flex items-center bg-surface-highlight/60 hover:bg-surface-active rounded-xl px-3 py-1.5 gap-3 transition-all cursor-pointer group animate-in fade-in zoom-in duration-300"
                     >
                        <div className="flex flex-col leading-tight">
                           <span className="text-[10px] font-bold text-text-dim uppercase tracking-tighter group-hover:text-primary-text">
                              Cliente
                           </span>
                           <span className="text-sm font-bold text-text-main truncate max-w-[150px]">
                              {checkoutData.customer.name}
                           </span>
                        </div>
                        <div className="h-6 w-px bg-border/40" />
                        <div className="flex flex-col leading-tight">
                           <span className="text-[10px] font-medium text-text-dim uppercase">
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
                           className="ml-1 h-7 w-7 hover:bg-danger-bg hover:text-danger-text p-0"
                           title="Quitar cliente"
                        >
                           <HiXMark size={16} />
                        </Button>
                     </div>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
               <div className="hidden lg:flex items-center gap-3">
                  <span className="text-[10px] bg-surface-highlight/40 text-text-dim px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-widest">
                     Sede principal
                  </span>
                  <span className="text-[10px] bg-surface-highlight/40 text-text-dim px-2.5 py-1.5 rounded-lg font-bold uppercase tracking-widest">
                     Caja 01
                  </span>
               </div>
            </div>
         </PageHeader>

         {/* Contenedor principal */}
         <main className="flex-1 p-4 md:p-6 flex flex-col gap-4 min-h-0 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-4 flex-1 lg:overflow-hidden">
               {/* Tabla de Productos */}
               <div className="flex-1 flex flex-col bg-surface rounded-2xl shadow-sm overflow-hidden min-h-0">
                  <InvoiceTable
                     items={items}
                     onUpdateItem={updateItem}
                     onRemoveItem={removeItem}
                     onAddProductClick={() => toggleModal('productSearch', true)}
                  />
               </div>

               {/* Sidebar de Pago (Sin prop checkoutData) */}
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
