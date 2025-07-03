import { useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { HiOutlineBanknotes, HiOutlineCreditCard, HiOutlineUser } from 'react-icons/hi2';
import { useBillingStore } from '../../store/billingStore';

type CheckoutModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: (data: CheckoutData) => void;
   total: number;
};

export type CheckoutData = {
   customer: {
      name: string;
      email: string;
      taxId: string;
      city: string;
   };
   paymentMethod: 'cash' | 'transfer';
   cashReceived: number;
   change: number;
};

export const CheckoutModal = ({ isOpen, onClose, onConfirm, total }: CheckoutModalProps) => {
   const { checkoutData, setCheckoutData } = useBillingStore();
   const { customer, paymentMethod, cashReceivedStr } = checkoutData;

   const nameInputRef = useRef<HTMLInputElement>(null);
   const cashReceived = parseInt(cashReceivedStr.replace(/[^0-9]/g, '') || '0', 10);
   const change = paymentMethod === 'cash' && cashReceived > total ? cashReceived - total : 0;
   const formatCurrency = (val: number) => val.toLocaleString('es-CO');

   useEffect(() => {
      if (isOpen) {
         setTimeout(() => {
            nameInputRef.current?.focus();
         }, 100);
      }
   }, [isOpen]);

   useEffect(() => {
      if (!isOpen || !isPaymentValid) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOpen, customer, paymentMethod, cashReceived]);

   const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCheckoutData({
         customer: { ...customer, [name]: value },
      });
   };

   const handlePaymentMethodChange = (method: 'cash' | 'transfer') => {
      setCheckoutData({ paymentMethod: method });
   };

   const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const formatted = raw ? parseInt(raw, 10).toLocaleString('es-CO') : '';
      setCheckoutData({ cashReceivedStr: formatted });
   };

   const handleConfirm = () => {
      onConfirm({
         customer,
         paymentMethod,
         cashReceived,
         change,
      });
      onClose();
   };

   const isPaymentValid =
      paymentMethod === 'transfer' ||
      !cashReceivedStr.length ||
      cashReceivedStr === '0' ||
      cashReceived >= total;

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-6">
            <div className="flex justify-between items-end mb-6 border-b border-zinc-800 pb-4">
               <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HiOutlineCreditCard className="text-blue-500" />
                  Confirmar Pago
               </h2>
               <div className="text-right">
                  <span className="text-zinc-400 text-sm block">Total a Pagar</span>
                  <span className="text-3xl font-black text-white">${formatCurrency(total)}</span>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
               {/* Client data */}
               <div className="lg:w-72 flex flex-col space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400 mb-4">
                     <HiOutlineUser />
                     <h3 className="font-semibold uppercase text-xs tracking-wider">
                        Datos del Cliente
                     </h3>
                  </div>

                  <Input
                     ref={nameInputRef}
                     label="Nombre / Razón Social"
                     name="name"
                     placeholder="Consumidor"
                     value={customer.name}
                     onChange={handleCustomerChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <Input
                        label="NIT / C.C."
                        name="taxId"
                        placeholder="123456789"
                        value={customer.taxId}
                        onChange={handleCustomerChange}
                     />
                     <Input
                        label="Ciudad"
                        name="city"
                        placeholder="Bogotá"
                        value={customer.city}
                        onChange={handleCustomerChange}
                     />
                  </div>
                  <Input
                     label="Email"
                     name="email"
                     type="email"
                     placeholder="cliente@ejemplo.com"
                     value={customer.email}
                     onChange={handleCustomerChange}
                  />
               </div>

               <div className="hidden lg:block w-[1px] bg-zinc-800" />

               <div className="lg:w-64 flex flex-col">
                  <h3 className="font-semibold uppercase text-xs tracking-wider text-zinc-400 mb-4">
                     Método de Pago
                  </h3>

                  <div className="flex gap-3 mb-6">
                     <button
                        onClick={() => handlePaymentMethodChange('cash')}
                        className={`
                           flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all cursor-pointer
                           ${
                              paymentMethod === 'cash'
                                 ? 'border-green-500 bg-green-500/10 text-green-400'
                                 : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                           }
                        `}
                     >
                        <HiOutlineBanknotes size={24} />
                        <span className="font-bold text-sm">Efectivo</span>
                     </button>
                     <button
                        onClick={() => handlePaymentMethodChange('transfer')}
                        className={`
                           flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all cursor-pointer
                           ${
                              paymentMethod === 'transfer'
                                 ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                                 : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                           }
                        `}
                     >
                        <HiOutlineCreditCard size={24} />
                        <span className="font-bold text-sm">Transferencia</span>
                     </button>
                  </div>

                  {paymentMethod === 'cash' && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
                        <div>
                           <label className="block text-sm text-zinc-400 mb-1">
                              Dinero Recibido
                           </label>
                           <input
                              type="text"
                              value={cashReceivedStr}
                              onChange={handleCashChange}
                              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-right text-xl font-bold text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                              placeholder="$0"
                           />
                        </div>
                        <div className="flex justify-between items-end pt-2 border-t border-zinc-700">
                           <span className="text-zinc-400 font-medium">Cambio</span>
                           <span
                              className={`text-2xl font-bold ${
                                 change > 0 ? 'text-green-400' : 'text-zinc-500'
                              }`}
                           >
                              ${formatCurrency(change)}
                           </span>
                        </div>
                     </div>
                  )}

                  <div className="mt-auto pt-4 flex gap-3">
                     <button
                        onClick={onClose}
                        className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold transition-colors cursor-pointer"
                     >
                        Cancelar
                     </button>
                     <button
                        onClick={handleConfirm}
                        disabled={!isPaymentValid}
                        className={`
                           flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold text-lg
                           shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center
                           ${
                              isPaymentValid
                                 ? 'hover:bg-blue-500 cursor-pointer'
                                 : 'cursor-not-allowed opacity-50'
                           }
                           
                        `}
                     >
                        <span>Confirmar</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </Modal>
   );
};
