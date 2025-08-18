/**
 * Determines the decimal scale based on DIAN unit codes.
 * @param dianUnitCode The DIAN unit code (e.g., 'KGM', '94', 'EA')
 * @returns The number of decimal places (0, 2, or 3)
 */
export function getDecimalScaleByUnit(dianUnitCode: string): number {
   if (!dianUnitCode) return 2;

   const code = dianUnitCode.toUpperCase();

   // Measurables: KGM (Kilogram), LTR (Liter), MTR (Meter)
   // These usually require higher precision (3 decimals)
   if (['KGM', 'LTR', 'MTR'].includes(code)) {
      return 3;
   }

   // Discrete Units: 94 (Unit), EA (Each)
   // These are typically integers (0 decimals)
   if (['94', 'EA'].includes(code)) {
      return 0;
   }

   return 2;
}
