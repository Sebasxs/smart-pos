import { type ReactNode } from 'react';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

type PageHeaderProps = {
   children: ReactNode;
   className?: string;
};

export const PageHeader = ({ children, className }: PageHeaderProps) => {
   const { toggleMobileMenu } = useUIStore();

   return (
      <header
         className={cn(
            // Estructura base: Sticky, altura fija, blur
            'sticky top-0 z-20 flex items-center w-full h-16 px-4 md:px-6',
            'bg-canvas/80 backdrop-blur-lg shadow-xl shadow-black/5',
            // Gap por defecto para separar el botón móvil del contenido
            'gap-3',
            className,
         )}
      >
         {/* Elemento 1: Botón Menú (Solo visible en móvil) */}
         <button
            onClick={toggleMobileMenu}
            className="md:hidden text-text-muted hover:text-text-main transition-colors cursor-pointer shrink-0"
         >
            <HiOutlineBars3 size={24} />
         </button>

         {/* Elemento 2+: Contenido de la página (Items directos del flex) */}
         {children}
      </header>
   );
};
