import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, getSuppliersList, updateProduct } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.delete('/:id', deleteProduct);
router.get('/suppliers', getSuppliersList);
router.post('/', createProduct);
router.put('/:id', updateProduct);

export default router;
