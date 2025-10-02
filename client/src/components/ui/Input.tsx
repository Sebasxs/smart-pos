import { cn } from '../../utils/cn';
import { type ComponentProps } from 'react';

type InputProps = {
   label?: string;
   startIcon?: React.ReactNode;
   focusVariant?: 'neutral' | 'primary' | 'none';
   iconClassName?: string;
} & Omit<ComponentProps<'input'>, 'prefix'>;

export const Input = ({
   label,
   id,
   name,
   className = '',
   startIcon,
   iconClassName = '',
   focusVariant = 'neutral',
   ...props
}: InputProps) => {
   const inputId = id || name;
   const hasCustomColor = iconClassName.includes('text-');

   return (
      <div className="w-full group/input">
         {label && (
            <label
               htmlFor={inputId}
               className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide ml-1 transition-colors group-focus-within/input:text-text-secondary"
            >
               {label}
            </label>
         )}
         <div className="relative">
            {startIcon && (
               <div
                  className={cn(
                     'absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none transition-colors duration-300 z-10',
                     !hasCustomColor && 'text-text-dim group-focus-within/input:text-text-main',
                     iconClassName,
                  )}
               >
                  {startIcon}
               </div>
            )}
            <input
               id={inputId}
               name={name}
               className={cn(
                  'w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-300',
                  'text-text-main placeholder:text-text-dim/60 font-medium font-sans',
                  'bg-surface-highlight/40',
                  'border border-transparent hover:border-border-hover',
                  'focus:border-border-hover focus:bg-surface-active/60 focus:shadow-md focus:shadow-black/10',
                  startIcon && 'pl-11',
                  className,
               )}
               {...props}
            />
         </div>
      </div>
   );
};
