import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/authorize.js';

const router = Router();

// Public routes
router.get('/GetPublishedReviews', reviewController.getPublishedReviews);
router.get('/GetReviewStats', reviewController.getReviewStats);
router.post('/SubmitCustomerReview', reviewController.submitCustomerReview);

// Admin routes
router.get('/GetReviews', authenticate, reviewController.getReviews);
router.get('/GetReviewById/:reviewId', authenticate, reviewController.getReviewById);

router.post('/CreateReview', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.createReview);
router.put('/UpdateReview/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReview);
router.patch('/UpdateReviewPublicationStatus/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReviewPublicationStatus);
router.patch('/UpdateReviewApprovalStatus/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReviewApprovalStatus);
router.patch('/UpdateReviewVerificationStatus/:reviewId', authenticate, authorize('ADMIN', 'MANAGER'), reviewController.updateReviewVerificationStatus);
router.delete('/DeleteReview/:reviewId', authenticate, authorize('ADMIN'), reviewController.deleteReview);

export default router;
