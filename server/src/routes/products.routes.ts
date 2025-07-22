import { Router } from 'express';
import { getProducts, deleteProduct } from '../controllers/products.controller';

const router = Router();

router.get('/', getProducts);
router.delete('/:id', deleteProduct);

export default router;
