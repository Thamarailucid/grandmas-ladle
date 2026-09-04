import { Request, Response, NextFunction } from 'express';
import * as reviewService from './review.service.js';

export const getPublishedReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reviewService.getPublishedReviews();
    const publicData = data.map((d: any) => ({
      id: d.id,
      customerName: d.customerName,
      rating: d.rating,
      title: d.title,
      content: d.content,
      createdAt: d.createdAt // useful for "Reviewed on [Date]"
    }));
    res.status(200).json({ success: true, data: publicData });
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

export const deleteReview = async (req: Request<{ reviewId: string }>, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.params.reviewId);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
