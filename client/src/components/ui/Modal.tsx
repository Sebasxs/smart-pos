import { type ReactNode, useEffect } from 'react';

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            onClose();
         }
      };

      if (isOpen) {
         document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [isOpen, onClose]);

   if (!isOpen) {
      return null;
   }

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
         onClick={onClose}
      >
         <div
            className="bg-black rounded-4xl shadow-md w-full max-w-xl p-4"
            onClick={e => e.stopPropagation()}
         >
            {children}
         </div>
      </div>
   );
};
