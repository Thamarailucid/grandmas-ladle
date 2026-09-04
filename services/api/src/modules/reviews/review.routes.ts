import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

router.get('/GetPublishedReviews', reviewController.getPublishedReviews);
router.get('/GetReviews', authenticate, reviewController.getReviews);
router.get('/GetReviewById/:reviewId', authenticate, reviewController.getReviewById);

router.post('/CreateReview', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.createReview);
router.put('/UpdateReview/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReview);
router.patch('/UpdateReviewPublicationStatus/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReviewPublicationStatus);
router.delete('/DeleteReview/:reviewId', authenticate, authorize('ADMIN'), reviewController.deleteReview);

export default router;
