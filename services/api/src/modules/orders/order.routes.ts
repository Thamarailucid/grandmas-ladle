import { Router } from 'express';
import * as controller from './order.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();
router.get('/GetOrders', authenticate, controller.getAll);
router.post('/CreateOrder', authenticate, authorize('ADMIN', 'MANAGER'), controller.create);
router.put('/UpdateOrder/:id', authenticate, authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/DeleteOrder/:id', authenticate, authorize('ADMIN'), controller.remove);
export default router;