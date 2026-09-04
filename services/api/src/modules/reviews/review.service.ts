import * as reviewRepository from './review.repository.js';
import { AppError } from '../../errors/AppError.js';
import crypto from 'crypto';

export const getPublishedReviews = async () => {
  return await reviewRepository.findAllReviews(true);
};

export const getReviews = async () => {
  return await reviewRepository.findAllReviews(false);
};

export const getReviewById = async (id: string) => {
  const review = await reviewRepository.findReviewById(id);
  if (!review) {
    throw AppError.notFound('Review not found');
  }
  return review;
};

export const createReview = async (data: any) => {
  const id = crypto.randomUUID();
  const review = await reviewRepository.createReview({ id, ...data });
  return review;
};

export const updateReview = async (id: string, data: any) => {
  const existing = await reviewRepository.findReviewById(id);
  if (!existing) {
    throw AppError.notFound('Review not found');
  }

  const review = await reviewRepository.updateReview(id, data);
  return review;
};

export const updateReviewPublicationStatus = async (id: string, isPublished: boolean) => {
  const existing = await reviewRepository.findReviewById(id);
  if (!existing) {
    throw AppError.notFound('Review not found');
  }

  const review = await reviewRepository.updateReviewPublicationStatus(id, isPublished);
  return review;
};

export const deleteReview = async (id: string) => {
  const existing = await reviewRepository.findReviewById(id);
  if (!existing) {
    throw AppError.notFound('Review not found');
  }

  await reviewRepository.deleteReview(id);
  return { success: true };
};
