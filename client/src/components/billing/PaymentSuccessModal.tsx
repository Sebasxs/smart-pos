import { Modal } from '../ui/Modal';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

type PaymentSuccessModalProps = {
   isOpen: boolean;
   onClose: () => void;
   total: number;
   paymentMethod: 'cash' | 'transfer';
   change: number;
   cashReceived: number;
};

export const PaymentSuccessModal = ({
   isOpen,
   onClose,
   total,
   paymentMethod,
   change,
   cashReceived,
}: PaymentSuccessModalProps) => {
   const formatCurrency = (val: number) => val.toLocaleString('es-CO');

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-6 text-center mx-auto">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
               <HiOutlineCheckCircle size={48} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">¡Venta Exitosa!</h2>
            <p className="text-zinc-400 mb-8 text-sm">La factura se ha generado correctamente.</p>

            <div className="bg-zinc-900 rounded-xl p-4 mb-8 space-y-3 border border-zinc-800">
               <div className="flex justify-between text-zinc-400">
                  <span>Total Pagado</span>
                  <span className="font-medium text-white">${formatCurrency(total)}</span>
               </div>

               {paymentMethod === 'cash' && cashReceived > 0 && (
                  <>
                     <div className="flex justify-between text-zinc-400 text-sm">
                        <span>Efectivo Recibido</span>
                        <span>${formatCurrency(cashReceived)}</span>
                     </div>
                     <div className="border-t border-zinc-800 my-2 pt-2 flex justify-between items-center">
                        <span className="text-green-400 font-bold pr-16">Cambio</span>
                        <span className="text-3xl font-black text-green-400">
                           ${formatCurrency(change)}
                        </span>
                     </div>
                  </>
               )}
            </div>

            <button
               onClick={onClose}
               autoFocus
               className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
            >
               Continuar
            </button>
         </div>
      </Modal>
   );
};
