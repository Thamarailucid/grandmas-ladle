import { Request, Response, NextFunction } from 'express';
import * as service from './order.service.js';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.update((req.params.id as string), req.body);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.remove((req.params.id as string));
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) { next(error); }
};