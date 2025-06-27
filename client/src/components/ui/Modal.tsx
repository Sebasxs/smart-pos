import { type ReactNode, useEffect } from 'react';

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   className?: string;
};

export const Modal = ({ isOpen, onClose, children, className = '' }: ModalProps) => {
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            onClose();
         }
      };

      if (isOpen) {
         document.body.style.overflow = 'hidden';
         document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
         document.body.style.overflow = 'unset';
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [isOpen, onClose]);

   if (!isOpen) {
      return null;
   }

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
         onClick={onClose}
      >
         <div
            className={`
               bg-zinc-900 border border-zinc-800 
               rounded-3xl shadow-lg shadow-black/50 
               w-fit h-fit max-h-[90vh] max-w-[95vw] overflow-y-auto custom-scrollbar
               animate-in zoom-in-95 duration-200
               ${className}
            `}
            onClick={e => e.stopPropagation()}
         >
            {children}
         </div>
      </div>
   );
};
