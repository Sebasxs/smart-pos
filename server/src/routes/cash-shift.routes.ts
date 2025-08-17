import { Router } from 'express';
import { openShift, closeShift, getShiftStatus } from '../controllers/cash-shift.controller';
import { requireAuth, requireRole } from '@/middlewares/auth.middleware';
import { reconcileClosedShift } from '@/controllers/cash-shift.controller';

const router = Router();

router.use(requireAuth);

router.post('/open', openShift);
router.post('/close', closeShift);
router.get('/status', getShiftStatus);
router.post('/reconcile', requireRole(['admin', 'super_admin']), reconcileClosedShift);

export default router;
