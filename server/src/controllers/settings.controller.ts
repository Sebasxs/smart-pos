import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const updateProfilePreferences = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const { preferences } = req.body;

      if (!userId) return res.status(401).json({ error: 'No autorizado' });

      const { data: currentProfile } = await supabase
         .from('profiles')
         .select('preferences')
         .eq('id', userId)
         .single();

      const newPreferences = {
         ...(currentProfile?.preferences as object),
         ...preferences,
      };

      const { data, error } = await supabase
         .from('profiles')
         .update({ preferences: newPreferences })
         .eq('id', userId)
         .select('preferences')
         .single();

      if (error) throw error;

      res.json(data.preferences);
   } catch (error: any) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ error: 'Error al guardar preferencias' });
   }
};

export const getOrganizationSettings = async (req: Request, res: Response) => {
   try {
      const { data, error } = await supabase
         .from('organization_settings')
         .select('*')
         .limit(1)
         .single();

      if (error) throw error;
      res.json(data);
   } catch (error) {
      res.status(500).json({ error: 'Error cargando configuración de empresa' });
   }
};

export const updateOrganizationSettings = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const updates = req.body;

      const { data, error } = await supabase
         .from('organization_settings')
         .update({
            ...updates,
            updated_at: new Date(),
            updated_by: userId,
         })
         .neq('id', '00000000-0000-0000-0000-000000000000')
         .select()
         .single();

      if (error) throw error;
      res.json(data);
   } catch (error: any) {
      console.error('Error updating org settings:', error);
      res.status(500).json({ error: 'Error al actualizar empresa' });
   }
};
