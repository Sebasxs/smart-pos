import { cn } from '../../utils/cn';
import { HiOutlineArrowPath } from 'react-icons/hi2';

// Types
import { type ComponentProps } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type ButtonProps = ComponentProps<'button'> & {
   variant?: ButtonVariant;
   size?: ButtonSize;
   isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
   primary: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 border border-transparent',
   secondary: 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800',
   outline: 'bg-transparent border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white',
   ghost: 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50',
   danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20 border border-transparent',
};

const sizes: Record<ButtonSize, string> = {
   sm: 'px-3 py-1.5 text-xs',
   md: 'px-4 py-2 text-sm',
   lg: 'px-6 py-3 text-base',
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
   return (
      <button
         className={cn(
            "rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "active:scale-[0.98] hover:scale-[1.02]",
            variants[variant],
            sizes[size],
            className
         )}
         disabled={disabled || isLoading}
         {...props}
      >
         {isLoading && (
            <HiOutlineArrowPath className="animate-spin" size={16} />
         )}
         {children}
      </button>
   );
};
