import { Request, Response, NextFunction } from 'express';
import * as service from './heroSlide.service.js';
import { AppError } from '../../errors/AppError.js';

export const getHeroSlides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getHeroSlides();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPublicHeroSlides = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getPublicHeroSlides();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getHeroSlideById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getHeroSlideById(req.params.id);
    if (!data) throw AppError.notFound('Hero slide not found');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createHeroSlide(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateHeroSlide(req.params.id, req.body);
    if (!data) throw AppError.notFound('Hero slide not found');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteHeroSlide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await service.deleteHeroSlide(req.params.id);
    if (!success) throw AppError.notFound('Hero slide not found');
    res.status(200).json({ success: true, message: 'Hero slide deleted' });
  } catch (error) {
    next(error);
  }
};
