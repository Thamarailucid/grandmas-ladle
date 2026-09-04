import * as businessSettingRepository from './businessSetting.repository.js';
import { AppError } from '../../errors/AppError.js';
import { encrypt } from '../../utils/crypto.js';

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

  if (data.smtpPassword === '********' || data.smtpPassword === '') {
    delete data.smtpPassword; // Don't overwrite with dummy or empty if unchanged
  } else if (data.smtpPassword) {
    data.smtpPassword = encrypt(data.smtpPassword);
  }

  const settings = await businessSettingRepository.updateSettings(data);
  return settings;
};
