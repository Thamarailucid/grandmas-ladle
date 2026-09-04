import { Router } from 'express';
import * as controller from './contactEnquiry.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();
router.get('/GetContactEnquirys', authenticate, controller.getAll);
router.post('/CreateContactEnquiry', controller.create);
router.put('/UpdateContactEnquiry/:id', authenticate, authorize('ADMIN', 'MANAGER'), controller.update);
router.delete('/DeleteContactEnquiry/:id', authenticate, authorize('ADMIN'), controller.remove);
export default router;