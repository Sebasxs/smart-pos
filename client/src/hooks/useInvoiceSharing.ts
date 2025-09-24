import { useState } from 'react';

type ActionType = 'email' | 'whatsapp' | null;

export const useInvoiceSharing = () => {
   const [expandedAction, setExpandedAction] = useState<ActionType>(null);
   const [isSending, setIsSending] = useState(false);
   const [sentSuccess, setSentSuccess] = useState(false);

   const toggleAction = (action: ActionType) => {
      if (expandedAction === action) {
         setExpandedAction(null);
      } else {
         setExpandedAction(action);
         setSentSuccess(false);
      }
   };

   const sendInvoice = async (value: string) => {
      if (!value || isSending) return;

      setIsSending(true);

      // Simulación de envío
      await new Promise(r => setTimeout(r, 800));

      setIsSending(false);
      setSentSuccess(true);

      setTimeout(() => {
         setSentSuccess(false);
         setExpandedAction(null);
      }, 2000);
   };

   return {
      expandedAction,
      isSending,
      sentSuccess,
      toggleAction,
      sendInvoice,
      reset: () => {
         setExpandedAction(null);
         setSentSuccess(false);
         setIsSending(false);
      },
   };
};
