import { getDecimalScaleByUnit } from './dianUtils';

export type NumberVariant = 'currency' | 'quantity' | 'percentage';

export interface FormatOptions {
   variant: NumberVariant;
   dianUnitCode?: string;
   maxDecimals?: number;
   decimalPreference?: number;
   showPrefix?: boolean;
}

/**
 * Formats a number according to DIAN rules and user preferences.
 * This is the shared logic between SmartNumberInput and SmartNumber.
 */
export function formatNumber(value: number | null | undefined, options: FormatOptions): string {
   if (value === null || value === undefined || isNaN(value)) {
      return '';
   }

   const { variant, dianUnitCode, maxDecimals, decimalPreference = 0, showPrefix = true } = options;

   let decimalScale = 2;
   let prefix = '';
   let suffix = '';

   if (variant === 'currency') {
      decimalScale = maxDecimals ?? decimalPreference;
      if (showPrefix) {
         prefix = '$';
      }
   } else if (variant === 'quantity') {
      decimalScale = maxDecimals ?? (dianUnitCode ? getDecimalScaleByUnit(dianUnitCode) : 2);
   } else if (variant === 'percentage') {
      decimalScale = maxDecimals ?? 2;
      if (showPrefix) {
         suffix = ' %';
      }
   }

   const formatted = new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: decimalScale,
      maximumFractionDigits: decimalScale,
      useGrouping: true,
   }).format(value);

   return `${prefix}${formatted}${suffix}`;
}

/**
 * Parses a formatted string and extracts the clean number.
 */
export function parseFormattedNumber(value: string): number | null {
   if (!value) return null;

   const cleaned = value
      .replace(/[$%\s]/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.');

   const parsed = parseFloat(cleaned);
   return isNaN(parsed) ? null : parsed;
}
