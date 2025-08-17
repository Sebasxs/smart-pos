import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const openShift = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const { openingAmount } = req.body;

      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });
      if (!openingAmount && openingAmount !== 0)
         return res.status(400).json({ error: 'Monto de apertura no proporcionado' });

      const { data: existingShift } = await supabase
         .from('cash_shifts')
         .select('id')
         .eq('user_id', userId)
         .eq('status', 'open')
         .maybeSingle();

      if (existingShift) {
         return res
            .status(400)
            .json({ error: `El usuario ya tiene una caja abierta (ID: ${existingShift.id})` });
      }

      const { data: newShift, error } = await supabase
         .from('cash_shifts')
         .insert({
            user_id: userId,
            opening_amount: openingAmount,
            status: 'open',
         })
         .select('id')
         .single();

      if (error) throw error;

      res.status(201).json({ message: 'Caja abierta correctamente', shiftId: newShift.id });
   } catch (error: any) {
      console.error('Error opening shift:', error);
      res.status(500).json({ error: error.message || 'Error al abrir caja' });
   }
};

export const closeShift = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const { actualCash } = req.body;

      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });
      if (actualCash === undefined || actualCash === null)
         return res.status(400).json({ error: 'Monto de cierre no proporcionado' });

      const { data: shift } = await supabase
         .from('cash_shifts')
         .select('*')
         .eq('user_id', userId)
         .eq('status', 'open')
         .single();

      if (!shift) {
         return res
            .status(404)
            .json({ error: 'No se encontró un turno abierto para este usuario' });
      }

      const { data: payments } = await supabase
         .from('sale_payments')
         .select('amount, sales_invoices!inner(status)')
         .eq('cash_shift_id', shift.id)
         .eq('method', 'cash')
         .eq('sales_invoices.status', 'paid');

      const salesCashIn = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const { data: movements } = await supabase
         .from('cash_shift_movements')
         .select('amount')
         .eq('cash_shift_id', shift.id);

      const manualIn =
         movements?.filter(m => m.amount > 0).reduce((sum, m) => sum + Number(m.amount), 0) || 0;
      const manualOut =
         movements?.filter(m => m.amount < 0).reduce((sum, m) => sum + Number(m.amount), 0) || 0;

      const systemExpected = Number(shift.opening_amount) + salesCashIn + manualIn + manualOut;
      const difference = Number(actualCash) - systemExpected;

      const { error: updateError } = await supabase
         .from('cash_shifts')
         .update({
            end_time: new Date().toISOString(),
            status: 'closed',
            expected_closing_amount: systemExpected,
            actual_closing_amount: actualCash,
            difference: difference,
         })
         .eq('id', shift.id)
         .select()
         .single();

      if (updateError) throw updateError;

      res.json({
         success: true,
         summary: {
            openingAmount: shift.opening_amount,
            salesCashIn,
            manualIn,
            manualOut,
            systemExpected,
            actualCash,
            difference,
         },
      });
   } catch (error: any) {
      console.error('Error closing shift:', error);
      res.status(500).json({ error: error.message || 'Error al cerrar caja' });
   }
};

export const getShiftStatus = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

      const { data, error } = await supabase
         .from('cash_shifts')
         .select('*')
         .eq('user_id', userId)
         .eq('status', 'open')
         .single()
         .setHeader('Authorization', `Bearer ${req.token}`);

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

      if (!data) {
         return res.json({ isOpen: false, message: 'No hay turno abierto' });
      }

      res.json({ isOpen: true, shift: data });
   } catch (error: any) {
      console.error('Error fetching shift status:', error);
      res.status(500).json({ error: 'Error al obtener estado de caja' });
   }
};

export const reconcileClosedShift = async (req: Request, res: Response) => {
   try {
      const adminId = req.user?.id;
      const { shiftId, amount, reasonType, notes, supplierId } = req.body;

      if (!adminId) {
         return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!shiftId || amount === undefined || !reasonType) {
         return res.status(400).json({
            error: 'Faltan parámetros requeridos: shiftId, amount, reasonType',
         });
      }

      const { error } = await supabase.rpc('reconcile_closed_shift', {
         p_shift_id: shiftId,
         p_admin_id: adminId,
         p_amount: amount,
         p_reason_type: reasonType,
         p_notes: notes || null,
         p_supplier_id: supplierId || null,
      });

      if (error) {
         console.error('Error calling reconcile_closed_shift RPC:', error);
         return res
            .status(400)
            .json({ error: 'Error: verificar que el turno de caja esté cerrado.' });
      }

      res.json({
         success: true,
         message: 'Auditoría registrada correctamente',
      });
   } catch (error: any) {
      console.error('Error reconciling shift in controller:', error);
      res.status(500).json({ error: error.message || 'Error interno del servidor' });
   }
};
