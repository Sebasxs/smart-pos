import { useEffect } from 'react';
import { Modal } from './Modal';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

type ConfirmModalProps = {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message?: string;
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) => {
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Enter') {
            onConfirm();
            onClose();
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [isOpen, onClose, onConfirm]);

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="p-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <HiOutlineExclamationTriangle size={32} />
            </div>

            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="w-80 text-zinc-400 mb-6">{message}</p>

            <div className="flex gap-3 justify-center">
               <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium cursor-pointer"
               >
                  Cancelar
               </button>
               <button
                  onClick={() => {
                     onConfirm();
                     onClose();
                  }}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-bold cursor-pointer"
               >
                  Confirmar
               </button>
            </div>
         </div>
      </Modal>
   );
};
