import { type ReactNode } from 'react';
import { HiOutlineBars3 } from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

type PageHeaderProps = {
   title?: ReactNode;
   search?: ReactNode;
   info?: ReactNode;
   actions?: ReactNode;
   className?: string;
};

export const PageHeader = ({ title, search, info, actions, className }: PageHeaderProps) => {
   const { toggleMobileMenu } = useUIStore();

   return (
      <header
         className={cn(
            'sticky top-0 z-30 flex items-center w-full h-16 px-4 md:px-6',
            'bg-canvas/80 backdrop-blur-xl shadow-sm border-b border-border/40',
            'gap-4',
            className,
         )}
      >
         {/* 1. Left: Mobile Menu + Title */}
         <div
            className={cn('flex items-center gap-3 shrink-0', search ? 'hidden md:flex' : 'flex')}
         >
            <button
               onClick={toggleMobileMenu}
               className="md:hidden text-text-muted hover:text-text-main transition-colors cursor-pointer p-1 -ml-1"
            >
               <HiOutlineBars3 size={24} />
            </button>

            {typeof title === 'string' ? (
               <h1 className="text-xl font-bold text-text-main tracking-tight truncate">{title}</h1>
            ) : (
               title
            )}
         </div>

         {/* 2. Center: Search Area (Flexible) */}
         <div className="flex-1 flex justify-start md:justify-center min-w-0">
            {search && (
               <div className="w-full max-w-[600px] transition-all duration-300">
                  <div className="flex items-center gap-3 w-full">
                     <button
                        onClick={toggleMobileMenu}
                        className="md:hidden text-text-muted hover:text-text-main shrink-0"
                     >
                        <HiOutlineBars3 size={24} />
                     </button>
                     {search}
                  </div>
               </div>
            )}
         </div>

         {/* 3. Right: Info + Actions */}
         <div className="flex items-center gap-3 shrink-0">
            {info && (
               <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-surface-highlight/40 rounded-lg border border-border/20">
                  {info}
               </div>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
         </div>
      </header>
   );
};
