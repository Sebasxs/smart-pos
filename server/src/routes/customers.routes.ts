import { Router } from 'express';
import { searchCustomers } from '../controllers/customers.controller';

const router = Router();

router.get('/search', searchCustomers);

export default router;
