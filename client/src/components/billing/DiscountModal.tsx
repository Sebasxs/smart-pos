import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { type Discount } from '../../types/billing';
import { HiOutlineCurrencyDollar, HiOutlineReceiptPercent } from 'react-icons/hi2';

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
         setTimeout(() => {
            setLocalDiscount(currentDiscount);
            if (inputRef.current) {
               inputRef.current.focus();
               inputRef.current.select();
            }
         }, 100);
      }
   }, [isOpen, currentDiscount]);

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSubmit();
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setLocalDiscount(prev => ({ ...prev, value: Number(raw) }));
   };

   const handleSubmit = () => {
      onApply(localDiscount);
      onClose();
   };

   const previewDiscountAmount =
      localDiscount.type === 'percentage'
         ? Math.round(subtotal * (localDiscount.value / 100))
         : localDiscount.value;

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-4 text-center">
            <h3 className="text-xl font-bold mb-6 text-white">Aplicar Descuento</h3>

            <div className="flex justify-center gap-4 mb-6">
               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'percentage' }))}
                  className={`
                     flex flex-col items-center justify-center w-24 h-20 rounded-xl border-2 transition-all
                     ${
                        localDiscount.type === 'percentage'
                           ? 'border-blue-500 bg-blue-500/20 text-white'
                           : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                     }
                  `}
               >
                  <HiOutlineReceiptPercent size={24} className="mb-1" />
                  <span className="font-semibold">Porcentaje</span>
               </button>

               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'fixed' }))}
                  className={`
                     flex flex-col items-center justify-center w-24 h-20 rounded-xl border-2 transition-all
                     ${
                        localDiscount.type === 'fixed'
                           ? 'border-green-500 bg-green-500/20 text-white'
                           : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                     }
                  `}
               >
                  <HiOutlineCurrencyDollar size={24} className="mb-1" />
                  <span className="font-semibold">Monto Fijo</span>
               </button>
            </div>

            <div className="mb-6">
               <div className="relative max-w-[200px] mx-auto">
                  <input
                     ref={inputRef}
                     type="text"
                     value={localDiscount.value.toLocaleString('es-CO')}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}
                     className="
                        w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-bold text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                     "
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                     {localDiscount.type === 'percentage' ? '%' : '$'}
                  </span>
               </div>
               <p className="mt-2 text-zinc-400 text-sm">
                  Descuento real:{' '}
                  <span className="text-white font-bold">
                     ${previewDiscountAmount.toLocaleString('es-CO')}
                  </span>
               </p>
            </div>

            <div className="flex gap-3 justify-center">
               <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium cursor-pointer"
               >
                  Cancelar
               </button>
               <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-bold cursor-pointer"
               >
                  Confirmar
               </button>
            </div>
         </div>
      </Modal>
   );
};
