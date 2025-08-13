import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const openShift = async (req: Request, res: Response) => {
   try {
      const { userId, openingAmount } = req.body;

      if (!userId || openingAmount === undefined) {
         return res.status(400).json({ error: 'Faltan datos requeridos (userId, openingAmount)' });
      }

      const { data, error } = await supabase.rpc('open_cash_shift', {
         p_user_id: userId,
         p_opening_amount: openingAmount,
      });

      if (error) throw error;

      res.status(201).json({ message: 'Caja abierta correctamente', shiftId: data });
   } catch (error: any) {
      console.error('Error opening shift:', error);
      res.status(500).json({ error: error.message || 'Error al abrir caja' });
   }
};

export const closeShift = async (req: Request, res: Response) => {
   try {
      const { userId, actualCash } = req.body;

      if (!userId || actualCash === undefined) {
         return res.status(400).json({ error: 'Faltan datos requeridos (userId, actualCash)' });
      }

      const { data, error } = await supabase.rpc('close_cash_shift', {
         p_user_id: userId,
         p_actual_cash: actualCash,
      });

      if (error) throw error;

      res.json(data);
   } catch (error: any) {
      console.error('Error closing shift:', error);
      res.status(500).json({ error: error.message || 'Error al cerrar caja' });
   }
};

export const getShiftStatus = async (req: Request, res: Response) => {
   try {
      const { userId } = req.params;

      const { data, error } = await supabase
         .from('cash_shifts')
         .select('*')
         .eq('user_id', userId)
         .eq('status', 'open')
         .single();

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
