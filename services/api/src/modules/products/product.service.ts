import * as productRepository from './product.repository.js';
import { AppError } from '../../errors/AppError.js';
import { parsePagination, createPaginationMeta } from '../../utils/pagination.js';
import { generateSlug } from '../../utils/slug.js';
import crypto from 'crypto';

export const getProducts = async (query: any) => {
  const { page, pageSize, offset } = parsePagination(query);
  const categoryId = query.categoryId as string | undefined;
  const isAvailable = query.isAvailable !== undefined ? query.isAvailable === 'true' : undefined;

  const data = await productRepository.findAllProducts({ categoryId, isAvailable, page, pageSize, offset });
  const total = await productRepository.countProducts({ categoryId, isAvailable });

  return {
    data,
    pagination: createPaginationMeta(page, pageSize, total)
  };
};

export const getProductById = async (id: string) => {
  const product = await productRepository.findProductById(id);
  if (!product) {
    throw AppError.notFound('Product not found');
  }
  return product;
};

export const createProduct = async (data: any) => {
  const id = crypto.randomUUID();
  const slug = generateSlug(data.name);
  
  const existing = await productRepository.findProductBySlug(slug);
  if (existing) {
    throw AppError.conflict('Product with similar name already exists');
  }

  const product = await productRepository.createProduct({ id, slug, ...data });
  return product;
};

export const updateProduct = async (id: string, data: any) => {
  const existing = await productRepository.findProductById(id);
  if (!existing) {
    throw AppError.notFound('Product not found');
  }

  if (data.name) {
    data.slug = generateSlug(data.name);
  }

  const product = await productRepository.updateProduct(id, data);
  return product;
};

export const updateProductAvailability = async (id: string, isAvailable: boolean) => {
  const existing = await productRepository.findProductById(id);
  if (!existing) {
    throw AppError.notFound('Product not found');
  }

  const product = await productRepository.updateProductAvailability(id, isAvailable);
  return product;
};

export const deleteProduct = async (id: string) => {
  const existing = await productRepository.findProductById(id);
  if (!existing) {
    throw AppError.notFound('Product not found');
  }

  await productRepository.softDeleteProduct(id);
  return { success: true };
};
