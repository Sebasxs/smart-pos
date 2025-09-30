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
            'flex flex-col md:flex-row w-full md:max-w-5xl bg-zinc-950 transition-all duration-300 relative overflow-hidden',
            'h-[85vh] rounded-3xl',
            'md:h-auto md:max-h-[85vh] md:rounded-2xl',
            activeTab === 'ticket' ? 'md:h-[85vh]' : '',
         )}
      >
         {/* LEFT PANEL: TICKET PREVIEW */}
         <div
            className={cn(
               'md:w-[380px] shrink-0',
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
               'flex-1 flex-col bg-zinc-950 relative min-h-0',
               activeTab === 'summary' ? 'flex' : 'hidden md:flex',
            )}
         >
            <div className="pt-6 px-6 md:pt-8 md:px-8 flex justify-between items-start shrink-0 gap-10">
               <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">
                     Venta Exitosa
                  </h2>
                  <p className="text-zinc-400 text-sm">
                     Factura - <span className="text-zinc-300 font-bold">#{invoiceNumber}</span>
                  </p>
               </div>
               <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                  <HiOutlineCheck size={14} strokeWidth={3} />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar flex flex-col justify-between">
               <div className="mb-8">
                  {isCashPayment && change > 0 ? (
                     <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden">
                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-1">
                           Cambio a entregar
                        </p>
                        <div className="flex items-baseline gap-1">
                           <span className="text-2xl text-emerald-500 font-bold">$</span>
                           <SmartNumber
                              value={change}
                              variant="currency"
                              showPrefix={false}
                              className="text-4xl font-black text-white tracking-tighter"
                           />
                        </div>
                     </div>
                  ) : (
                     <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg text-emerald-400">
                           <HiOutlineReceiptTax size={20} />
                        </div>
                        <span className="text-zinc-200 font-bold">Pago Completo</span>
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
            <div className="hidden md:block p-6 md:px-8 md:py-5 border-t border-zinc-900 shrink-0 mt-auto">
               <button
                  ref={primaryButtonRef}
                  onClick={onClose}
                  autoFocus
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all cursor-pointer py-3 outline-none"
               >
                  <span>Nueva Venta</span>
                  <HiOutlineArrowRight size={20} />
               </button>
            </div>
         </div>

         {/* MOBILE FOOTER NAV */}
         <div className="md:hidden flex flex-col shrink-0 p-5 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-50 pb-8">
            {activeTab === 'summary' && (
               <>
                  <button
                     ref={primaryButtonRef}
                     onClick={onClose}
                     className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 py-3.5 active:scale-[0.98] transition-all cursor-pointer outline-none"
                  >
                     <span>Nueva Venta</span>
                     <HiOutlineArrowRight size={20} />
                  </button>
                  <div className="w-full h-px bg-zinc-800 my-4" />
               </>
            )}
            <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 shadow-lg">
               <button
                  onClick={() => setActiveTab('summary')}
                  className={cn(
                     'flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2 border',
                     activeTab === 'summary'
                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                        : 'text-zinc-500 border-transparent',
                  )}
               >
                  <HiOutlineDocumentText size={18} /> Resumen
               </button>
               <button
                  onClick={() => setActiveTab('ticket')}
                  className={cn(
                     'flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors flex items-center justify-center gap-2 border',
                     activeTab === 'ticket'
                        ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                        : 'text-zinc-500 border-transparent',
                  )}
               >
                  <HiOutlineTicket size={18} /> Factura
               </button>
            </div>
         </div>
      </Modal>
   );
};
