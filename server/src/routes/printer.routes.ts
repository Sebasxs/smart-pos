import { Router } from 'express';
import { createPrintJob } from '../controllers/printer.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/jobs', requireAuth, createPrintJob);

export default router;
