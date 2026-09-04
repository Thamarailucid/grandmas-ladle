import { Router } from 'express';
import * as controller from './heroSlide.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

// Public routes
router.get('/GetPublicHeroSlides', controller.getPublicHeroSlides);

// Admin routes
router.use(authenticate, authorize('ADMIN'));
router.get('/GetHeroSlides', controller.getHeroSlides);
router.get('/GetHeroSlideById/:id', controller.getHeroSlideById);
router.post('/CreateHeroSlide', controller.createHeroSlide);
router.put('/UpdateHeroSlide/:id', controller.updateHeroSlide);
router.delete('/DeleteHeroSlide/:id', controller.deleteHeroSlide);

export default router;
