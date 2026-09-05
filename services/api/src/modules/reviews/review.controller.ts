import { Request, Response, NextFunction } from 'express';
import * as reviewService from './review.service.js';

export const getPublishedReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [data, stats] = await Promise.all([
      reviewService.getPublishedReviews(),
      reviewService.getReviewStats()
    ]);
    const publicData = data.map((d: any) => ({
      id: d.id,
      customerName: d.customerName,
      customerLocation: d.customerLocation,
      rating: d.rating,
      title: d.title,
      content: d.content,
      isVerified: d.isVerified,
      productNames: d.productNames,
      adminReply: d.adminReply,
      createdAt: d.createdAt
    }));
    res.status(200).json({ success: true, data: publicData, stats });
  } catch (error) {
    next(error);
  }
};

export const getReviewStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await reviewService.getReviewStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const submitCustomerReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerName, customerLocation, rating, content, productNames } = req.body;
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Review content is required' });
    }

    const data = await reviewService.submitCustomerReview({
      customerName: customerName.trim(),
      customerLocation: customerLocation ? customerLocation.trim() : null,
      rating: numRating,
      content: content.trim(),
      productNames: Array.isArray(productNames) ? productNames : []
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and will be visible after approval.',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reviewService.getReviews();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await reviewService.getReviewById(req.params.reviewId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If not passed explicitly, you could infer user from req.user (assuming authenticate middleware sets it)
    const data = await reviewService.createReview({ ...req.body, userId: req.body.userId || (req as any).user?.id });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await reviewService.updateReview(req.params.reviewId, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateReviewPublicationStatus = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    const { isPublished } = req.body;
    const data = await reviewService.updateReviewPublicationStatus(req.params.reviewId, isPublished);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateReviewApprovalStatus = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    const { isApproved } = req.body;
    const data = await reviewService.updateReviewApprovalStatus(req.params.reviewId, Boolean(isApproved));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateReviewVerificationStatus = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    const { isVerified } = req.body;
    const data = await reviewService.updateReviewVerificationStatus(req.params.reviewId, Boolean(isVerified));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.params.reviewId);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
