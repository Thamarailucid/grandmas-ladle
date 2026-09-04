import { PAGINATION_DEFAULTS } from '@grandmas-ladle/shared';

export function parsePagination(query: { page?: string; pageSize?: string }) {
  const page = Math.max(1, parseInt(query.page || '', 10) || PAGINATION_DEFAULTS.page);
  const pageSize = Math.min(
    PAGINATION_DEFAULTS.maxPageSize,
    Math.max(1, parseInt(query.pageSize || '', 10) || PAGINATION_DEFAULTS.pageSize),
  );
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset };
}

export function createPaginationMeta(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
