import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

export const loginCashier = async (req: Request, res: Response) => {
   try {
      const { nickname, pin } = req.body;

      if (!nickname || !pin) {
         return res.status(400).json({ error: 'Nickname y PIN son requeridos' });
      }

      if (!/^\d{4}$/.test(pin)) {
         return res.status(400).json({ error: 'El PIN debe ser de 4 números' });
      }

      const { data, error } = await supabase.rpc('verify_cashier_login', {
         p_nickname: nickname,
         p_pin: pin,
      });

      if (error) throw error;

      const user = data && data[0];

      if (!user || !user.success) {
         return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
         {
            sub: user.id,
            role: 'authenticated',
            aud: 'authenticated',
            user_metadata: {
               nickname: nickname,
               full_name: user.full_name,
               job_title: user.job_title,
               role: user.role,
               permissions: user.permissions,
               avatar_url: user.avatar_url,
            },
         },
         JWT_SECRET,
         { expiresIn: '12h' },
      );

      return res.json({
         user: {
            id: user.id,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            permissions: user.permissions,
            nickname: nickname,
            job_title: user.job_title,
            email: user.email,
         },
         token,
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

export const loginAdmin = async (req: Request, res: Response) => {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];

      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
         return res.status(401).json({ error: 'Invalid token' });
      }

      const { data: profile, error: profileError } = await supabase
         .from('profiles')
         .select('*')
         .eq('auth_user_id', data.user.id)
         .single();

      if (profileError || !profile) {
         return res.status(404).json({ error: 'Perfil no encontrado para este usuario' });
      }

      return res.json({
         user: {
            id: profile.id,
            full_name: profile.full_name,
            role: profile.role,
            avatar_url: profile.avatar_url,
            permissions: profile.permissions,
            nickname: profile.nickname,
            job_title: profile.job_title,
            email: profile.email,
         },
         token,
      });
   } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};
