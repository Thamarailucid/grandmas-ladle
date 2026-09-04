import { Router } from 'express';
import * as marketingSettingController from './marketingSettings.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/GetPublicMarketingSettings', marketingSettingController.getPublicSettings);
router.get('/GetMarketingSettings', authenticate, authorize('ADMIN', 'MANAGER'), marketingSettingController.getSettings);
router.put('/UpdateMarketingSettings', authenticate, authorize('ADMIN'), marketingSettingController.updateSettings);

export default router;
