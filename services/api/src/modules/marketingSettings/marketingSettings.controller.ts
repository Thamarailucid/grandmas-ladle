import { Request, Response, NextFunction } from 'express';
import * as businessSettingService from '../businessSettings/businessSetting.service.js';
import * as salesCampaignRepo from '../salesCampaigns/salesCampaign.repository.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await businessSettingService.getSettings();
    const marketingData = data ? {
      announcementText: data.announcement_text,
      announcementLink: data.announcement_link,
      isAnnouncementActive: data.is_announcement_active,
      isGlobalSaleActive: data.is_global_sale_active,
      isSaleWidgetActive: data.is_sale_widget_active,
      offerPreVisibilityDays: data.offer_pre_visibility_days,
      offerPostVisibilityDays: data.offer_post_visibility_days,
      saleStartDate: data.sale_start_date,
      saleEndDate: data.sale_end_date,
      saleProductIds: data.sale_product_ids || [],
    } : null;
    res.status(200).json({ success: true, data: marketingData });
  } catch (error) {
    next(error);
  }
};

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeCampaign = await salesCampaignRepo.getActiveCampaign();
    
    // Default fallback if no campaign is active
    let publicData = {
      announcementText: null,
      announcementLink: null,
      isAnnouncementActive: false,
      isGlobalSaleActive: false,
      isSaleWidgetActive: false,
      offerPreVisibilityDays: 1,
      offerPostVisibilityDays: 0,
      saleStartDate: null,
      saleEndDate: null,
      saleProductIds: [],
    };

    if (activeCampaign) {
      publicData = {
        announcementText: activeCampaign.announcementText,
        announcementLink: activeCampaign.announcementLink,
        isAnnouncementActive: activeCampaign.isAnnouncementActive,
        isGlobalSaleActive: activeCampaign.isGlobalSaleActive,
        isSaleWidgetActive: activeCampaign.isSaleWidgetActive,
        offerPreVisibilityDays: activeCampaign.preVisibilityDays,
        offerPostVisibilityDays: activeCampaign.postVisibilityDays,
        saleStartDate: activeCampaign.startDate,
        saleEndDate: activeCampaign.endDate,
        saleProductIds: activeCampaign.productIds || [],
      };
    }
    
    res.status(200).json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only allow marketing fields
    const { 
      announcementText, 
      announcementLink, 
      isAnnouncementActive, 
      offerPreVisibilityDays, 
      offerPostVisibilityDays,
      saleStartDate,
      saleEndDate,
      saleProductIds,
      isGlobalSaleActive,
      isSaleWidgetActive
    } = req.body;

    const updatedData = await businessSettingService.updateSettings({
      announcementText, 
      announcementLink, 
      isAnnouncementActive, 
      offerPreVisibilityDays, 
      offerPostVisibilityDays,
      saleStartDate,
      saleEndDate,
      saleProductIds,
      isGlobalSaleActive,
      isSaleWidgetActive
    });

    res.status(200).json({ success: true, data: updatedData });
  } catch (error) {
    next(error);
  }
};
