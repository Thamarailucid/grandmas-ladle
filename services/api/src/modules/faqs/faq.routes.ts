import { Router } from 'express';
import * as faqController from './faq.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/GetPublishedFaqs', faqController.getPublishedFaqs);
router.get('/GetFaqs', authenticate, faqController.getFaqs);
router.get('/GetFaqById/:faqId', authenticate, faqController.getFaqById);

router.post('/CreateFaq', authenticate, authorize('ADMIN', 'MANAGER'), faqController.createFaq);
router.put('/UpdateFaq/:faqId', authenticate, authorize('ADMIN', 'MANAGER'), faqController.updateFaq);
router.patch('/UpdateFaqPublicationStatus/:faqId', authenticate, authorize('ADMIN', 'MANAGER'), faqController.updateFaqPublicationStatus);
router.delete('/DeleteFaq/:faqId', authenticate, authorize('ADMIN'), faqController.deleteFaq);

export default router;
