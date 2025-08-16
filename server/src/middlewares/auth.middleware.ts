import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '@/config/supabase';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(401).json({ error: 'No se proporcionó token de autorización' });
   }

   const token = authHeader.split(' ')[1];

   try {
      if (!JWT_SECRET) throw new Error('SUPABASE_JWT_SECRET no está configurado en el .env');
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const { data: profile, error } = await supabase
         .from('profiles')
         .select('*')
         .or(`id.eq.${decoded.sub},auth_user_id.eq.${decoded.sub}`)
         .single();

      if (error || !profile || !profile.is_active) {
         return res.status(403).json({ error: 'Usuario inactivo, bloqueado o no encontrado.' });
      }

      req.user = {
         id: profile.id,
         role: profile.role as 'super_admin' | 'admin' | 'cashier',
         nickname: profile.nickname || undefined,
         email: profile.email || undefined,
         full_name: profile.full_name || undefined,
         permissions: (profile.permissions as unknown as Record<string, boolean>) || undefined,
         avatar_url: profile.avatar_url || undefined,
         job_title: profile.job_title || undefined,
      };

      req.token = token;

      next();
   } catch (error) {
      console.error('Error verificando token:', error);
      return res.status(403).json({ error: 'Sesión inválida o expirada' });
   }
};

export const requireRole = (allowedRoles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
         return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!allowedRoles.includes(req.user.role)) {
         return res.status(403).json({
            error: 'Acceso denegado: No tienes permisos suficientes para realizar esta acción.',
         });
      }

      next();
   };
};
