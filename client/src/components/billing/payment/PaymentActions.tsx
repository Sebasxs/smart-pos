import { useRef, useEffect, useState } from 'react';
import {
   HiOutlinePrinter,
   HiOutlineEnvelope,
   HiOutlineArrowRight,
   HiPaperAirplane,
   HiCheckCircle,
   HiChevronDown,
   HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2';
import { cn } from '../../../utils/cn';
import { Input } from '../../ui/Input';
import { useInvoiceSharing } from '../../../hooks/useInvoiceSharing';

type PaymentActionsProps = {
   email?: string;
   phone?: string;
   onPrint: () => Promise<void>;
   onSendEmail: (email: string) => Promise<void>;
   onSendWhatsapp: (phone: string) => Promise<void>;
};

export const PaymentActions = ({
   email = '',
   phone = '',
   onPrint,
   onSendEmail,
   onSendWhatsapp,
}: PaymentActionsProps) => {
   const {
      expandedAction,
      isSending,
      sentSuccess,
      toggleAction,
      sendInvoice,
      reset: resetSharing,
   } = useInvoiceSharing();

   const emailInputRef = useRef<HTMLInputElement>(null);
   const phoneInputRef = useRef<HTMLInputElement>(null);

   const [emailInput, setEmailInput] = useState(email);
   const [phoneInput, setPhoneInput] = useState(phone);
   const [isPrinting, setIsPrinting] = useState(false);

   // Focus management
   useEffect(() => {
      if (expandedAction === 'email') setTimeout(() => emailInputRef.current?.focus(), 100);
      if (expandedAction === 'whatsapp') setTimeout(() => phoneInputRef.current?.focus(), 100);
   }, [expandedAction]);

   // Sync initial values
   useEffect(() => {
      setEmailInput(email);
      setPhoneInput(phone);
      resetSharing();
   }, [email, phone]);

   const handlePrint = async () => {
      if (isPrinting) return;
      setIsPrinting(true);
      await onPrint();
      setIsPrinting(false);
   };

   const handleSend = (type: 'email' | 'whatsapp') => {
      const value = type === 'email' ? emailInput : phoneInput;
      sendInvoice(value).then(() => {
         if (type === 'email') onSendEmail(value);
         else onSendWhatsapp(value);
      });
   };

   const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
   const isValidPhone = (p: string) => p.replace(/\D/g, '').length === 10;

   return (
      <div className="flex flex-col gap-3">
         <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider ml-1 mb-1">
            Acciones Rápidas
         </h3>

         {/* Print Action */}
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
                  <span className="text-zinc-500 text-[12px]">Generar tirilla térmica</span>
               </div>
            </div>
            {!isPrinting && (
               <HiOutlineArrowRight size={16} className="text-zinc-600 group-hover:text-zinc-400" />
            )}
         </button>

         {/* Email Action */}
         <div
            className={cn(
               'flex flex-col bg-zinc-900/40 border border-zinc-800 rounded-xl transition-all overflow-hidden group',
               expandedAction === 'email' ? 'bg-zinc-900 border-zinc-700' : 'hover:border-zinc-700',
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
                     <span className="text-zinc-500 text-[12px]">Enviar factura digital</span>
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
                           onKeyDown={e => e.key === 'Enter' && handleSend('email')}
                        />
                     </div>
                     <button
                        onClick={() => handleSend('email')}
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
                           expandedAction === 'whatsapp' ? 'text-green-400' : 'text-zinc-300',
                        )}
                     >
                        Enviar por WhatsApp
                     </span>
                     <span className="text-zinc-500 text-[12px]">Enviar a número móvil</span>
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
                           onKeyDown={e => e.key === 'Enter' && handleSend('whatsapp')}
                        />
                     </div>
                     <button
                        onClick={() => handleSend('whatsapp')}
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
   );
};
