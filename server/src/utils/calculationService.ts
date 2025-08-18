import { PrecisionMath, Decimal } from './precisionMath';

/**
 * Servicio de cálculos para facturación con precisión DIAN.
 * Ejemplos de uso real del sistema PrecisionMath.
 */

export interface InvoiceItem {
   quantity: number;
   unitPrice: number;
   discountPercentage?: number;
   taxRate?: number;
}

export interface InvoiceCalculation {
   subtotal: Decimal;
   discountAmount: Decimal;
   taxAmount: Decimal;
   total: Decimal;
}

/**
 * Calcula el total de un item de factura con descuento e impuesto.
 * @example
 * const item = { quantity: 2.5, unitPrice: 10000, discountPercentage: 10, taxRate: 19 };
 * const result = calculateInvoiceItem(item);
 * // result.subtotal = 25000
 * // result.discountAmount = 2500
 * // result.taxAmount = 4275
 * // result.total = 26775
 */
export function calculateInvoiceItem(item: InvoiceItem): InvoiceCalculation {
   const { quantity, unitPrice, discountPercentage = 0, taxRate = 0 } = item;

   // 1. Calcular subtotal (precio * cantidad)
   const subtotal = PrecisionMath.multiply(unitPrice, quantity);

   // 2. Calcular descuento
   const discountAmount =
      discountPercentage > 0
         ? PrecisionMath.percentage(subtotal, discountPercentage)
         : new Decimal(0);

   // 3. Subtotal después de descuento
   const subtotalAfterDiscount = PrecisionMath.subtract(subtotal, discountAmount);

   // 4. Calcular impuesto sobre el subtotal con descuento
   const taxAmount =
      taxRate > 0 ? PrecisionMath.calculateTax(subtotalAfterDiscount, taxRate) : new Decimal(0);

   // 5. Total final
   const total = PrecisionMath.add(subtotalAfterDiscount, taxAmount);

   return {
      subtotal,
      discountAmount,
      taxAmount,
      total,
   };
}

/**
 * Calcula los totales de una factura completa.
 * @example
 * const items = [
 *   { quantity: 2, unitPrice: 50000, discountPercentage: 10, taxRate: 19 },
 *   { quantity: 1, unitPrice: 30000, discountPercentage: 0, taxRate: 19 },
 * ];
 * const totals = calculateInvoiceTotals(items);
 */
export function calculateInvoiceTotals(items: InvoiceItem[]): InvoiceCalculation {
   let totalSubtotal = new Decimal(0);
   let totalDiscount = new Decimal(0);
   let totalTax = new Decimal(0);
   let grandTotal = new Decimal(0);

   for (const item of items) {
      const itemCalc = calculateInvoiceItem(item);

      totalSubtotal = totalSubtotal.plus(itemCalc.subtotal);
      totalDiscount = totalDiscount.plus(itemCalc.discountAmount);
      totalTax = totalTax.plus(itemCalc.taxAmount);
      grandTotal = grandTotal.plus(itemCalc.total);
   }

   return {
      subtotal: totalSubtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      total: grandTotal,
   };
}

/**
 * Calcula el cambio a devolver en una transacción de efectivo.
 * @example
 * const change = calculateChange(100000, 95500);
 * // change = 4500
 */
export function calculateChange(cashReceived: number, total: number): Decimal {
   const change = PrecisionMath.subtract(cashReceived, total);
   return PrecisionMath.max(change, 0); // El cambio nunca puede ser negativo
}

/**
 * Aplica un descuento global a una factura ya calculada.
 * @example
 * const original = 100000;
 * const discounted = applyGlobalDiscount(original, 15, 'percentage');
 * // discounted = 85000
 */
export function applyGlobalDiscount(
   amount: number | Decimal,
   discount: number,
   type: 'percentage' | 'fixed',
): Decimal {
   const amountDecimal = PrecisionMath.toDecimal(amount);

   if (type === 'percentage') {
      return PrecisionMath.applyDiscount(amountDecimal, discount);
   } else {
      return PrecisionMath.subtract(amountDecimal, discount);
   }
}

/**
 * Calcula el precio de venta sugerido basado en el costo y margen deseado.
 * @example
 * const sellingPrice = calculateSellingPrice(50000, 40); // Costo 50k, margen 40%
 * // sellingPrice = 70000
 */
export function calculateSellingPrice(cost: number, marginPercentage: number): Decimal {
   const marginAmount = PrecisionMath.percentage(cost, marginPercentage);
   return PrecisionMath.add(cost, marginAmount);
}

/**
 * Calcula el margen de ganancia real sobre un precio de venta.
 * @example
 * const margin = calculateProfitMargin(50000, 70000);
 * // margin = 40 (40%)
 */
export function calculateProfitMargin(cost: number, sellingPrice: number): Decimal {
   const profit = PrecisionMath.subtract(sellingPrice, cost);
   const marginDecimal = PrecisionMath.divide(profit, cost);
   return PrecisionMath.multiply(marginDecimal, 100); // Convertir a porcentaje
}

/**
 * Divide un pago entre múltiples métodos de pago.
 * @example
 * const split = splitPayment(100000, [
 *   { method: 'cash', percentage: 60 },
 *   { method: 'card', percentage: 40 }
 * ]);
 * // split = [{ method: 'cash', amount: 60000 }, { method: 'card', amount: 40000 }]
 */
export function splitPayment(
   total: number,
   splits: Array<{ method: string; percentage: number }>,
): Array<{ method: string; amount: Decimal }> {
   return splits.map(split => ({
      method: split.method,
      amount: PrecisionMath.percentage(total, split.percentage),
   }));
}
