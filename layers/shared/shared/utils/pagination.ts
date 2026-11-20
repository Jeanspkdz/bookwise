import type { PaginatedResponse } from '../types/pagination'

export function createEmptyPaginatedResponse<T>(
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return {
    items: [],
    pagination: {
      page,
      pageSize,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: page > 1,
      hasNextPage: false,
    },
  }
}
