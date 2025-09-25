import { useState, useCallback } from 'react';

export type BillingModalState = {
   productSearch: boolean;
   clientSearch: boolean;
   clientCreate: boolean;
   discount: boolean;
   discardConfirm: boolean;
   success: boolean;
   error: boolean;
};

const initialModals: BillingModalState = {
   productSearch: false,
   clientSearch: false,
   clientCreate: false,
   discount: false,
   discardConfirm: false,
   success: false,
   error: false,
};

/**
 * Custom hook to manage the visibility state of various billing modals.
 * Provides a centralized way to toggle specific modals.
 */
export const useBillingModals = () => {
   const [modals, setModals] = useState<BillingModalState>(initialModals);

   const toggleModal = useCallback((key: keyof BillingModalState, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
   }, []);

   return {
      modals,
      toggleModal,
   };
};
