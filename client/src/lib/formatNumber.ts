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
 *
 * Logic:
 * - Currency: Uses 0 or 2 decimals based on preference. Adds '$' if requested.
 * - Quantity: Decimals depend on DIAN unit code (e.g., kg = 3 decimals, unit = 0).
 * - Percentage: Always 2 decimals.
 *
 * @param value The number to format (can be null/undefined).
 * @param options Configuration options.
 * @returns Formatted string.
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
         prefix = '$ ';
      }
   } else if (variant === 'quantity') {
      // Use DIAN Utils to determine precision for units (e.g., KGM vs EA)
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
 * Parses a formatted string back to a raw number.
 * Removes currency symbols, spaces, and handles locale separators (dot/comma).
 */
export function parseFormattedNumber(value: string): number | null {
   if (!value) return null;

   const cleaned = value
      .replace(/[$%\s]/g, '') // Remove symbols
      .replace(/\./g, '') // Remove thousand separators (dots in ES-CO)
      .replace(/,/g, '.'); // Replace decimal separator (comma to dot)

   const parsed = parseFloat(cleaned);
   return isNaN(parsed) ? null : parsed;
}
