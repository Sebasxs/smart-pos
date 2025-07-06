import { Router } from 'express';
import { createInvoice } from '../controllers/invoices.controller';

const router = Router();

router.post('/', createInvoice);

export default router;
