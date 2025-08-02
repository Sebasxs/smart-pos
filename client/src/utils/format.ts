export const formatCurrency = (value: number, includeSymbol = false, options?: Intl.NumberFormatOptions): string => {
   const defaultOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options
   };

   let formattedValue = value.toLocaleString('es-CO', defaultOptions).replace(/(\$|\u20B1|\u20A7)\s/g, '$1');

   if (!includeSymbol) {
      formattedValue = formattedValue.replace(/[$\u20B1\u20A7]/g, '').trim();
   }

   return formattedValue;
};

export const parseFormattedNumber = (value: string): number => {
   const cleanValue = value.replace(/[^\d]/g, '');
   return cleanValue ? parseInt(cleanValue, 10) : 0;
};
