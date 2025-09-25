import { supabase } from '../config/supabase';

export class CashShiftService {
   /**
    * Calculates the expected cash amount for a shift based on:
    * - Opening amount
    * - Sales (Cash)
    * - Manual Incomes
    * - Manual Expenses
    */
   static async calculateShiftTotals(shiftId: string, token: string) {
      // 1. Get Shift Info
      const { data: shift, error: shiftError } = await supabase
         .from('cash_shifts')
         .select('id, opening_amount, status')
         .eq('id', shiftId)
         .single()
         .setHeader('Authorization', `Bearer ${token}`);

      if (shiftError || !shift) throw new Error('Shift not found');

      // 2. Get Cash Payments from Sales
      const { data: payments } = await supabase
         .from('sale_payments')
         .select('amount, sales_invoices!inner(status)')
         .eq('cash_shift_id', shiftId)
         .eq('method', 'cash')
         .eq('sales_invoices.status', 'paid')
         .setHeader('Authorization', `Bearer ${token}`);

      const salesCashIn = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // 3. Get Manual Movements
      const { data: movements } = await supabase
         .from('cash_shift_movements')
         .select('amount')
         .eq('cash_shift_id', shiftId)
         .setHeader('Authorization', `Bearer ${token}`);

      const manualIn =
         movements?.filter(m => m.amount > 0).reduce((sum, m) => sum + Number(m.amount), 0) || 0;
      const manualOut =
         movements?.filter(m => m.amount < 0).reduce((sum, m) => sum + Number(m.amount), 0) || 0;

      // 4. Calculate Expected
      const systemExpected = Number(shift.opening_amount) + salesCashIn + manualIn + manualOut;

      return {
         shift,
         summary: {
            openingAmount: Number(shift.opening_amount),
            salesCashIn,
            manualIn,
            manualOut,
            systemExpected,
         },
      };
   }
}
