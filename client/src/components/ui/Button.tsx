import { cn } from '../../utils/cn';
import { Spinner } from './Spinner';
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
      'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 active:scale-[0.98]',
   secondary:
      'bg-surface hover:bg-surface-highlight text-text-muted hover:text-text-secondary shadow-sm active:scale-[0.98]',
   outline:
      'bg-transparent border border-border text-text-secondary hover:bg-surface-highlight hover:text-text-main active:scale-[0.98]',
   ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-surface-highlight active:scale-[0.98]',
   danger:
      'bg-danger/10 text-danger hover:bg-danger hover:text-white shadow-sm active:scale-[0.98]',
   success:
      'bg-success/10 text-success hover:bg-success hover:text-white shadow-sm active:scale-[0.98]',
   warning:
      'bg-warning/10 text-warning hover:bg-warning hover:text-white shadow-sm active:scale-[0.98]',
   disabled: 'bg-disabled-bg text-disabled-text opacity-50 shadow-none cursor-not-allowed',
   white: 'bg-text-main text-canvas hover:bg-text-secondary shadow-md active:scale-[0.98]',
   dark: 'bg-canvas text-text-secondary hover:bg-surface hover:text-text-main active:scale-[0.98]',
   dashboard:
      'bg-brand-dashboard-solid text-text-main hover:bg-brand-dashboard-solid-hover shadow-lg shadow-brand-dashboard-solid/20 active:scale-[0.98]',
};

const sizes: Record<ButtonSize, string> = {
   sm: 'px-3 py-1.5 text-xs',
   md: 'px-4 py-2.5 text-sm h-10',
   lg: 'px-6 py-3.5 text-base',
   icon: 'w-10 h-10 p-0 flex items-center justify-center',
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
   const isDisabled = disabled || isLoading;
   const effectiveVariant = isDisabled ? 'disabled' : variant;

   return (
      <button
         className={cn(
            'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none cursor-pointer',
            variants[effectiveVariant],
            sizes[size],
            isDisabled && 'pointer-events-none',
            className,
         )}
         disabled={isDisabled}
         {...props}
      >
         {isLoading && <Spinner size="sm" variant="dim" />}
         {children}
      </button>
   );
};
