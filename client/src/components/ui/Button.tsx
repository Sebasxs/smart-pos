import { cn } from '../../utils/cn';
import { HiOutlineArrowPath } from 'react-icons/hi2';

// Types
import { type ComponentProps } from 'react';

type ButtonVariant =
   | 'primary'
   | 'secondary'
   | 'outline'
   | 'ghost'
   | 'danger'
   | 'success'
   | 'warning'
   | 'disabled'
   | 'white'
   | 'dark'
   | 'dashboard';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = ComponentProps<'button'> & {
   variant?: ButtonVariant;
   size?: ButtonSize;
   isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
   primary:
      'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 active:scale-[0.98] cursor-pointer',
   secondary:
      'bg-surface hover:bg-surface-highlight text-text-muted hover:text-text-secondary shadow-sm active:scale-[0.98] cursor-pointer',
   outline:
      'bg-transparent border border-border text-text-secondary hover:bg-surface-highlight hover:text-text-main active:scale-[0.98] cursor-pointer',
   ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-surface-highlight active:scale-[0.98] cursor-pointer',
   danger:
      'bg-danger/10 text-danger hover:bg-danger hover:text-white shadow-sm active:scale-[0.98] cursor-pointer',
   success:
      'bg-success/10 text-success hover:bg-success hover:text-white shadow-sm active:scale-[0.98] cursor-pointer',
   warning:
      'bg-warning/10 text-warning hover:bg-warning hover:text-white shadow-sm active:scale-[0.98] cursor-pointer',
   disabled:
      'bg-disabled-bg text-disabled-text cursor-not-allowed opacity-50 shadow-none pointer-events-none cursor-not-allowed',
   white: 'bg-text-main text-canvas hover:bg-text-secondary shadow-md active:scale-[0.98] cursor-pointer',
   dark: 'bg-canvas text-text-secondary hover:bg-surface hover:text-text-main active:scale-[0.98] cursor-pointer',
   dashboard:
      'bg-brand-dashboard-solid text-text-main hover:bg-brand-dashboard-solid-hover shadow-lg shadow-brand-dashboard-solid/20 active:scale-[0.98] cursor-pointer',
};

const sizes: Record<ButtonSize, string> = {
   sm: 'px-3 py-1.5 text-xs',
   md: 'px-4 py-2 text-sm',
   lg: 'px-6 py-3.5 text-base',
   icon: 'p-2',
};

export const Button = ({
   className,
   variant = 'primary',
   size = 'md',
   isLoading,
   children,
   disabled,
   ...props
}: ButtonProps) => {
   const effectiveVariant = disabled || isLoading ? 'disabled' : variant;

   return (
      <button
         className={cn(
            'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none',
            variants[effectiveVariant],
            sizes[size],
            className,
         )}
         disabled={disabled || isLoading}
         {...props}
      >
         {isLoading && <HiOutlineArrowPath className="animate-spin" size={18} />}
         {children}
      </button>
   );
};
