import { Router } from 'express';
import * as controller from './festival.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();
router.get('/GetPublicFestivals', controller.getPublic);
router.get('/GetFestivals', authenticate, controller.getAll);
router.post('/CreateFestival', authenticate, authorize('ADMIN', 'MANAGER'), controller.create);
router.put('/UpdateFestival/:id', authenticate, authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/DeleteFestival/:id', authenticate, authorize('ADMIN'), controller.remove);
export default router;