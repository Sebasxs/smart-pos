import { Router } from 'express';
import {
   searchCustomers,
   getCustomers,
   createCustomer,
   updateCustomer,
   deleteCustomer
} from '../controllers/customers.controller';

const router = Router();

router.get('/search', searchCustomers);
router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
