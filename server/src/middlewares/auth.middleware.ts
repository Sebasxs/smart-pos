import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/supabase';
import { verifyTokenAndGetUserId } from '@/utils/auth.utils';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token not provided' });
   }

   const token = authHeader.split(' ')[1];

   try {
      const userId = await verifyTokenAndGetUserId(token);

      const { data: profile, error } = await supabase
         .from('profiles')
         .select('*')
         .or(`id.eq.${userId},auth_user_id.eq.${userId}`)
         .single();

      if (error) {
         return res.status(403).json({ error: error.message });
      }

      if (!profile || !profile.is_active) {
         return res.status(403).json({ error: 'User is inactive, blocked, or not found.' });
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
   } catch (error: any) {
      console.error('Token verification failed:', error.message);
      return res.status(403).json({ error: error.message || 'Invalid session' });
   }
};

export const requireRole = (allowedRoles: string[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
         return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!allowedRoles.includes(req.user.role)) {
         return res.status(403).json({
            error: 'Access denied: Insufficient permissions.',
         });
      }

      next();
   };
};
