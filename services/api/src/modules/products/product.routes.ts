import { Router } from 'express';
import * as productController from './product.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';
// Add validation schemas when they exist in shared schemas

const router = Router();

router.get('/GetPublicProducts', productController.getPublicProducts);
router.get('/GetProducts', authenticate, productController.getProducts);
router.get('/GetProductById/:productId', productController.getProductById);

router.post('/CreateProduct', authenticate, authorize('ADMIN', 'MANAGER'), productController.createProduct);
router.put('/UpdateProduct/:productId', authenticate, authorize('ADMIN', 'MANAGER'), productController.updateProduct);
router.patch('/UpdateProductAvailability/:productId', authenticate, authorize('ADMIN', 'MANAGER', 'STAFF'), productController.updateProductAvailability);
router.delete('/DeleteProduct/:productId', authenticate, authorize('ADMIN'), productController.deleteProduct);

export default router;
