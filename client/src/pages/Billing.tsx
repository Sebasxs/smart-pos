import { useState, useMemo, useCallback, useEffect } from 'react';
import { HiOutlineComputerDesktop, HiOutlinePlus } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { CgSpinner } from 'react-icons/cg';

// Components
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { CustomerBadge } from '../components/billing/CustomerBadge';
import { SplitPaymentWidget } from '../components/billing/SplitPaymentWidget';
import { BillingTotals } from '../components/billing/BillingTotals';
import { ShiftOpeningScreen } from '../components/billing/ShiftOpeningScreen';
import { BillingModalsWrapper } from '../components/billing/BillingModalsWrapper';

// Stores & Hooks
import { useBillingStore } from '../store/billingStore';
import { useCashShiftStore } from '../store/cashShiftStore';
import { useBillingPayment } from '../hooks/useBillingPayment';

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

   const [modals, setModals] = useState({
      productSearch: false,
      clientSearch: false,
      clientCreate: false,
      discount: false,
      discardConfirm: false,
      success: false,
      error: false,
   });
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

   const toggleModal = useCallback((key: string, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
   }, []);

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
                  toggleModal('clientSearch', true);
                  break;
               case 'KeyD':
                  event.preventDefault();
                  toggleModal('discount', true);
                  break;
               case 'KeyX':
                  event.preventDefault();
                  if (items.length > 0) toggleModal('discardConfirm', true);
                  break;
               case 'Enter':
                  event.preventDefault();
                  if (isPaymentValid) {
                     handlePaymentProcess();
                  } else if (items.length > 0) {
                     // Smart enter: add full cash payment or update it
                     const { payments } = checkoutData;
                     if (payments.length === 0) {
                        addPayment('cash', total);
                     } else if (payments.length === 1 && payments[0].method === 'cash') {
                        if (Math.abs((payments[0].amount || 0) - total) > 0.01) {
                           updatePayment(payments[0].id, total);
                        }
                     }
                  }
                  break;
            }
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [
      modals,
      isPaymentValid,
      items.length,
      checkoutData,
      total,
      toggleModal,
      handlePaymentProcess,
      addPayment,
      updatePayment,
   ]);

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

            {/* SIDEBAR SUMMARY */}
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
                              onClick={resetCustomer}
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
                              onClick={() => toggleModal('clientSearch', true)}
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
                           onOpenDiscount={() => toggleModal('discount', true)}
                           onDiscard={() => items.length > 0 && toggleModal('discardConfirm', true)}
                           onProcessPayment={handlePaymentProcess}
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
         </div>

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
