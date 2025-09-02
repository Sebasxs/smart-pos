import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createPrintJob = async (req: Request, res: Response) => {
   const { printerName, payload } = req.body;

   if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
   }

   try {
      const { error } = await supabase.from('print_jobs' as any).insert({
         printer_name: printerName || 'POS-80',
         status: 'pending',
         payload: payload,
      });

      if (error) throw error;

      res.status(201).json({ message: 'Print job created successfully' });
   } catch (error) {
      console.error('Print Job Error:', error);
      res.status(500).json({ error: 'Failed to create print job' });
   }
};
