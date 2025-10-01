import { useEffect } from 'react';
import { Modal } from './Modal';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Button } from './Button';

type ErrorModalProps = {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   message: string;
};

export const ErrorModal = ({
   isOpen,
   onClose,
   title = 'Ocurrió un error',
   message,
}: ErrorModalProps) => {
   useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onClose]);

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-6 text-center w-full md:w-[400px]">
            {/* Icono animado */}
            <div className="w-16 h-16 bg-danger-bg text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 animate-in zoom-in duration-300 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
               <HiOutlineExclamationCircle size={36} />
            </div>

            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>

            <div className="bg-canvas/50 rounded-xl p-4 border border-border mb-6 text-sm text-text-secondary leading-relaxed break-words shadow-inner">
               {message}
            </div>

            <Button onClick={onClose} autoFocus variant="secondary" className="w-full">
               Entendido
            </Button>
         </div>
      </Modal>
   );
};
