import { Request, Response, NextFunction } from 'express';
import * as businessSettingService from './businessSetting.service.js';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await businessSettingService.getSettings();
    const { 
      announcement_text, announcement_link, is_announcement_active, 
      offer_pre_visibility_days, offer_post_visibility_days, 
      announcementText, announcementLink, isAnnouncementActive, 
      offerPreVisibilityDays, offerPostVisibilityDays,
      ...dbData 
    } = data || {};
    
    const mappedData = {
      id: dbData.id,
      businessName: dbData.business_name,
      phone: dbData.phone,
      whatsapp: dbData.whatsapp,
      email: dbData.email,
      address: dbData.address,
      openingHours: dbData.opening_hours,
      googleMapsUrl: dbData.google_maps_url,
      instagramUrl: dbData.instagram_url,
      facebookUrl: dbData.facebook_url,
      fssaiNumber: dbData.fssai_number,
      tagline: dbData.tagline,
      isCartEnabled: dbData.is_cart_enabled !== false,
      enableEmailNotifications: dbData.enable_email_notifications,
      notificationEmail: dbData.notification_email,
      smtpHost: dbData.smtp_host,
      smtpPort: dbData.smtp_port,
      smtpUser: dbData.smtp_user,
      smtpPassword: dbData.smtp_password ? '********' : '',
      updatedAt: dbData.updated_at,
    };
    res.status(200).json({ success: true, data: mappedData });
  } catch (error) {
    next(error);
  }
};

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await businessSettingService.getSettings();
    const publicData = data ? {
      businessName: data.business_name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      openingHours: data.opening_hours,
      googleMapsUrl: data.google_maps_url,
      instagramUrl: data.instagram_url,
      facebookUrl: data.facebook_url,
      tagline: data.tagline,
      isCartEnabled: data.is_cart_enabled !== false,
    } : null;
    res.status(200).json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await businessSettingService.updateSettings(req.body);
    const { 
      announcement_text, announcement_link, is_announcement_active, 
      offer_pre_visibility_days, offer_post_visibility_days, 
      announcementText, announcementLink, isAnnouncementActive, 
      offerPreVisibilityDays, offerPostVisibilityDays,
      ...dbData 
    } = data || {};
    
    const mappedData = {
      id: dbData.id,
      businessName: dbData.business_name,
      phone: dbData.phone,
      whatsapp: dbData.whatsapp,
      email: dbData.email,
      address: dbData.address,
      openingHours: dbData.opening_hours,
      googleMapsUrl: dbData.google_maps_url,
      instagramUrl: dbData.instagram_url,
      facebookUrl: dbData.facebook_url,
      fssaiNumber: dbData.fssai_number,
      tagline: dbData.tagline,
      isCartEnabled: dbData.is_cart_enabled !== false,
      enableEmailNotifications: dbData.enable_email_notifications,
      notificationEmail: dbData.notification_email,
      smtpHost: dbData.smtp_host,
      smtpPort: dbData.smtp_port,
      smtpUser: dbData.smtp_user,
      smtpPassword: dbData.smtp_password ? '********' : '',
      updatedAt: dbData.updated_at,
    };
    res.status(200).json({ success: true, data: mappedData });
  } catch (error) {
    next(error);
  }
};
