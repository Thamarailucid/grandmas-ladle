import * as businessSettingRepository from './businessSetting.repository.js';
import { AppError } from '../../errors/AppError.js';

export const getSettings = async () => {
  const settings = await businessSettingRepository.getSettings();
  if (!settings) {
    throw AppError.notFound('Business settings not found');
  }
  return settings;
};

export const updateSettings = async (data: any) => {
  const existing = await businessSettingRepository.getSettings();
  if (!existing) {
    throw AppError.notFound('Business settings not found');
  }

  const settings = await businessSettingRepository.updateSettings(data);
  return settings;
};
