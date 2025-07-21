import { useEffect } from 'react';
import { Modal } from './Modal';
import { HiOutlineExclamationCircle, HiOutlineXMark } from 'react-icons/hi2';

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
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 animate-in zoom-in duration-300 border border-red-500/20">
               <HiOutlineExclamationCircle size={36} />
            </div>

            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>

            <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800 mb-6 text-sm text-zinc-400 leading-relaxed">
               {message}
            </div>

            <button
               onClick={onClose}
               className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm border border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-2 group"
            >
               <span>Cerrar</span>
               <HiOutlineXMark className="group-hover:text-white transition-colors" size={18} />
            </button>
         </div>
      </Modal>
   );
};
