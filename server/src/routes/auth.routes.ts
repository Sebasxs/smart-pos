import { Router } from 'express';
import { loginCashier, loginAdmin, getProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/login/cashier', loginCashier);
router.post('/login/admin', loginAdmin);
router.get('/profile', getProfile);

export default router;
