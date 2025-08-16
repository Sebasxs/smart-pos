import { Router } from 'express';
import { loginCashier, loginAdmin, getProfile } from '../controllers/auth.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/login/cashier', loginCashier);
router.post('/login/admin', loginAdmin);

router.get('/profile', requireAuth, getProfile);

export default router;
