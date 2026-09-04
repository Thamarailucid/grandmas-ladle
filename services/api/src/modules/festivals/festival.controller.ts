import { Request, Response, NextFunction } from 'express';
import * as service from './festival.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAll();
    const publicData = data.filter((d: any) => d.isActive).map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      bannerImageUrl: d.bannerImageUrl,
      startDate: d.startDate,
      endDate: d.endDate,
      sortOrder: d.sortOrder
    }));
    res.status(200).json({ success: true, data: publicData });
  } catch (error) { next(error); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

export const update = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const remove = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await service.remove(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};