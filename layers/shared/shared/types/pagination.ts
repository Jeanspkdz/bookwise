export interface PaginationMetadata {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMetadata
}
