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
         <div className="p-5 text-center w-[340px]">
            <h3 className="text-lg font-bold mb-5 text-white">Aplicar Descuento</h3>

            {/* CAMBIO: Toggle compacto estilo PaymentWidget pero con colores específicos */}
            <div className="bg-zinc-800 p-1 rounded-lg flex gap-1 mb-6 border border-zinc-700/50">
               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'percentage' }))}
                  className={`
                     flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all cursor-pointer border
                     ${
                        localDiscount.type === 'percentage'
                           ? 'bg-blue-500/20 text-white border-blue-500/50 shadow-sm' // Activo Azul
                           : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50' // Inactivo
                     }
                  `}
               >
                  <HiOutlineReceiptPercent size={18} />
                  <span>Porcentaje</span>
               </button>

               <button
                  onClick={() => setLocalDiscount(prev => ({ ...prev, type: 'fixed' }))}
                  className={`
                     flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all cursor-pointer border
                     ${
                        localDiscount.type === 'fixed'
                           ? 'bg-green-500/20 text-white border-green-500/50 shadow-sm' // Activo Verde
                           : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-700/50' // Inactivo
                     }
                  `}
               >
                  <HiOutlineCurrencyDollar size={18} />
                  <span>Monto Fijo</span>
               </button>
            </div>

            <div className="mb-6">
               <div className="relative max-w-[180px] mx-auto">
                  <input
                     ref={inputRef}
                     type="text"
                     value={localDiscount.value.toLocaleString('es-CO')}
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}
                     className={`
                        w-full bg-zinc-900 border rounded-lg px-4 py-2 text-center text-2xl font-bold text-white
                        outline-none transition-colors
                        ${
                           localDiscount.type === 'percentage'
                              ? 'focus:border-blue-500/50 border-zinc-700'
                              : 'focus:border-green-500/50 border-zinc-700'
                        }
                     `}
                  />
                  <span
                     className={`
                     absolute right-4 top-1/2 -translate-y-1/2 font-bold
                     ${
                        localDiscount.type === 'percentage'
                           ? 'text-blue-500' // Icono azul si es porcentaje
                           : 'text-green-500' // Icono verde si es fijo
                     }
                  `}
                  >
                     {localDiscount.type === 'percentage' ? '%' : '$'}
                  </span>
               </div>
               <div className="mt-3 flex flex-row justify-center items-center gap-2 text-sm">
                  <span className="text-zinc-400">Descuento real:</span>
                  <span className="text-zinc-200 font-bold bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                     ${previewDiscountAmount.toLocaleString('es-CO')}
                  </span>
               </div>
            </div>

            <div className="flex gap-2 justify-center">
               <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium cursor-pointer text-sm"
               >
                  Cancelar
               </button>
               <button
                  onClick={handleSubmit}
                  className={`
                     flex-1 py-2.5 rounded-lg text-white transition-colors font-bold cursor-pointer text-sm shadow-lg
                     ${
                        localDiscount.type === 'percentage'
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
