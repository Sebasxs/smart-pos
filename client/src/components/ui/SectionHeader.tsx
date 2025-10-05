import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

type SectionHeaderProps = {
   title: string | ReactNode;
   icon?: React.ElementType;
   iconClassName?: string;
   iconContainerClassName?: string;
   actions?: ReactNode;
   className?: string;
};

export const SectionHeader = ({
   title,
   icon: Icon,
   iconClassName = 'text-text-muted',
   iconContainerClassName,
   actions,
   className,
}: SectionHeaderProps) => {
   return (
      <div
         className={cn(
            'h-[48px] px-5 shrink-0 flex items-center justify-between',
            'bg-surface-highlight/50 backdrop-blur-sm border-b border-border/40',
            className,
         )}
      >
         <div className="flex items-center gap-3 min-w-0">
            {Icon && (
               <div
                  className={cn(
                     'p-1.5 rounded-lg shrink-0 flex items-center justify-center',
                     iconContainerClassName || 'bg-transparent',
                  )}
               >
                  <Icon className={cn('w-4 h-4', iconClassName)} />
               </div>
            )}
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider truncate">
               {title}
            </h3>
         </div>
         {actions && <div className="flex items-center gap-2 pl-2">{actions}</div>}
      </div>
   );
};
