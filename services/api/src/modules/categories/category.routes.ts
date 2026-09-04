import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/GetPublicProductCategories', categoryController.getPublicCategories);
router.get('/GetProductCategories', authenticate, categoryController.getCategories);
router.get('/GetProductCategoryById/:categoryId', categoryController.getCategoryById);

router.post('/CreateProductCategory', authenticate, authorize('ADMIN', 'MANAGER'), categoryController.createCategory);
router.put('/UpdateProductCategory/:categoryId', authenticate, authorize('ADMIN', 'MANAGER'), categoryController.updateCategory);
router.delete('/DeleteProductCategory/:categoryId', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

export default router;
