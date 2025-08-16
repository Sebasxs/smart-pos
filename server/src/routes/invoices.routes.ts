import { Router } from 'express';
import { createInvoice } from '../controllers/invoices.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, createInvoice);

export default router;
