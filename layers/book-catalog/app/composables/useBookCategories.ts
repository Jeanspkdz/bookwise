import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { MAX_RECORDS_PER_REQUEST } from '~~/layers/shared/shared/utils/constants'

// Loads the complete category lookup using the server's paginated responses.
export function useBookCategories() {
  const requestFetch = useRequestFetch()
  const { data, pending, error, refresh } = useAsyncData(
    'book-categories',
    async () => {
      const categories: string[] = []
      let page = 1
      let hasNextPage = true
      while (hasNextPage) {
        const response = await requestFetch<PaginatedResponse<{ category: string }>>(
          '/api/book/categories',
          {
            query: { page, pageSize: MAX_RECORDS_PER_REQUEST },
          },
        )
        categories.push(...response.items.map((item) => item.category))
        hasNextPage = response.pagination.hasNextPage
        page += 1
      }
      return categories
    },
    { default: () => [] },
  )

  return { categories: data, pending, error, refresh }
}
