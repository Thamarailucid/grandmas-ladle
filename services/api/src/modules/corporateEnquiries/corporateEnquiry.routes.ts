import { Router } from 'express';
import * as controller from './corporateEnquiry.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();
router.get('/GetCorporateEnquirys', authenticate, controller.getAll);
router.post('/CreateCorporateEnquiry', controller.create);
router.put('/UpdateCorporateEnquiry/:id', authenticate, authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/DeleteCorporateEnquiry/:id', authenticate, authorize('ADMIN'), controller.remove);
export default router;