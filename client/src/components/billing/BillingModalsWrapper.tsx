import { ProductSearchModal } from './ProductSearchModal';
import { CustomerSearchModal } from './CustomerSearchModal';
import { CreateCustomerModal } from './CreateCustomerModal';
import { DiscountModal } from './DiscountModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { PaymentSuccessModal } from './PaymentSuccessModal';
import { ErrorModal } from '../ui/ErrorModal';
import { useAuthStore } from '../../store/authStore';

import type { BillingModalState } from '../../hooks/useBillingModals';

type BillingModalsWrapperProps = {
   modals: BillingModalState;
   toggleModal: (key: keyof BillingModalState, value: boolean) => void;
   handlers: {
      onSelectProduct: (prod: any) => void;
      onSelectClient: (client: any) => void;
      onCreateClientRequest: (name: string) => void;
      onClientCreated: (client: any) => void;
      onDiscountApply: (disc: any) => void;
      onDiscardConfirm: () => void;
      onSuccessClose: () => void;
   };
   data: {
      createClientName: string;
      discount: any;
      subtotal: number;
      total: number;
      finalizedPayments: any[];
      generatedInvoiceNumber: string;
      generatedInvoiceId?: number;
      errorMessage: string;
   };
};

export const BillingModalsWrapper = ({
   modals,
   toggleModal,
   handlers,
   data,
}: BillingModalsWrapperProps) => {
   const { user } = useAuthStore();

   return (
      <>
         <ProductSearchModal
            isOpen={modals.productSearch}
            onClose={() => toggleModal('productSearch', false)}
            onSelectProduct={handlers.onSelectProduct}
         />

         <CustomerSearchModal
            isOpen={modals.clientSearch}
            onClose={() => toggleModal('clientSearch', false)}
            onSelectClient={handlers.onSelectClient}
            onRequestCreate={handlers.onCreateClientRequest}
         />

         <CreateCustomerModal
            isOpen={modals.clientCreate}
            onClose={() => toggleModal('clientCreate', false)}
            initialName={data.createClientName}
            onCustomerCreated={handlers.onClientCreated}
         />

         <DiscountModal
            isOpen={modals.discount}
            onClose={() => toggleModal('discount', false)}
            onApply={handlers.onDiscountApply}
            currentDiscount={data.discount}
            subtotal={data.subtotal}
         />

         <ConfirmModal
            isOpen={modals.discardConfirm}
            onClose={() => toggleModal('discardConfirm', false)}
            onConfirm={handlers.onDiscardConfirm}
            title="¿Descartar factura?"
            message="Eliminarás todos los productos agregados."
         />

         <PaymentSuccessModal
            isOpen={modals.success}
            onClose={handlers.onSuccessClose}
            total={data.total}
            payments={data.finalizedPayments}
            invoiceNumber={data.generatedInvoiceNumber || 'Pendiente'}
            invoiceId={data.generatedInvoiceId}
            cashierName={user?.full_name || user?.nickname || 'Cajero'}
         />

         <ErrorModal
            isOpen={modals.error}
            onClose={() => toggleModal('error', false)}
            message={data.errorMessage}
         />
      </>
   );
};
