import { Router } from 'express';
import * as businessSettingController from './businessSetting.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/GetPublicBusinessSettings', businessSettingController.getPublicSettings);
router.get('/GetBusinessSettings', authenticate, authorize('ADMIN', 'MANAGER'), businessSettingController.getSettings);
router.put('/UpdateBusinessSettings', authenticate, authorize('ADMIN'), businessSettingController.updateSettings);

export default router;
