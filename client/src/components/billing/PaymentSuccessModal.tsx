import { Modal } from '../ui/Modal';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { TicketView } from './TicketView';
import { useBillingStore } from '../../store/billingStore';

type PaymentSuccessModalProps = {
   isOpen: boolean;
   onClose: () => void;
   total: number;
   paymentMethod: 'cash' | 'transfer';
   change: number;
   cashReceived: number;
   invoiceId?: number;
};

export const PaymentSuccessModal = ({
   isOpen,
   onClose,
   total,
   paymentMethod,
   change,
   cashReceived,
   invoiceId,
}: PaymentSuccessModalProps) => {
   const { items, discount, checkoutData } = useBillingStore();

   const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-fit">
         <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
            {/* VISTA PREVIA DEL TICKET */}
            <div className="flex-1 bg-zinc-950/50 p-8 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar relative">
               <div className="absolute top-4 left-0 right-0 text-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Vista Previa Ticket
               </div>

               <div className="mt-6 transform scale-90 md:scale-100 origin-top shadow-2xl">
                  <TicketView
                     invoiceId={invoiceId}
                     customer={checkoutData.customer}
                     items={items}
                     subtotal={subtotal}
                     discount={
                        discount.type === 'fixed'
                           ? discount.value
                           : Math.round(subtotal * (discount.value / 100))
                     }
                     total={total}
                     paymentMethod={paymentMethod}
                     cashReceived={cashReceived}
                     change={change}
                  />
               </div>
            </div>

            {/* CONFIRMACIÓN */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-zinc-800">
               <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                  <HiOutlineCheckCircle size={48} />
               </div>

               <h2 className="text-3xl font-bold text-white mb-2">¡Venta Exitosa!</h2>
               <p className="text-zinc-400 mb-8">
                  La factura <strong className="text-zinc-200">#{invoiceId}</strong> se ha generado
                  correctamente.
               </p>

               <div className="w-full max-w-xs">
                  <button
                     onClick={onClose}
                     autoFocus
                     className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-900/20 transition-all cursor-pointer active:scale-[0.98] focus:outline-none"
                  >
                     Nueva Venta
                  </button>
               </div>
            </div>
         </div>
      </Modal>
   );
};
