import { type ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

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
         : 'animate-in zoom-in-95 fade-in duration-200';

   return createPortal(
      <div
         ref={overlayRef}
         className={cn(
            'fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm p-4 transition-all',
            'items-start md:items-center pt-12 md:pt-4',
         )}
         onMouseDown={e => {
            if (e.target === overlayRef.current) onClose();
         }}
      >
         <div
            className={cn(
               'bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/80 rounded-3xl overflow-hidden flex flex-col',
               variant === 'center' ? 'w-full md:w-fit md:min-w-[300px]' : 'w-full max-w-2xl',
               'max-h-[90vh] md:max-h-[85vh]',
               contentAnimation,
               className,
            )}
            onMouseDown={e => e.stopPropagation()}
         >
            {children}
         </div>
      </div>,
      document.body,
   );
};
