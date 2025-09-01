import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { SmartNumberInput } from '../ui/SmartNumberInput';
import { SmartNumber } from '../ui/SmartNumber';
import { type Discount } from '../../types/billing';
import { HiOutlineCurrencyDollar, HiOutlineReceiptPercent } from 'react-icons/hi2';

type TypeButtonProps = {
   isActive: boolean;
   onClick: () => void;
   label: string;
   icon: React.ElementType;
   activeColor: string;
   borderColor: string;
};

const TypeButton = ({
   isActive,
   onClick,
   label,
   icon: Icon,
   activeColor,
   borderColor,
}: TypeButtonProps) => {
   // Se añade focus:outline-none para evitar bordes blancos nativos al hacer click
   const activeClass = isActive
      ? `${activeColor} text-white shadow-sm ${borderColor}`
      : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50';

   return (
      <button
         onClick={onClick}
         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all cursor-pointer border focus:outline-none ${activeClass}`}
      >
         <Icon size={18} />
         <span>{label}</span>
      </button>
   );
};

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
      }
   }, [isOpen, currentDiscount]);

   // Efecto para enfocar y seleccionar todo el texto
   // Se ejecuta al abrir y al cambiar el tipo de descuento
   useEffect(() => {
      if (isOpen) {
         setTimeout(() => {
            if (inputRef.current) {
               inputRef.current.focus();
               inputRef.current.select();
            }
         }, 50);
      }
   }, [isOpen, localDiscount.type]);

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
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-5 text-center w-[340px]">
            <h3 className="text-lg font-bold mb-5 text-white">Aplicar Descuento</h3>

            <div className="bg-zinc-800 p-1 rounded-lg flex gap-1 mb-6 border border-zinc-700/50">
               <TypeButton
                  isActive={!isPercentage}
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'fixed' }))}
                  label="Monto Fijo"
                  icon={HiOutlineCurrencyDollar}
                  activeColor="bg-green-500/20"
                  borderColor="border-green-500/50"
               />
               <TypeButton
                  isActive={isPercentage}
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'percentage' }))}
                  label="Porcentaje"
                  icon={HiOutlineReceiptPercent}
                  activeColor="bg-blue-500/20"
                  borderColor="border-blue-500/50"
               />
            </div>

            <div className="mb-6">
               <div className="relative max-w-[180px] mx-auto">
                  <SmartNumberInput
                     getInputRef={inputRef}
                     value={localDiscount.value}
                     onValueChange={v => setLocalDiscount(prev => ({ ...prev, value: v ?? 0 }))}
                     variant={isPercentage ? 'percentage' : 'currency'}
                     showPrefix={!isPercentage}
                     onKeyDown={e => (e as any).key === 'Enter' && handleSubmit()}
                     className={`[&>input]:w-full [&>input]:bg-zinc-900 [&>input]:border [&>input]:rounded-lg [&>input]:px-4 [&>input]:py-2 [&>input]:text-center [&>input]:text-2xl [&>input]:font-bold [&>input]:text-white [&>input]:outline-none [&>input]:transition-colors [&>input]:border-zinc-700 ${
                        isPercentage
                           ? '[&>input]:focus:border-blue-500/50'
                           : '[&>input]:focus:border-green-500/50'
                     }`}
                  />
               </div>
               <div className="mt-3 flex flex-row justify-center items-center gap-2 text-sm">
                  <span className="text-zinc-400">Descuento real:</span>
                  <span className="text-zinc-200 font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                     <SmartNumber value={previewDiscountAmount} variant="currency" />
                  </span>
               </div>
            </div>

            <div className="flex gap-2 justify-center">
               <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium cursor-pointer text-sm focus:outline-none"
               >
                  Cancelar
               </button>
               <button
                  onClick={handleSubmit}
                  className={`
                     flex-1 py-2.5 rounded-lg text-white transition-colors font-bold cursor-pointer text-sm shadow-lg focus:outline-none
                     ${
                        isPercentage
                           ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                           : 'bg-green-600 hover:bg-green-500 shadow-green-900/20'
                     }
                  `}
               >
                  Confirmar
               </button>
            </div>
         </div>
      </Modal>
   );
};
