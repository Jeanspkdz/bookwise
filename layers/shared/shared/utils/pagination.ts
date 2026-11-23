import type { PaginatedResponse, PaginationMetadata } from '../types/pagination'

export function createPaginatedResponse<T>(
  items: T[],
  totalItems: number,
  { page, pageSize }: Pick<PaginationMetadata, 'page' | 'pageSize'>,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    items,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  }
}

export function createEmptyPaginatedResponse<T>(
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return createPaginatedResponse<T>([], 0, { page, pageSize })
}
