import Decimal from 'decimal.js';

/**
 * Configuración global para Decimal.js
 * Precisión de 19 dígitos con 6 decimales (DECIMAL(19,6) de PostgreSQL)
 */
Decimal.set({
   precision: 19,
   rounding: Decimal.ROUND_HALF_UP,
});

/**
 * Utilidades para manejo de precisión numérica con Decimal.js
 * Compatible con DIAN (Colombia) tax requirements
 */

export class PrecisionMath {
   /**
    * Convierte un valor a Decimal de forma segura
    */
   static toDecimal(value: number | string | Decimal | null | undefined): Decimal {
      if (value === null || value === undefined) {
         return new Decimal(0);
      }
      return new Decimal(value);
   }

   /**
    * Suma valores con precisión
    */
   static add(...values: (number | string | Decimal)[]): Decimal {
      return values.reduce<Decimal>((acc, val) => acc.plus(new Decimal(val)), new Decimal(0));
   }

   /**
    * Resta valores con precisión
    */
   static subtract(a: number | string | Decimal, b: number | string | Decimal): Decimal {
      return new Decimal(a).minus(b);
   }

   /**
    * Multiplica valores con precisión
    */
   static multiply(a: number | string | Decimal, b: number | string | Decimal): Decimal {
      return new Decimal(a).times(b);
   }

   /**
    * Divide valores con precisión
    */
   static divide(a: number | string | Decimal, b: number | string | Decimal): Decimal {
      return new Decimal(a).dividedBy(b);
   }

   /**
    * Calcula porcentaje
    * @param amount Monto base
    * @param percentage Porcentaje (ej: 19 para 19%)
    */
   static percentage(
      amount: number | string | Decimal,
      percentage: number | string | Decimal,
   ): Decimal {
      return new Decimal(amount).times(new Decimal(percentage).dividedBy(100));
   }

   /**
    * Redondea a N decimales
    */
   static round(value: number | string | Decimal, decimals: number = 2): Decimal {
      return new Decimal(value).toDecimalPlaces(decimals, Decimal.ROUND_HALF_UP);
   }

   /**
    * Convierte a número de JavaScript (usar solo para response final)
    */
   static toNumber(value: Decimal): number {
      return value.toNumber();
   }

   /**
    * Convierte a string con precisión exacta
    */
   static toString(value: Decimal, decimals?: number): string {
      if (decimals !== undefined) {
         return value.toFixed(decimals);
      }
      return value.toString();
   }

   /**
    * Calcula IVA (Colombia)
    * @param baseAmount Monto base
    * @param taxRate Tasa de impuesto (ej: 19 para 19%)
    */
   static calculateTax(
      baseAmount: number | string | Decimal,
      taxRate: number | string | Decimal,
   ): Decimal {
      return this.percentage(baseAmount, taxRate);
   }

   /**
    * Calcula subtotal desde total con IVA incluido
    * @param totalWithTax Total con IVA incluido
    * @param taxRate Tasa de impuesto (ej: 19 para 19%)
    */
   static calculateSubtotalFromTotal(
      totalWithTax: number | string | Decimal,
      taxRate: number | string | Decimal,
   ): Decimal {
      const taxMultiplier = new Decimal(1).plus(new Decimal(taxRate).dividedBy(100));
      return new Decimal(totalWithTax).dividedBy(taxMultiplier);
   }

   /**
    * Calcula precio unitario con descuento
    */
   static applyDiscount(
      price: number | string | Decimal,
      discountPercentage: number | string | Decimal,
   ): Decimal {
      const discountAmount = this.percentage(price, discountPercentage);
      return new Decimal(price).minus(discountAmount);
   }

   /**
    * Valida que un número esté dentro del rango permitido por DECIMAL(19,6)
    */
   static isValidDecimal(value: number | string | Decimal): boolean {
      try {
         const decimal = new Decimal(value);
         // Máximo: 9999999999999.999999 (13 enteros + 6 decimales)
         const maxValue = new Decimal('9999999999999.999999');
         return decimal.abs().lte(maxValue);
      } catch {
         return false;
      }
   }

   /**
    * Compara dos valores
    * @returns -1 si a < b, 0 si a === b, 1 si a > b
    */
   static compare(a: number | string | Decimal, b: number | string | Decimal): number {
      return new Decimal(a).comparedTo(b);
   }

   /**
    * Verifica si dos valores son iguales
    */
   static equals(a: number | string | Decimal, b: number | string | Decimal): boolean {
      return new Decimal(a).equals(b);
   }

   /**
    * Obtiene el máximo entre valores
    */
   static max(...values: (number | string | Decimal)[]): Decimal {
      if (values.length === 0) return new Decimal(0);
      const decimals = values.map(v => new Decimal(v));
      return decimals.reduce((max, val) => Decimal.max(max, val), decimals[0]);
   }

   /**
    * Obtiene el mínimo entre valores
    */
   static min(...values: (number | string | Decimal)[]): Decimal {
      if (values.length === 0) return new Decimal(0);
      const decimals = values.map(v => new Decimal(v));
      return decimals.reduce((min, val) => Decimal.min(min, val), decimals[0]);
   }
}

export { Decimal };
