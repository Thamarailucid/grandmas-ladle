import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { BUSINESS_DEFAULTS } from '@grandmas-ladle/shared';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface BusinessSettingsContextType {
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  fssaiNumber: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tagline: string;
  announcementText?: string;
  announcementLink?: string;
  isAnnouncementActive?: boolean;
  isGlobalSaleActive?: boolean;
  isSaleWidgetActive?: boolean;
  offerPreVisibilityDays: number;
  offerPostVisibilityDays: number;
  isCartEnabled: boolean;
  saleStartDate?: string | null;
  saleEndDate?: string | null;
  saleProductIds?: string[];
}

const defaultSettings: BusinessSettingsContextType = {
  businessName: BUSINESS_DEFAULTS.name,
  phone: BUSINESS_DEFAULTS.phone,
  whatsapp: BUSINESS_DEFAULTS.whatsapp,
  email: BUSINESS_DEFAULTS.email,
  address: BUSINESS_DEFAULTS.address,
  openingHours: BUSINESS_DEFAULTS.openingHours,
  fssaiNumber: BUSINESS_DEFAULTS.fssaiNumber,
  googleMapsUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  tagline: BUSINESS_DEFAULTS.tagline,
  offerPreVisibilityDays: 1,
  offerPostVisibilityDays: 0,
  isCartEnabled: true,
};

const BusinessSettingsContext = createContext<BusinessSettingsContextType>(defaultSettings);

export function BusinessSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettingsContextType>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [bizRes, mktRes] = await Promise.all([
          apiClient.get('/BusinessSetting/GetPublicBusinessSettings'),
          apiClient.get('/MarketingSetting/GetPublicMarketingSettings')
        ]);
        
        const mergedSettings = { ...defaultSettings };
        
        if (bizRes.data.success) {
          Object.assign(mergedSettings, bizRes.data.data);
        }
        
        if (mktRes.data.success) {
          Object.assign(mergedSettings, mktRes.data.data);
        }
        
        setSettings(mergedSettings);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  const value = {
    ...defaultSettings,
    ...settings
  };

  return (
    <BusinessSettingsContext.Provider value={value}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export function useBusinessSettingsContext() {
  return useContext(BusinessSettingsContext);
}
