import { PrecisionMath } from '../utils/precisionMath';

type PaymentPayload = {
   amount: number;
};

type InvoiceItemPayload = {
   price: number;
   quantity: number;
   originalPrice: number;
};

type ValidationResult = {
   isValid: boolean;
   error?: string;
   details?: any;
   cleanTotals?: {
      subtotal: number;
      total: number;
   };
};

export class InvoiceValidationService {
   /**
    * Validates that all numeric inputs are within the allowed range for the Database.
    */
   static validateNumericRanges(values: number[]): { isValid: boolean; value?: number } {
      for (const value of values) {
         if (!PrecisionMath.isValidDecimal(value)) {
            return { isValid: false, value };
         }
      }
      return { isValid: true };
   }

   /**
    * Validates that the payments cover the total amount.
    */
   static validatePaymentSufficiency(payments: PaymentPayload[], total: number): ValidationResult {
      if (!payments || payments.length === 0) {
         return { isValid: false, error: 'At least one payment method is required' };
      }

      const paymentsTotal = payments.reduce(
         (sum, p) => PrecisionMath.add(sum, p.amount),
         PrecisionMath.toDecimal(0),
      );

      if (PrecisionMath.compare(paymentsTotal, total) < 0) {
         return {
            isValid: false,
            error: 'Payment amount is insufficient to cover the invoice total',
            details: {
               paymentsTotal: PrecisionMath.toNumber(paymentsTotal),
               invoiceTotal: total,
               missing: PrecisionMath.toNumber(PrecisionMath.subtract(total, paymentsTotal)),
            },
         };
      }

      return { isValid: true };
   }

   /**
    * Re-calculates totals on the server side and compares them with client data
    * to prevent manipulation or rounding errors.
    */
   static validateTotals(
      items: InvoiceItemPayload[],
      clientSubtotal: number,
      clientTotal: number,
      discount: number,
   ): ValidationResult {
      let calculatedSubtotal = PrecisionMath.toDecimal(0);

      for (const item of items) {
         const itemTotal = PrecisionMath.multiply(item.price, item.quantity);
         calculatedSubtotal = calculatedSubtotal.plus(itemTotal);
      }

      const calculatedTotal = PrecisionMath.subtract(calculatedSubtotal, discount);

      // Diff checks
      const subtotalDiff = PrecisionMath.subtract(clientSubtotal, calculatedSubtotal).abs();
      const totalDiff = PrecisionMath.subtract(clientTotal, calculatedTotal).abs();

      const maxToleranceAbsolute = 0.01;
      const maxTolerancePercent = 0.01; // 1%

      // Subtotal Check
      if (PrecisionMath.compare(subtotalDiff, maxToleranceAbsolute) > 0) {
         const percentDiff = PrecisionMath.divide(subtotalDiff, calculatedSubtotal);
         if (PrecisionMath.compare(percentDiff, maxTolerancePercent) > 0) {
            return {
               isValid: false,
               error: 'Subtotal mismatch exceeds allowed tolerance.',
               details: {
                  field: 'subtotal',
                  clientValue: clientSubtotal,
                  serverValue: PrecisionMath.toNumber(calculatedSubtotal),
                  difference: PrecisionMath.toNumber(subtotalDiff),
               },
            };
         }
      }

      // Total Check
      if (PrecisionMath.compare(totalDiff, maxToleranceAbsolute) > 0) {
         const percentDiff = PrecisionMath.divide(totalDiff, calculatedTotal);
         if (PrecisionMath.compare(percentDiff, maxTolerancePercent) > 0) {
            return {
               isValid: false,
               error: 'Total mismatch exceeds allowed tolerance.',
               details: {
                  field: 'total',
                  clientValue: clientTotal,
                  serverValue: PrecisionMath.toNumber(calculatedTotal),
                  difference: PrecisionMath.toNumber(totalDiff),
               },
            };
         }
      }

      return {
         isValid: true,
         cleanTotals: {
            subtotal: PrecisionMath.toNumber(calculatedSubtotal),
            total: PrecisionMath.toNumber(calculatedTotal),
         },
      };
   }
}
