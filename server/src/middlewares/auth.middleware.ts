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
      // Decode token without verification to check the algorithm
      const decodedHeader = jwt.decode(token, { complete: true });

      if (!decodedHeader) {
         return res.status(403).json({ error: 'Token inválido' });
      }

      const algorithm = decodedHeader.header.alg;
      let userId: string;

      // Handle Supabase tokens (RS256) - for Admin users
      if (
         algorithm === 'RS256' ||
         algorithm === 'ES256' ||
         (algorithm === 'HS256' && !JWT_SECRET)
      ) {
         const { data, error } = await supabase.auth.getUser(token);

         if (error || !data.user) {
            return res.status(403).json({ error: 'Token de Supabase inválido o expirado' });
         }

         userId = data.user.id;
      }
      // Handle custom tokens (HS256) - for Cashier users
      else if (algorithm === 'HS256') {
         if (!JWT_SECRET) {
            throw new Error('SUPABASE_JWT_SECRET no está configurado en el .env');
         }

         const verified = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as any;
         userId = verified.sub;
      } else {
         return res.status(403).json({ error: `Algoritmo no soportado: ${algorithm}` });
      }

      // Fetch user profile from database
      const { data: profile, error } = await supabase
         .from('profiles')
         .select('*')
         .or(`id.eq.${userId},auth_user_id.eq.${userId}`)
         .single();

      if (error) {
         return res.status(403).json({ error: error.message });
      }

      if (!profile || !profile.is_active) {
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
