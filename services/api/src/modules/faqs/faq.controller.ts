import { Request, Response, NextFunction } from 'express';
import * as faqService from './faq.service.js';

export const getPublishedFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await faqService.getPublishedFaqs();
    const publicData = data.map((d: any) => ({
      id: d.id,
      question: d.question,
      answer: d.answer,
      category: d.category,
      sortOrder: d.sortOrder
    }));
    res.status(200).json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
};

export const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await faqService.getFaqs();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (req: Request<{ faqId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await faqService.getFaqById(req.params.faqId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await faqService.createFaq(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (req: Request<{ faqId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await faqService.updateFaq(req.params.faqId, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateFaqPublicationStatus = async (req: Request<{ faqId: string }>, res: Response, next: NextFunction) => {
  try {
    const { isPublished } = req.body;
    const data = await faqService.updateFaqPublicationStatus(req.params.faqId, isPublished);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (req: Request<{ faqId: string }>, res: Response, next: NextFunction) => {
  try {
    await faqService.deleteFaq(req.params.faqId);
    res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};
