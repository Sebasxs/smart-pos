import { useState, useMemo, useCallback, useEffect } from 'react';
import { HiOutlineComputerDesktop, HiOutlineBanknotes } from 'react-icons/hi2';
import { Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useOrganizationStore } from '../store/organizationStore';

// Components
import { InvoiceTable } from '../components/billing/InvoiceTable';
import { ProductSearchModal } from '../components/billing/ProductSearchModal';
import { ClientCombobox } from '../components/billing/ClientCombobox';
import { ClientBadge } from '../components/billing/ClientBadge';
import { CreateCustomerModal } from '../components/billing/CreateCustomerModal';
import { DiscountModal } from '../components/billing/DiscountModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { PaymentSuccessModal } from '../components/billing/PaymentSuccessModal';
import { ErrorModal } from '../components/ui/ErrorModal';
import { SplitPaymentWidget } from '../components/billing/SplitPaymentWidget';
import { BillingTotals } from '../components/billing/BillingTotals';
import { SmartNumberInput } from '../components/ui/SmartNumberInput';
import { useInventoryStore } from '../store/inventoryStore';
import { useCustomerStore } from '../store/customerStore';
import { useCashShiftStore } from '../store/cashShiftStore';
import { Button } from '../components/ui/Button';
import { usePreferencesStore } from '../store/usePreferencesStore';

// Types
import { useBillingStore, type CheckoutState } from '../store/billingStore';
import { type InvoiceItem } from '../types/billing';

// Utils
import { authenticatedFetch } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { TAX_REGIME_LABELS } from '../utils/constants';
import { formatDate, formatTime } from '../utils/date';

const API_URL = import.meta.env.VITE_API_URL;

export const Billing = () => {
   const { user } = useAuthStore();
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
      ensureDefaultPayment,
   } = useBillingStore();
   const { decreaseStockBatch } = useInventoryStore();
   const { updateCustomerAfterPurchase } = useCustomerStore();
   const { isOpen, openShift, loading: shiftLoading } = useCashShiftStore();
   const { preferences } = usePreferencesStore();
   const [modals, setModals] = useState({
      productSearch: false,
      clientCreate: false,
      discount: false,
      discardConfirm: false,
      success: false,
      error: false,
   });

   const [generatedInvoiceNumber, setGeneratedInvoiceNumber] = useState<string>('');
   const [finalizedPayments, setFinalizedPayments] = useState<any[]>([]);
   const [isClientSearchFocused, setIsClientSearchFocused] = useState(false);
   const [searchInputValue, setSearchInputValue] = useState('');
   const [createClientName, setCreateClientName] = useState('');
   const [_, setFinalizedData] = useState<CheckoutState | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);
   const [generatedInvoiceId, setGeneratedInvoiceId] = useState<number | undefined>(undefined);
   const [errorMessage, setErrorMessage] = useState('');
   const [openingAmount, setOpeningAmount] = useState<number | null>(null);
   const [shiftError, setShiftError] = useState<string | null>(null);

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
      setIsClientSearchFocused(false);
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

   const { settings } = useOrganizationStore();

   const handlePaymentProcess = useCallback(async () => {
      if (!isPaymentValid || isProcessing) return;

      if (checkoutData.customer.name && !checkoutData.customer.taxId) {
         setErrorMessage('El cliente debe tener una identificación (NIT/CC) para facturar.');
         toggleModal('error', true);
         return;
      }

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

         const res = await authenticatedFetch(`${API_URL}/invoices`, {
            method: 'POST',
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
         setFinalizedPayments([...checkoutData.payments]);
         setGeneratedInvoiceId(responseData.invoiceId);
         setGeneratedInvoiceNumber(responseData.invoiceNumberFull);

         try {
            // 1. Preparar datos de la empresa (Fallback si no han cargado)
            const companyInfo = {
               name: settings?.company_name || '---',
               nit: settings?.tax_id || '---',
               regime: TAX_REGIME_LABELS[settings?.tax_regime || 'not_responsible_iva'] || '---',
               address: settings?.address
                  ? `${settings.address}${settings.city ? `, ${settings.city}` : ''}`
                  : '---',
               phone: settings?.phone || '',
               footer: settings?.invoice_footer || 'Gracias por su compra',
            };

            // 2. Preparar payload para la impresora (Estructura limpia)
            const date = new Date();
            const printPayload = {
               company: companyInfo,
               invoice: {
                  number: responseData.invoiceNumberFull, // Usamos el que respondió el server
                  date: formatDate(date),
                  time: formatTime(date),
                  cashier: user?.full_name || user?.nickname || '---',
               },
               customer: {
                  name: checkoutData.customer.name,
                  id_number: checkoutData.customer.taxId,
                  phone: checkoutData.customer.phone,
                  address: checkoutData.customer.address,
               },
               items: items.map(i => ({
                  description: i.description,
                  qty: i.quantity,
                  price: i.price,
                  total: i.quantity * i.price,
               })),
               totals: {
                  subtotal: subtotal,
                  discount: discountAmount,
                  total: total,
               },
               payments: checkoutData.payments.map(p => ({
                  method: p.method,
                  amount: p.amount || 0,
               })),
            };

            // 3. Enviar a la cola de impresión en Supabase
            const { error: printError } = await supabase.from('print_jobs').insert({
               printer_name: 'POS-80', // Puedes hacerlo dinámico si tienes varias cajas
               status: 'pending',
               payload: printPayload,
            });

            if (printError) console.error('Error enviando a imprimir:', printError);
         } catch (err) {
            console.error('Error preparando impresión:', err);
         }

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
      setGeneratedInvoiceNumber('');
      setFinalizedPayments([]);
   };

   useEffect(() => {
      if (preferences.defaultOpeningCash > 0 && openingAmount === null) {
         setOpeningAmount(preferences.defaultOpeningCash);
      }
   }, [preferences.defaultOpeningCash]);

   // Ensure default cash payment is always active when there are no payment methods
   useEffect(() => {
      ensureDefaultPayment();
   }, [ensureDefaultPayment]);

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

   if (shiftLoading && !isOpen) {
      return (
         <div className="flex h-full w-full items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-3">
               <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
               <p className="text-sm text-zinc-500 font-medium">Verificando turno de caja...</p>
            </div>
         </div>
      );
   }

   // --- CASH SHIFT BLOCKING ---
   if (!isOpen) {
      return (
         <div className="flex items-center justify-center h-full w-full bg-zinc-950 animate-in fade-in duration-500">
            <div className="w-full max-w-sm p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col gap-6 items-center text-center">
               <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center border border-blue-500/20 shadow-inner">
                  <HiOutlineBanknotes className="text-blue-400" size={32} />
               </div>

               <div className="space-y-2">
                  <h2 className="text-xl font-bold text-white">Apertura de Caja</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                     Para comenzar a facturar, es necesario abrir un turno e indicar la base de
                     efectivo.
                  </p>
               </div>

               <div className="w-full space-y-4 pt-2">
                  <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                     <SmartNumberInput
                        value={openingAmount}
                        onValueChange={val => {
                           setOpeningAmount(val);
                           setShiftError(null);
                        }}
                        variant="currency"
                        placeholder="0"
                        className="[&>input]:text-center [&>input]:text-xl [&>input]:font-bold [&>input]:bg-transparent [&>input]:border-none [&>input]:py-3 [&>input]:w-full"
                     />
                  </div>

                  {shiftError && (
                     <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {shiftError}
                     </div>
                  )}

                  <Button
                     onClick={async () => {
                        setShiftError(null);
                        try {
                           await openShift(openingAmount || 0);
                        } catch (e: any) {
                           console.error('Falló la apertura:', e);
                           const msg = e.message || 'Error al abrir el turno. Intente nuevamente.';
                           setShiftError(msg);
                        }
                     }}
                     disabled={shiftLoading}
                     isLoading={shiftLoading}
                     className="w-full py-3.5 text-base shadow-blue-900/20 cursor-pointer"
                  >
                     Iniciar Turno
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="relative w-full flex flex-col gap-4 lg:h-full lg:max-h-screen">
         <div
            className={`
               fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-300
               ${
                  isClientSearchFocused
                     ? 'opacity-80 pointer-events-auto'
                     : 'opacity-0 pointer-events-none'
               }
            `}
            onClick={() => setIsClientSearchFocused(false)}
         />
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

            {/* Client Search / Badge */}
            <div className="flex items-center gap-3 mt-4 w-full md:w-auto">
               {!checkoutData.customer.id ? (
                  <div
                     className={`
                        relative w-full md:w-[340px] transition-transform duration-300 ease-out
                        ${isClientSearchFocused ? 'z-50' : 'z-20'}
                     `}
                     style={{
                        transitionProperty: 'transform, z-index',
                        transitionDelay: isClientSearchFocused ? '0ms' : '100ms, 300ms',
                     }}
                  >
                     <ClientCombobox
                        id="client-search-input"
                        value={searchInputValue}
                        onChange={setSearchInputValue}
                        onSelectCustomer={handleClientSelect}
                        onRequestCreate={handleRequestCreateClient}
                        placeholder="Buscar cliente..."
                        onFocus={() => setIsClientSearchFocused(true)}
                        onBlur={() => setIsClientSearchFocused(false)}
                     />
                  </div>
               ) : (
                  <div className="w-full md:w-[340px] flex">
                     <ClientBadge
                        name={checkoutData.customer.name}
                        taxId={checkoutData.customer.taxId}
                        email={checkoutData.customer.email}
                        accountBalance={checkoutData.customer.accountBalance}
                        onRemove={handleRemoveClient}
                     />
                  </div>
               )}
            </div>
         </div>

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

            {/* SUMMARY */}
            <aside className="w-full lg:w-[340px] lg:shrink-0 flex flex-col h-fit lg:max-h-full lg:overflow-y-auto custom-scrollbar pr-1">
               <div className="flex flex-col md:flex-row lg:flex-col gap-4 w-full shrink-0">
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
            </aside>
         </div>

         {/* MODALS */}
         <ProductSearchModal
            isOpen={modals.productSearch}
            onClose={() => toggleModal('productSearch', false)}
            onSelectProduct={handleProductSelect}
         />

         <CreateCustomerModal
            isOpen={modals.clientCreate}
            onClose={() => toggleModal('clientCreate', false)}
            initialName={createClientName}
            onCustomerCreated={handleClientCreated}
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
            payments={finalizedPayments}
            invoiceNumber={generatedInvoiceNumber || 'Pendiente'}
            invoiceId={generatedInvoiceId}
            cashierName={user?.full_name || user?.nickname || 'Cajero'}
         />
         <ErrorModal
            isOpen={modals.error}
            onClose={() => toggleModal('error', false)}
            message={errorMessage}
         />
      </div>
   );
};
