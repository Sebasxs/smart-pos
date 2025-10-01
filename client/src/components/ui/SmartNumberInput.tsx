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
   focusVariant?: 'neutral' | 'primary' | 'none';
}

export function SmartNumberInput({
   value,
   onValueChange,
   variant,
   dianUnitCode,
   maxDecimals,
   label,
   error,
   className,
   disabled,
   placeholder,
   showPrefix = true,
   focusVariant = 'neutral',
   ...props
}: SmartNumberInputProps) {
   const { preferences } = usePreferencesStore();

   let decimalScale = 2;
   let prefix = '';
   let suffix = '';

   const shouldShowPrefix =
      variant === 'currency' ? showPrefix && preferences.showCurrencySymbol : showPrefix;

   if (variant === 'currency') {
      decimalScale = maxDecimals ?? preferences.currencyDecimalPreference;
      if (shouldShowPrefix) prefix = '$ ';
   } else if (variant === 'quantity') {
      decimalScale = maxDecimals ?? (dianUnitCode ? getDecimalScaleByUnit(dianUnitCode) : 2);
      if (showPrefix) prefix = '';
   } else if (variant === 'percentage') {
      decimalScale = maxDecimals ?? 2;
      suffix = ' %';
   }

   return (
      <div className={twMerge('w-full flex flex-col', className)}>
         {label && (
            <label className="block text-sm font-medium text-text-muted mb-1.5">{label}</label>
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
            onClick={e => (e.target as HTMLInputElement).select()}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx(
               // Estilo unificado
               'w-full bg-surface-highlight border border-border text-text-main placeholder:text-text-dim',
               'rounded-lg px-3 py-2.5 outline-none',

               // Focus Variant
               focusVariant === 'neutral' && 'focus:border-border-focus',
               focusVariant === 'primary' && 'focus:border-primary/50',

               'hover:border-border-hover',
               'transition-colors text-sm',
               error && 'border-danger focus:border-danger',
            )}
            {...props}
         />
         {error && <span className="text-xs text-danger-text mt-1">{error}</span>}
      </div>
   );
}
