import { Router } from 'express';
import * as salesCampaignController from './salesCampaign.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), salesCampaignController.getAllCampaigns);
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), salesCampaignController.getCampaignById);
router.post('/', authenticate, authorize('ADMIN'), salesCampaignController.createCampaign);
router.put('/:id', authenticate, authorize('ADMIN'), salesCampaignController.updateCampaign);
router.delete('/:id', authenticate, authorize('ADMIN'), salesCampaignController.deleteCampaign);

export default router;
