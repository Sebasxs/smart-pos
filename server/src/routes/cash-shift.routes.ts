import { Router } from 'express';
import { openShift, closeShift, getShiftStatus } from '../controllers/cash-shift.controller';

const router = Router();

router.post('/open', openShift);
router.post('/close', closeShift);
router.get('/status/:userId', getShiftStatus);

export default router;
