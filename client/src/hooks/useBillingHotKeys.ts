import { useEffect } from 'react';
import { type BillingModalState } from './useBillingModals';

type UseBillingHotkeysProps = {
   modals: BillingModalState;
   itemsLength: number;
   isPaymentValid: boolean;
   onProductSearch: () => void;
   onClientSearch: () => void;
   onDiscount: () => void;
   onDiscard: () => void;
   onProcessPayment: () => void;
   onSmartEnter: () => void;
};

/**
 * Custom hook to handle global keyboard shortcuts for the billing page.
 * Prevents execution when inputs are focused or modals are open.
 */
export const useBillingHotkeys = ({
   modals,
   itemsLength,
   isPaymentValid,
   onProductSearch,
   onClientSearch,
   onDiscount,
   onDiscard,
   onProcessPayment,
   onSmartEnter,
}: UseBillingHotkeysProps) => {
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         const target = event.target as HTMLElement;
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
         const isAnyModalOpen = Object.values(modals).some(Boolean);

         if (isAnyModalOpen) return;
         if (isInputFocused) return;

         switch (event.code) {
            case 'Space':
               event.preventDefault();
               onProductSearch();
               break;
            case 'KeyC':
               event.preventDefault();
               onClientSearch();
               break;
            case 'KeyD':
               event.preventDefault();
               onDiscount();
               break;
            case 'KeyX':
               event.preventDefault();
               if (itemsLength > 0) onDiscard();
               break;
            case 'Enter':
               event.preventDefault();
               if (isPaymentValid) {
                  onProcessPayment();
               } else if (itemsLength > 0) {
                  onSmartEnter();
               }
               break;
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [
      modals,
      itemsLength,
      isPaymentValid,
      onProductSearch,
      onClientSearch,
      onDiscount,
      onDiscard,
      onProcessPayment,
      onSmartEnter,
   ]);
};
