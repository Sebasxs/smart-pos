import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { getDecimalScaleByUnit } from '../../lib/dianUtils';
import type { NumberVariant } from '../../lib/formatNumber';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SmartNumberInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
   value: number | string | null;
   onValueChange: (value: number | null) => void;
   variant: NumberVariant;
   dianUnitCode?: string;
   maxDecimals?: number;
   showPrefix?: boolean;
   label?: string;
   error?: string;
}

export function SmartNumberInput({
   value,
   onValueChange,
   variant,
   dianUnitCode,
   maxDecimals,
   showPrefix,
   label,
   error,
   className,
   disabled,
   placeholder,
   ...props
}: SmartNumberInputProps) {
   const { currencyDecimalPreference } = usePreferencesStore();

   let decimalScale = 2;
   let prefix = '';
   let suffix = '';

   if (variant === 'currency') {
      decimalScale = maxDecimals ?? currencyDecimalPreference;
      if (showPrefix !== false) {
         prefix = '$ ';
      }
   } else if (variant === 'quantity') {
      decimalScale = maxDecimals ?? (dianUnitCode ? getDecimalScaleByUnit(dianUnitCode) : 2);
      if (showPrefix) {
         prefix = '';
      }
   } else if (variant === 'percentage') {
      decimalScale = maxDecimals ?? 2;
      suffix = ' %';
   }

   return (
      <div className={twMerge('flex flex-col gap-1.5', className)}>
         {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
         )}
         <NumericFormat
            value={value}
            onValueChange={values => {
               const floatValue = values.floatValue;
               onValueChange(floatValue === undefined ? null : floatValue);
            }}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={decimalScale}
            fixedDecimalScale={decimalScale > 0}
            prefix={prefix}
            suffix={suffix}
            allowNegative={false}
            inputMode="decimal"
            allowedDecimalSeparators={['.', ',']}
            onFocus={e => {
               e.target.select();
               props.onFocus?.(e);
            }}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx(
               'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50',
               error && 'border-red-500 focus:ring-red-500',
            )}
            {...props}
         />
         {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
   );
}
