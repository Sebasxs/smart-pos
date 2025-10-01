import { useEffect, useRef, useState } from 'react';
import { Modal } from '../ui/Modal';
import {
   HiOutlineCheck,
   HiOutlineArrowRight,
   HiOutlineDocumentText,
   HiOutlineTicket,
} from 'react-icons/hi2';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { type PaymentEntry, useBillingStore } from '../../store/billingStore';
import { SmartNumber } from '../ui/SmartNumber';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { usePrinter } from '../../hooks/usePrinter';
import { TicketPreviewSection } from './payment/TicketPreviewSection';
import { PaymentActions } from './payment/PaymentActions';

type PaymentSuccessModalProps = {
   isOpen: boolean;
   onClose: () => void;
   total: number;
   payments: PaymentEntry[];
   invoiceNumber?: string;
   invoiceId?: number | string;
   cashierName?: string;
};

export const PaymentSuccessModal = ({
   isOpen,
   onClose,
   total,
   payments,
   invoiceNumber,
   invoiceId,
   cashierName,
}: PaymentSuccessModalProps) => {
   const { printInvoice } = usePrinter();
   const { items, discount, checkoutData } = useBillingStore();
   const { customer } = checkoutData;

   // Calculations
   const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
   const discountValue =
      discount.type === 'fixed' ? discount.value : Math.round(subtotal * (discount.value / 100));
   const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
   const change = Math.max(0, totalPaid - total);
   const isCashPayment = payments.some(p => p.method === 'cash');

   const primaryButtonRef = useRef<HTMLButtonElement>(null);
   const [activeTab, setActiveTab] = useState<'summary' | 'ticket'>('summary');

   useEffect(() => {
      if (isOpen) {
         setActiveTab('summary');
         setTimeout(() => primaryButtonRef.current?.focus(), 50);
      }
   }, [isOpen]);

   const handlePrint = async () => {
      await printInvoice({
         invoiceNumber: invoiceNumber || '---',
         date: new Date(),
         cashierName: cashierName || '---',
         customer: {
            name: customer.name,
            id_number: customer.taxId,
            phone: customer.phone,
            address: customer.address,
         },
         items: items.map(i => ({
            description: i.description,
            qty: i.quantity,
            price: i.price,
            total: i.quantity * i.price,
         })),
         totals: { subtotal, discount: discountValue, total },
         payments: payments.map(p => ({ method: p.method, amount: p.amount || 0 })),
      });
   };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         variant="center"
         className={cn(
            'flex flex-col md:flex-row w-full md:max-w-5xl bg-canvas transition-all duration-300 relative overflow-hidden shadow-2xl shadow-black',
            'h-[85vh] rounded-3xl border border-border',
            'md:h-auto md:max-h-[85vh] md:rounded-2xl',
            activeTab === 'ticket' ? 'md:h-[85vh]' : '',
         )}
      >
         {/* LEFT PANEL: TICKET PREVIEW */}
         <div
            className={cn(
               'md:w-[380px] shrink-0 bg-surface border-r border-border',
               activeTab === 'ticket' ? 'flex flex-1 md:flex-none min-h-0' : 'hidden md:flex',
            )}
         >
            <TicketPreviewSection
               isVisible={activeTab === 'ticket' || window.innerWidth >= 768}
               invoiceNumber={invoiceNumber}
               invoiceId={invoiceId}
               customer={customer}
               items={items}
               subtotal={subtotal}
               discount={discountValue}
               total={total}
               payments={payments}
               cashierName={cashierName}
            />
         </div>

         {/* RIGHT PANEL: SUMMARY & ACTIONS */}
         <div
            className={cn(
               'flex-1 flex-col bg-canvas relative min-h-0',
               activeTab === 'summary' ? 'flex' : 'hidden md:flex',
            )}
         >
            <div className="pt-8 px-8 flex justify-between items-start shrink-0 gap-10">
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                     Venta Exitosa
                  </h2>
                  <p className="text-text-muted text-sm">
                     Factura - <span className="text-text-main font-bold">#{invoiceNumber}</span>
                  </p>
               </div>
               <div className="p-4 bg-success-bg text-success-text rounded-full ring-1 ring-success/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 animate-in zoom-in duration-500">
                  <HiOutlineCheck size={24} strokeWidth={3} />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar flex flex-col justify-between">
               <div className="mb-8">
                  {isCashPayment && change > 0 ? (
                     <div className="bg-surface border border-border p-6 rounded-2xl relative overflow-hidden shadow-lg">
                        <p className="text-text-muted font-bold uppercase text-[10px] tracking-widest mb-2">
                           Cambio a entregar
                        </p>
                        <div className="flex items-baseline gap-1">
                           <span className="text-2xl text-success-text font-bold">$</span>
                           <SmartNumber
                              value={change}
                              variant="currency"
                              showPrefix={false}
                              className="text-5xl font-black text-white tracking-tighter"
                           />
                        </div>
                     </div>
                  ) : (
                     <div className="bg-surface border border-border p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                        <div className="p-3 bg-surface-highlight rounded-xl text-success-text">
                           <HiOutlineReceiptTax size={24} />
                        </div>
                        <span className="text-text-main font-bold text-lg">Pago Completo</span>
                     </div>
                  )}
               </div>

               <PaymentActions
                  email={customer.email}
                  phone={customer.phone}
                  onPrint={handlePrint}
                  onSendEmail={async () => {}} // Placeholder logic
                  onSendWhatsapp={async () => {}} // Placeholder logic
               />
            </div>

            {/* FOOTER */}
            <div className="hidden md:block p-8 border-t border-border shrink-0 mt-auto bg-surface/50 backdrop-blur-sm">
               <Button
                  ref={primaryButtonRef}
                  variant="primary"
                  onClick={onClose}
                  autoFocus
                  className="w-full h-auto py-4 text-lg shadow-xl shadow-primary/20 active:scale-100 ring-offset-2 ring-offset-canvas focus:ring-2 focus:ring-primary"
               >
                  <span>Nueva Venta</span>
                  <HiOutlineArrowRight size={20} />
               </Button>
            </div>
         </div>

         {/* MOBILE FOOTER NAV */}
         <div className="md:hidden flex flex-col shrink-0 p-5 bg-surface/95 backdrop-blur-md border-t border-border z-50 pb-8">
            {activeTab === 'summary' && (
               <>
                  <button
                     ref={primaryButtonRef}
                     onClick={onClose}
                     className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 py-3.5 active:scale-[0.98] transition-all cursor-pointer outline-none"
                  >
                     <span>Nueva Venta</span>
                     <HiOutlineArrowRight size={20} />
                  </button>
                  <div className="w-full h-px bg-border my-4" />
               </>
            )}
            <div className="flex bg-surface-highlight p-1 rounded-xl border border-border shadow-lg">
               <Button
                  variant="ghost"
                  onClick={() => setActiveTab('summary')}
                  className={cn(
                     'flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors border active:scale-100',
                     activeTab === 'summary'
                        ? 'bg-surface text-white border-border shadow-sm'
                        : 'text-text-muted border-transparent',
                  )}
               >
                  <HiOutlineDocumentText size={18} /> Resumen
               </Button>
               <Button
                  variant="ghost"
                  onClick={() => setActiveTab('ticket')}
                  className={cn(
                     'flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors border active:scale-100',
                     activeTab === 'ticket'
                        ? 'bg-surface text-white border-border shadow-sm'
                        : 'text-text-muted border-transparent',
                  )}
               >
                  <HiOutlineTicket size={18} /> Factura
               </Button>
            </div>
         </div>
      </Modal>
   );
};
