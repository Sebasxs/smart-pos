import jwt, { type JwtPayload } from 'jsonwebtoken';
import { supabase } from '../config/supabase';

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

interface DecodedToken {
   userId: string;
   algorithm: string;
}

/**
 * Validates a Supabase (RS256/ES256) or Custom (HS256) token.
 * Returns the user ID if valid, or throws an error.
 */
export const verifyTokenAndGetUserId = async (token: string): Promise<string> => {
   // 1. Decode without verification to check the header algorithm
   const decodedHeader = jwt.decode(token, { complete: true });

   if (!decodedHeader) {
      throw new Error('Invalid token format');
   }

   const algorithm = decodedHeader.header.alg;

   // 2. Strategy: Supabase Auth (Admin/SuperAdmin)
   if (algorithm === 'RS256' || algorithm === 'ES256' || (algorithm === 'HS256' && !JWT_SECRET)) {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
         throw new Error('Invalid or expired Supabase token');
      }

      return data.user.id;
   }

   // 3. Strategy: Custom Cashier Auth (HS256)
   if (algorithm === 'HS256') {
      if (!JWT_SECRET) {
         throw new Error('SUPABASE_JWT_SECRET is not configured in the environment');
      }

      try {
         const verified = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
         return verified.sub as string;
      } catch (err) {
         throw new Error('Invalid custom token signature');
      }
   }

   throw new Error(`Unsupported token algorithm: ${algorithm}`);
};
