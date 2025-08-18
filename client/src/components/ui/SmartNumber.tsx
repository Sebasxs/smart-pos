import { usePreferencesStore } from '../../store/usePreferencesStore';
import { formatNumber, type NumberVariant } from '../../lib/formatNumber';
import { twMerge } from 'tailwind-merge';

interface SmartNumberProps {
   value: number | null | undefined;
   variant: NumberVariant;
   dianUnitCode?: string;
   maxDecimals?: number;
   showPrefix?: boolean;
   className?: string;
}

export function SmartNumber({
   value,
   variant,
   dianUnitCode,
   maxDecimals,
   showPrefix = true,
   className,
}: SmartNumberProps) {
   const { currencyDecimalPreference } = usePreferencesStore();

   const formatted = formatNumber(value, {
      variant,
      dianUnitCode,
      maxDecimals,
      decimalPreference: currencyDecimalPreference,
      showPrefix,
   });

   return <span className={twMerge('font-mono', className)}>{formatted || '0'}</span>;
}
