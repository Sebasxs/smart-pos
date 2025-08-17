import { Router } from 'express';
import { loginCashier, loginAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/login/cashier', loginCashier);
router.post('/login/admin', loginAdmin);

export default router;
