import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
   className?: string;
   variant?: 'center' | 'search';
};

export const Modal = ({
   isOpen,
   onClose,
   children,
   className = '',
   variant = 'center',
}: ModalProps) => {
   const overlayRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') onClose();
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

   if (!isOpen) return null;

   const contentAnimation =
      variant === 'search'
         ? 'animate-in fade-in slide-in-from-top-4 duration-200'
         : 'animate-in zoom-in-95 duration-200';

   return createPortal(
      <div
         ref={overlayRef}
         className={`fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm p-4 transition-all items-center`}
         onMouseDown={e => {
            if (e.target === overlayRef.current) onClose();
         }}
      >
         <div
            className={`
               bg-zinc-900 border border-zinc-800 
               shadow-2xl shadow-black/80 
               max-h-[85vh] overflow-hidden
               ${
                  variant === 'center'
                     ? 'w-fit min-w-[300px] rounded-3xl' // CAMBIO: w-fit ajusta al contenido, min-w evita que sea muy delgado
                     : 'w-full max-w-2xl rounded-3xl' // Search se mantiene ancho
               }
               ${contentAnimation}
               ${className}
            `}
            onMouseDown={e => e.stopPropagation()}
         >
            {children}
         </div>
      </div>,
      document.body,
   );
};
