import { Request } from 'express';

declare global {
   namespace Express {
      interface Request {
         user?: {
            id: string;
            role: 'super_admin' | 'admin' | 'cashier';
            nickname?: string;
            email?: string;
            full_name?: string;
            job_title?: string;
            permissions?: Record<string, boolean>;
            avatar_url?: string;
         };
         token?: string;
      }
   }
}
