import * as faqRepository from './faq.repository.js';
import { AppError } from '../../errors/AppError.js';
import crypto from 'crypto';

export const getPublishedFaqs = async () => {
  return await faqRepository.findAllFaqs(true);
};

export const getFaqs = async () => {
  return await faqRepository.findAllFaqs(false);
};

export const getFaqById = async (id: string) => {
  const faq = await faqRepository.findFaqById(id);
  if (!faq) {
    throw AppError.notFound('FAQ not found');
  }
  return faq;
};

export const createFaq = async (data: any) => {
  const id = crypto.randomUUID();
  const faq = await faqRepository.createFaq({ id, ...data });
  return faq;
};

export const updateFaq = async (id: string, data: any) => {
  const existing = await faqRepository.findFaqById(id);
  if (!existing) {
    throw AppError.notFound('FAQ not found');
  }

  const faq = await faqRepository.updateFaq(id, data);
  return faq;
};

export const updateFaqPublicationStatus = async (id: string, isPublished: boolean) => {
  const existing = await faqRepository.findFaqById(id);
  if (!existing) {
    throw AppError.notFound('FAQ not found');
  }

  const faq = await faqRepository.updateFaqPublicationStatus(id, isPublished);
  return faq;
};

export const deleteFaq = async (id: string) => {
  const existing = await faqRepository.findFaqById(id);
  if (!existing) {
    throw AppError.notFound('FAQ not found');
  }

  await faqRepository.deleteFaq(id);
  return { success: true };
};
