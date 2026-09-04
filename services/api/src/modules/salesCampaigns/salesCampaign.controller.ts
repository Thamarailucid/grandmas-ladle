import { Request, Response, NextFunction } from 'express';
import * as salesCampaignRepo from './salesCampaign.repository.js';

export const getAllCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await salesCampaignRepo.findAllCampaigns();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await salesCampaignRepo.findCampaignById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, error: { message: 'Campaign not found' } });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await salesCampaignRepo.createCampaign(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await salesCampaignRepo.updateCampaign(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ success: false, error: { message: 'Campaign not found' } });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await salesCampaignRepo.deleteCampaign(req.params.id);
    res.status(200).json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    next(error);
  }
};
