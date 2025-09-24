import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Modal } from '../ui/Modal';
import {
   HiOutlineCheck,
   HiOutlinePrinter,
   HiOutlineEnvelope,
   HiOutlineArrowRight,
   HiPaperAirplane,
   HiOutlineDocumentText,
   HiOutlineTicket,
   HiCheckCircle,
   HiChevronDown,
   HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { TicketView } from './TicketView';
import { type PaymentEntry, useBillingStore } from '../../store/billingStore';
import { SmartNumber } from '../ui/SmartNumber';
import { cn } from '../../utils/cn';
import { Input } from '../ui/Input';
import { usePrinter } from '../../hooks/usePrinter';
import { useInvoiceSharing } from '../../hooks/useInvoiceSharing';

type PaymentSuccessModalProps = {
   isOpen: boolean;
   onClose: () => void;
   total: number;
   payments: PaymentEntry[];
   invoiceNumber?: string;
   invoiceId?: number | string;
   cashierName?: string;
};

const TICKET_BASE_WIDTH = 350;

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
   const {
      expandedAction,
      isSending,
      sentSuccess,
      toggleAction,
      sendInvoice,
      reset: resetSharing,
   } = useInvoiceSharing();

   // Calculations
   const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
   const discountValue =
      discount.type === 'fixed' ? discount.value : Math.round(subtotal * (discount.value / 100));
   const totalPaid = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
   const change = Math.max(0, totalPaid - total);
   const isCashPayment = payments.some(p => p.method === 'cash');

   // State & Refs
   const containerRef = useRef<HTMLDivElement>(null);
   const primaryButtonRef = useRef<HTMLButtonElement>(null);
   const emailInputRef = useRef<HTMLInputElement>(null);
   const phoneInputRef = useRef<HTMLInputElement>(null);

   const [scale, setScale] = useState(1);
   const [emailInput, setEmailInput] = useState('');
   const [phoneInput, setPhoneInput] = useState('');
   const [isPrinting, setIsPrinting] = useState(false);
   const [activeTab, setActiveTab] = useState<'summary' | 'ticket'>('summary');

   // Reset on Open
   useEffect(() => {
      if (isOpen) {
         setEmailInput(customer.email || '');
         setPhoneInput(customer.phone || '');
         resetSharing();
         setActiveTab('summary');
         setIsPrinting(false);
         setTimeout(() => primaryButtonRef.current?.focus(), 50);
      }
   }, [isOpen, customer]);

   // Focus Logic for Sharing
   useEffect(() => {
      if (expandedAction === 'email') setTimeout(() => emailInputRef.current?.focus(), 100);
      if (expandedAction === 'whatsapp') setTimeout(() => phoneInputRef.current?.focus(), 100);
   }, [expandedAction]);

   // Auto Scale Ticket
   const calculateScale = () => {
      if (containerRef.current) {
         const { clientWidth } = containerRef.current;
         if (clientWidth === 0) return;
         const paddingX = window.innerWidth < 768 ? 32 : 48;
         const availableWidth = clientWidth - paddingX;
         setScale(Math.min(1, availableWidth / TICKET_BASE_WIDTH));
      }
   };

   useLayoutEffect(() => {
      if (!isOpen) return;
      const observer = new ResizeObserver(() => requestAnimationFrame(calculateScale));
      if (containerRef.current) observer.observe(containerRef.current);
      calculateScale();
      return () => observer.disconnect();
   }, [isOpen, activeTab]);

   const handlePrint = async () => {
      if (isPrinting) return;
      setIsPrinting(true);
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
      setIsPrinting(false);
   };

   const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
   const isValidPhone = (p: string) => p.replace(/\D/g, '').length === 10;

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
         {/* TICKET PREVIEW */}
         <div
            className={cn(
               'md:w-[380px] shrink-0 bg-zinc-950 flex-col transition-all border-zinc-800 relative z-0',
               activeTab === 'ticket' ? 'flex flex-1 md:flex-none min-h-0' : 'hidden md:flex',
               'md:border-r',
            )}
         >
            <div className="sticky top-0 z-20 w-full py-3 bg-zinc-950/95 backdrop-blur border-b border-zinc-900 flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest select-none shadow-sm">
               <HiOutlinePrinter size={14} />
               <span>VISTA PREVIA</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar relative" ref={containerRef}>
               <div className="min-h-full flex flex-col items-center justify-center py-8 px-4 w-full">
                  <div
                     className="origin-top transition-transform"
                     style={{
                        width: TICKET_BASE_WIDTH,
                        transform: `scale(${scale})`,
                        marginBottom: scale < 1 ? `-${(1 - scale) * 100}%` : '0',
                     }}
                  >
                     <TicketView
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
               </div>
            </div>
         </div>

         {/* SUMMARY & ACTIONS */}
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

               <div className="flex flex-col gap-3">
                  <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-1 mb-1">
                     Acciones Rápidas
                  </h3>

                  <button
                     onClick={handlePrint}
                     disabled={isPrinting}
                     className="w-full flex items-center justify-between p-3.5 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all group cursor-pointer text-left disabled:opacity-50"
                  >
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 text-zinc-400 rounded-lg group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                           {isPrinting ? (
                              <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                           ) : (
                              <HiOutlinePrinter size={20} />
                           )}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-zinc-300 font-medium group-hover:text-white transition-colors text-sm">
                              {isPrinting ? 'Imprimiendo...' : 'Imprimir Copia'}
                           </span>
                           <span className="text-zinc-500 text-[12px]">
                              Generar tirilla térmica
                           </span>
                        </div>
                     </div>
                     {!isPrinting && (
                        <HiOutlineArrowRight
                           size={16}
                           className="text-zinc-600 group-hover:text-zinc-400"
                        />
                     )}
                  </button>

                  {/* Email Action */}
                  <div
                     className={cn(
                        'flex flex-col bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all overflow-hidden group',
                        expandedAction === 'email'
                           ? 'bg-zinc-900 border-zinc-700'
                           : 'hover:border-zinc-700',
                     )}
                  >
                     <button
                        onClick={() => toggleAction('email')}
                        className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left outline-none"
                     >
                        <div className="flex items-center gap-3">
                           <div
                              className={cn(
                                 'p-2 rounded-lg transition-colors',
                                 expandedAction === 'email'
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'bg-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:bg-blue-500/10',
                              )}
                           >
                              <HiOutlineEnvelope size={20} />
                           </div>
                           <div className="flex flex-col">
                              <span
                                 className={cn(
                                    'font-medium transition-colors text-sm',
                                    expandedAction === 'email' ? 'text-blue-400' : 'text-zinc-300',
                                 )}
                              >
                                 Enviar por Correo
                              </span>
                              <span className="text-zinc-500 text-[12px]">
                                 Enviar factura digital
                              </span>
                           </div>
                        </div>
                        <HiChevronDown
                           size={16}
                           className={cn(
                              'text-zinc-600 transition-transform duration-300',
                              expandedAction === 'email' ? 'rotate-180 text-blue-400' : '',
                           )}
                        />
                     </button>
                     {expandedAction === 'email' && (
                        <div className="px-3.5 pb-3.5 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="flex gap-4">
                              <div className="flex-1 min-w-0 w-0">
                                 <Input
                                    ref={emailInputRef}
                                    value={emailInput}
                                    type="email"
                                    onChange={e => setEmailInput(e.target.value)}
                                    placeholder="cliente@correo.com"
                                    className="h-10 bg-zinc-950 border-zinc-800 focus:border-zinc-500/50 text-sm"
                                    onKeyDown={e => e.key === 'Enter' && sendInvoice(emailInput)}
                                 />
                              </div>
                              <button
                                 onClick={() => sendInvoice(emailInput)}
                                 disabled={!isValidEmail(emailInput) || isSending}
                                 className={cn(
                                    'h-10 w-12 rounded-lg flex items-center justify-center transition-all shrink-0',
                                    sentSuccess
                                       ? 'bg-emerald-600 text-white'
                                       : !isValidEmail(emailInput)
                                       ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                       : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg',
                                 )}
                              >
                                 {isSending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                 ) : sentSuccess ? (
                                    <HiCheckCircle size={20} />
                                 ) : (
                                    <HiPaperAirplane size={18} />
                                 )}
                              </button>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* WhatsApp Action */}
                  <div
                     className={cn(
                        'flex flex-col bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all overflow-hidden group',
                        expandedAction === 'whatsapp'
                           ? 'bg-zinc-900 border-zinc-700'
                           : 'hover:border-zinc-700',
                     )}
                  >
                     <button
                        onClick={() => toggleAction('whatsapp')}
                        className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left outline-none"
                     >
                        <div className="flex items-center gap-3">
                           <div
                              className={cn(
                                 'p-2 rounded-lg transition-colors',
                                 expandedAction === 'whatsapp'
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'bg-zinc-800 text-zinc-400 group-hover:text-green-400 group-hover:bg-green-500/10',
                              )}
                           >
                              <HiOutlineChatBubbleLeftRight size={20} />
                           </div>
                           <div className="flex flex-col">
                              <span
                                 className={cn(
                                    'font-medium transition-colors text-sm',
                                    expandedAction === 'whatsapp'
                                       ? 'text-green-400'
                                       : 'text-zinc-300',
                                 )}
                              >
                                 Enviar por WhatsApp
                              </span>
                              <span className="text-zinc-500 text-[12px]">
                                 Enviar a número móvil
                              </span>
                           </div>
                        </div>
                        <HiChevronDown
                           size={16}
                           className={cn(
                              'text-zinc-600 transition-transform duration-300',
                              expandedAction === 'whatsapp' ? 'rotate-180 text-green-400' : '',
                           )}
                        />
                     </button>
                     {expandedAction === 'whatsapp' && (
                        <div className="px-3.5 pb-3.5 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                           <div className="flex gap-4">
                              <div className="flex-1 min-w-0 w-0">
                                 <Input
                                    ref={phoneInputRef}
                                    value={phoneInput}
                                    type="tel"
                                    onChange={e => setPhoneInput(e.target.value)}
                                    placeholder="300 123 4567"
                                    prefix="+57"
                                    className="h-10 bg-zinc-950 border-zinc-800 focus:border-zinc-500/50 text-sm"
                                    onKeyDown={e => e.key === 'Enter' && sendInvoice(phoneInput)}
                                 />
                              </div>
                              <button
                                 onClick={() => sendInvoice(phoneInput)}
                                 disabled={!isValidPhone(phoneInput) || isSending}
                                 className={cn(
                                    'h-10 w-12 rounded-lg flex items-center justify-center transition-all shrink-0',
                                    sentSuccess
                                       ? 'bg-emerald-600 text-white'
                                       : !isValidPhone(phoneInput)
                                       ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                       : 'bg-green-600 hover:bg-green-500 text-white shadow-lg',
                                 )}
                              >
                                 {isSending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                 ) : sentSuccess ? (
                                    <HiCheckCircle size={20} />
                                 ) : (
                                    <HiPaperAirplane size={18} />
                                 )}
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* FOOTER */}
            <div className="hidden md:block p-6 md:px-8 md:py-5 border-t border-zinc-900 shrink-0 mt-auto">
               <button
                  ref={primaryButtonRef}
                  onClick={onClose}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all cursor-pointer py-3"
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
                     className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 py-3.5 active:scale-[0.98] transition-all cursor-pointer"
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
