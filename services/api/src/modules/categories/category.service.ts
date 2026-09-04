import * as categoryRepository from './category.repository.js';
import { AppError } from '../../errors/AppError.js';
import { generateSlug } from '../../utils/slug.js';
import crypto from 'crypto';

export const getCategories = async () => {
  const categories = await categoryRepository.findAllCategories();
  return categories;
};

export const getPublicCategories = async () => {
  const categories = await categoryRepository.findAllCategories(true);
  return categories;
};

export const getCategoryById = async (id: string) => {
  const category = await categoryRepository.findCategoryById(id);
  if (!category) {
    throw AppError.notFound('Category not found');
  }
  return category;
};

export const createCategory = async (data: any) => {
  const id = crypto.randomUUID();
  const slug = generateSlug(data.name);
  
  const existing = await categoryRepository.findCategoryBySlug(slug);
  if (existing) {
    throw AppError.conflict('Category with similar name already exists');
  }

  const category = await categoryRepository.createCategory({ id, slug, ...data });
  return category;
};

export const updateCategory = async (id: string, data: any) => {
  const existing = await categoryRepository.findCategoryById(id);
  if (!existing) {
    throw AppError.notFound('Category not found');
  }

  if (data.name) {
    data.slug = generateSlug(data.name);
  }

  const category = await categoryRepository.updateCategory(id, data);
  return category;
};

export const deleteCategory = async (id: string) => {
  const existing = await categoryRepository.findCategoryById(id);
  if (!existing) {
    throw AppError.notFound('Category not found');
  }

  // NOTE: This will fail if there are products associated due to foreign key constraint
  // Which is expected behavior
  await categoryRepository.deleteCategory(id);
  return { success: true };
};
