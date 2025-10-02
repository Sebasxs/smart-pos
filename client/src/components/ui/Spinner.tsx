import { CgSpinner } from 'react-icons/cg';
import { cn } from '../../utils/cn';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'white' | 'dim' | 'brand';

type SpinnerProps = {
   size?: SpinnerSize;
   variant?: SpinnerVariant;
   className?: string;
};

const sizes: Record<SpinnerSize, string> = {
   sm: 'w-4 h-4',
   md: 'w-6 h-6',
   lg: 'w-8 h-8',
   xl: 'w-12 h-12',
};

const variants: Record<SpinnerVariant, string> = {
   primary: 'text-primary',
   white: 'text-white',
   dim: 'text-text-dim',
   brand: 'text-brand-dashboard-main',
};

export const Spinner = ({ size = 'md', variant = 'primary', className }: SpinnerProps) => {
   return (
      <CgSpinner
         className={cn('animate-spin', sizes[size], variants[variant], className)}
         aria-label="Cargando"
      />
   );
};
