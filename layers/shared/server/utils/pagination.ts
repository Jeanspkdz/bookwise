import { z } from 'zod'
import type { PaginationMetadata } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE, MAX_RECORDS_PER_REQUEST } from '~~/layers/shared/shared/utils/constants'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_RECORDS_PER_REQUEST).default(DEFAULT_PAGE_SIZE),
})

export function getPaginationParams({
  page,
  pageSize,
}: Pick<PaginationMetadata, 'page' | 'pageSize'>) {
  return {
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }
}
