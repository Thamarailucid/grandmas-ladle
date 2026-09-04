import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getCategories();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPublicCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getPublicCategories();
    const publicData = data.map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      imageUrl: d.imageUrl,
      sortOrder: d.sortOrder,
    }));
    res.status(200).json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.getCategoryById(req.params.categoryId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await categoryService.updateCategory(req.params.categoryId, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.categoryId);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
