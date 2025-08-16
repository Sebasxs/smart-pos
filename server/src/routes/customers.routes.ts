import { Router } from 'express';
import {
   searchCustomers,
   getCustomers,
   createCustomer,
   updateCustomer,
   deleteCustomer,
} from '../controllers/customers.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/search', searchCustomers);
router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

router.delete('/:id', requireRole(['admin', 'super_admin']), deleteCustomer);

export default router;
