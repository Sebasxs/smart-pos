import { forwardRef } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
   onClear?: () => void;
   shortcutLabel?: string;
   containerClassName?: string;
   iconClassName?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
   (
      { value, onClear, shortcutLabel, containerClassName, iconClassName, className, ...props },
      ref,
   ) => {
      const hasValue = String(value || '').length > 0;

      return (
         <div
            className={cn(
               'relative group h-10 w-full transition-all duration-300',
               containerClassName,
            )}
         >
            <div
               className={cn(
                  'absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none z-10',
                  iconClassName,
               )}
            >
               <HiOutlineMagnifyingGlass size={18} />
            </div>

            <input
               ref={ref}
               value={value}
               autoComplete="off"
               className={cn(
                  'w-full h-full bg-surface-highlight/40 border border-transparent',
                  'text-sm text-text-main placeholder:text-text-dim rounded-xl',
                  'pl-10 pr-10 outline-none transition-all',
                  'focus:bg-surface-active/60 focus:border-border-focus focus:shadow-sm hover:border-border-hover',
                  className,
               )}
               {...props}
            />

            {hasValue && onClear && (
               <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-main p-0.5 rounded-full cursor-pointer transition-colors"
                  tabIndex={-1}
               >
                  <HiOutlineXMark size={16} />
               </button>
            )}

            {!hasValue && shortcutLabel && (
               <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center pointer-events-none opacity-50">
                  <kbd className="bg-surface-active text-text-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border">
                     {shortcutLabel}
                  </kbd>
               </div>
            )}
         </div>
      );
   },
);

SearchInput.displayName = 'SearchInput';
