import { cn } from '../../utils/cn';

// Types
import { type ComponentProps } from 'react';

type InputProps = {
   label?: string;
   startIcon?: React.ReactNode;
   focusVariant?: 'blue' | 'zinc' | 'none';
} & Omit<ComponentProps<'input'>, 'prefix'>;

export const Input = ({
   label,
   id,
   name,
   className = '',
   startIcon,
   focusVariant = 'blue',
   ...props
}: InputProps) => {
   const inputId = id || name;

   return (
      <div className="w-full">
         {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-1.5">
               {label}
            </label>
         )}
         <div className="relative">
            {startIcon && (
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium pointer-events-none select-none">
                  {startIcon}
               </div>
            )}
            <input
               id={inputId}
               name={name}
               className={cn(
                  'w-full bg-zinc-800/50 border border-zinc-800 text-zinc-200 placeholder:text-zinc-500',
                  'rounded-lg px-3 py-2.5 outline-none',
                  focusVariant === 'blue' && 'focus:border-blue-500/70 focus:bg-zinc-800',
                  focusVariant === 'zinc' && 'focus:border-zinc-700 focus:bg-zinc-800',
                  'hover:border-zinc-700 hover:bg-zinc-800',
                  'transition-all text-sm',
                  startIcon && 'pl-11',
                  className,
               )}
               {...props}
            />
         </div>
      </div>
   );
};
