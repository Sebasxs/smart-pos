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
import { TbNumber57Small } from 'react-icons/tb';
import { Button } from '../../ui/Button';

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
         <h3 className="text-text-dim text-xs font-bold uppercase tracking-wider ml-1 mb-1">
            Acciones Rápidas
         </h3>

         {/* Print Action */}
         <Button
            variant="ghost"
            onClick={handlePrint}
            disabled={isPrinting}
            className="w-full flex items-center justify-between p-3.5 bg-surface/40 hover:bg-surface border border-border hover:border-border-hover rounded-xl transition-all group cursor-pointer text-left disabled:opacity-50 h-auto active:scale-100"
         >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-surface-active text-text-muted rounded-lg group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors border border-border/50 group-hover:border-purple-500/20">
                  {isPrinting ? (
                     <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  ) : (
                     <HiOutlinePrinter size={20} />
                  )}
               </div>
               <div className="flex flex-col">
                  <span className="text-text-secondary font-medium group-hover:text-text-main transition-colors text-sm text-left">
                     {isPrinting ? 'Imprimiendo...' : 'Imprimir Copia'}
                  </span>
                  <span className="text-text-dim text-[12px] text-left">
                     Generar tirilla térmica
                  </span>
               </div>
            </div>
            {!isPrinting && (
               <HiOutlineArrowRight
                  size={16}
                  className="text-text-dim group-hover:text-text-muted"
               />
            )}
         </Button>

         {/* Email Action */}
         <div
            className={cn(
               'flex flex-col bg-surface/40 border border-border rounded-xl transition-all overflow-hidden group',
               expandedAction === 'email'
                  ? 'bg-surface border-border-hover shadow-sm'
                  : 'hover:border-border-hover',
            )}
         >
            <Button
               variant="ghost"
               onClick={() => toggleAction('email')}
               className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left outline-none h-auto active:scale-100 border-none"
            >
               <div className="flex items-center gap-3">
                  <div
                     className={cn(
                        'p-2 rounded-lg transition-colors border',
                        expandedAction === 'email'
                           ? 'bg-primary-subtle text-primary-text border-primary/20'
                           : 'bg-surface-active text-text-muted border-border/50 group-hover:text-primary-text group-hover:bg-primary-subtle group-hover:border-primary/20',
                     )}
                  >
                     <HiOutlineEnvelope size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span
                        className={cn(
                           'font-medium transition-colors text-sm text-left',
                           expandedAction === 'email' ? 'text-primary-text' : 'text-text-secondary',
                        )}
                     >
                        Enviar por Correo
                     </span>
                     <span className="text-text-dim text-[12px] text-left">
                        Enviar factura digital
                     </span>
                  </div>
               </div>
               <HiChevronDown
                  size={16}
                  className={cn(
                     'text-text-dim transition-transform duration-300',
                     expandedAction === 'email' ? 'rotate-180 text-primary-text' : '',
                  )}
               />
            </Button>
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
                           className="h-10 bg-canvas border-border text-sm"
                           focusVariant="none"
                           onKeyDown={e => e.key === 'Enter' && handleSend('email')}
                        />
                     </div>
                     <Button
                        variant={sentSuccess ? 'success' : 'primary'}
                        onClick={() => handleSend('email')}
                        disabled={!isValidEmail(emailInput) || isSending}
                        isLoading={isSending}
                        className={cn(
                           'h-10 w-12 rounded-lg flex items-center justify-center transition-all shrink-0 p-0',
                           !isValidEmail(emailInput) &&
                              !isSending &&
                              !sentSuccess &&
                              'bg-surface-highlight text-text-dim cursor-not-allowed opacity-50 border border-border',
                        )}
                     >
                        {sentSuccess ? <HiCheckCircle size={20} /> : <HiPaperAirplane size={18} />}
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {/* WhatsApp Action */}
         <div
            className={cn(
               'flex flex-col bg-surface/40 border border-border rounded-xl transition-all overflow-hidden group',
               expandedAction === 'whatsapp'
                  ? 'bg-surface border-border-hover shadow-sm'
                  : 'hover:border-border-hover',
            )}
         >
            <Button
               variant="ghost"
               onClick={() => toggleAction('whatsapp')}
               className="w-full flex items-center justify-between p-3.5 cursor-pointer text-left outline-none h-auto active:scale-100 border-none"
            >
               <div className="flex items-center gap-3">
                  <div
                     className={cn(
                        'p-2 rounded-lg transition-colors border',
                        expandedAction === 'whatsapp'
                           ? 'bg-success-bg text-success-text border-success/20'
                           : 'bg-surface-active text-text-muted border-border/50 group-hover:text-success-text group-hover:bg-success-bg group-hover:border-success/20',
                     )}
                  >
                     <HiOutlineChatBubbleLeftRight size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span
                        className={cn(
                           'font-medium transition-colors text-sm text-left',
                           expandedAction === 'whatsapp'
                              ? 'text-success-text'
                              : 'text-text-secondary',
                        )}
                     >
                        Enviar por WhatsApp
                     </span>
                     <span className="text-text-dim text-[12px] text-left">
                        Enviar a número móvil
                     </span>
                  </div>
               </div>
               <HiChevronDown
                  size={16}
                  className={cn(
                     'text-text-dim transition-transform duration-300',
                     expandedAction === 'whatsapp' ? 'rotate-180 text-success-text' : '',
                  )}
               />
            </Button>
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
                           startIcon={<TbNumber57Small size={22} />}
                           className="h-10 bg-canvas border-border text-sm"
                           focusVariant="none"
                           onKeyDown={e => e.key === 'Enter' && handleSend('whatsapp')}
                        />
                     </div>
                     <Button
                        variant={sentSuccess ? 'success' : 'primary'}
                        onClick={() => handleSend('whatsapp')}
                        disabled={!isValidPhone(phoneInput) || isSending}
                        isLoading={isSending}
                        className={cn(
                           'h-10 w-12 rounded-lg flex items-center justify-center transition-all shrink-0 p-0',
                           !isValidPhone(phoneInput) &&
                              !isSending &&
                              !sentSuccess &&
                              'bg-surface-highlight text-text-dim cursor-not-allowed opacity-50 border border-border',
                           !sentSuccess &&
                              !isSending &&
                              isValidPhone(phoneInput) &&
                              'bg-emerald-600 hover:bg-emerald-500',
                        )}
                     >
                        {sentSuccess ? <HiCheckCircle size={20} /> : <HiPaperAirplane size={18} />}
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
