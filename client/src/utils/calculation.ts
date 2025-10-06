import Decimal from 'decimal.js';
import { type InvoiceItem, type Discount } from '../types/billing';

Decimal.set({ precision: 19, rounding: Decimal.ROUND_HALF_UP });

export type InvoiceTotals = {
   subtotal: number;
   discountAmount: number;
   taxAmount: number;
   total: number;
};

/**
 * Calcs invoice totals with decimal precision.
 */
export const calculateInvoiceTotals = (items: InvoiceItem[], discount: Discount): InvoiceTotals => {
   let subtotal = new Decimal(0);

   items.forEach(item => {
      const itemPrice = new Decimal(item.price);
      const itemQty = new Decimal(item.quantity);
      subtotal = subtotal.plus(itemPrice.times(itemQty));
   });

   let discountAmount = new Decimal(0);
   if (discount.value > 0) {
      if (discount.type === 'percentage') {
         discountAmount = subtotal.times(new Decimal(discount.value).div(100));
      } else {
         discountAmount = new Decimal(discount.value);
      }
   }
   const total = Decimal.max(0, subtotal.minus(discountAmount));

   return {
      subtotal: subtotal.toNumber(),
      discountAmount: discountAmount.toDecimalPlaces(0).toNumber(),
      taxAmount: 0,
      total: total.toNumber(),
   };
};

/**
 * Calcs the ideal price based on a discount.
 */
export const calculateIdealPrice = (originalPrice: number, discountPercentage: number): number => {
   const original = new Decimal(originalPrice);
   const percent = new Decimal(discountPercentage).div(100);
   return original.times(new Decimal(1).minus(percent)).toNumber();
};

/**
 * Calcs the change to return.
 */
export const calculateChange = (totalPaid: number, totalInvoice: number): number => {
   const paid = new Decimal(totalPaid);
   const total = new Decimal(totalInvoice);
   return Decimal.max(0, paid.minus(total)).toNumber();
};

/**
 * Validates if there is enough payment covered.
 */
export const isPaymentSufficient = (totalPaid: number, totalInvoice: number): boolean => {
   return new Decimal(totalPaid).gte(new Decimal(totalInvoice).minus(0.01));
};
