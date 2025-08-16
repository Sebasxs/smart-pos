import { Router } from 'express';
import { openShift, closeShift, getShiftStatus } from '../controllers/cash-shift.controller';
import { requireAuth } from '@/middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/open', openShift);
router.post('/close', closeShift);
router.get('/status', getShiftStatus);

export default router;
