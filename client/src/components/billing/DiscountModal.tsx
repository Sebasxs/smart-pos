import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { type Discount } from '../../types/billing';
import { HiOutlineCurrencyDollar, HiOutlineReceiptPercent } from 'react-icons/hi2';
import { Button } from '../ui/Button';

type DiscountModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onApply: (discount: Discount) => void;
   currentDiscount: Discount;
   subtotal: number;
};

export const DiscountModal = ({
   isOpen,
   onClose,
   onApply,
   currentDiscount,
   subtotal,
}: DiscountModalProps) => {
   const [localDiscount, setLocalDiscount] = useState<Discount>(currentDiscount);
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      if (isOpen) {
         setLocalDiscount(currentDiscount);
         setTimeout(() => {
            if (inputRef.current) {
               inputRef.current.focus();
               inputRef.current.select();
            }
         }, 50);
      }
   }, [isOpen, currentDiscount]);

   const handleSubmit = () => {
      onApply(localDiscount);
      onClose();
   };

   const previewDiscountAmount =
      localDiscount.type === 'percentage'
         ? Math.round(subtotal * (localDiscount.value / 100))
         : localDiscount.value;

   const isPercentage = localDiscount.type === 'percentage';

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         className="w-[300px] bg-surface border border-border shadow-2xl rounded-2xl"
      >
         <div className="p-5 text-center">
            <h3 className="text-base font-bold mb-4 text-text-main">Descuento Global</h3>

            {/* Toggle Compacto y Tenue */}
            <div className="bg-canvas p-1 rounded-lg flex gap-1 mb-5 border border-border">
               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'fixed' }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                     !isPercentage
                        ? 'bg-success-bg text-success-text shadow-sm ring-1 ring-inset ring-success/20'
                        : 'text-text-dim hover:text-text-secondary hover:bg-surface-highlight'
                  }`}
               >
                  <HiOutlineCurrencyDollar size={16} />
                  <span>Monto</span>
               </button>
               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'percentage' }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                     isPercentage
                        ? 'bg-primary-subtle text-primary-text shadow-sm ring-1 ring-inset ring-primary/20'
                        : 'text-text-dim hover:text-text-secondary hover:bg-surface-highlight'
                  }`}
               >
                  <HiOutlineReceiptPercent size={16} />
                  <span>%</span>
               </button>
            </div>

            <div className="mb-6">
               <div className="relative mx-auto w-64">
                  <SmartNumberInput
                     getInputRef={inputRef}
                     value={localDiscount.value}
                     onValueChange={v => setLocalDiscount(prev => ({ ...prev, value: v ?? 0 }))}
                     variant={isPercentage ? 'percentage' : 'currency'}
                     showPrefix={!isPercentage}
                     onKeyDown={e => (e as any).key === 'Enter' && handleSubmit()}
                     // Input minimalista
                     className={`
                        [&>input]:w-full [&>input]:bg-transparent [&>input]:border-b [&>input]:border-border 
                        [&>input]:text-center [&>input]:text-3xl [&>input]:font-bold [&>input]:text-text-main 
                        [&>input]:outline-none [&>input]:transition-colors [&>input]:py-1 [&>input]:h-auto
                        ${
                           isPercentage
                              ? '[&>input]:focus:border-primary'
                              : '[&>input]:focus:border-success'
                        }
                     `}
                  />
               </div>

               <div className="mt-3 bg-canvas/50 py-1.5 rounded border border-border/50">
                  <span className="text-xs text-text-muted mr-2">Descuento Real:</span>
                  <span className="font-mono text-text-main font-bold text-sm">
                     <SmartNumber value={previewDiscountAmount} variant="currency" />
                  </span>
               </div>
            </div>

            <div className="flex gap-2">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="flex-1 border-border bg-transparent hover:bg-surface-highlight text-text-secondary"
               >
                  Cancelar
               </Button>
               <Button
                  onClick={handleSubmit}
                  size="sm"
                  variant={isPercentage ? 'primary' : 'primary'} // Opcional: Podría ser verde si es monto fijo
                  className={`flex-1 ${
                     !isPercentage
                        ? 'bg-success hover:bg-emerald-500 text-white shadow-success/20'
                        : ''
                  }`}
               >
                  Aplicar
               </Button>
            </div>
         </div>
      </Modal>
   );
};
