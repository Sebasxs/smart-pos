import { Router } from 'express';
import {
   createProduct,
   deleteProduct,
   getBrandsList,
   getCategoriesList,
   getProducts,
   getSuppliersList,
   updateProduct,
} from '../controllers/products.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', getProducts);
router.get('/suppliers', getSuppliersList);
router.get('/brands', getBrandsList);
router.get('/categories', getCategoriesList);

router.post('/', requireRole(['admin', 'super_admin']), createProduct);
router.put('/:id', requireRole(['admin', 'super_admin']), updateProduct);
router.delete('/:id', requireRole(['admin', 'super_admin']), deleteProduct);

export default router;
