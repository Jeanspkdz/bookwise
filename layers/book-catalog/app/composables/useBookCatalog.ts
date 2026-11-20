import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

export function useBookCatalog() {
  const page = ref(1)
  const { data, pending, error, refresh } = useFetch<PaginatedResponse<Book>>('/api/book', {
    method: 'GET',
    key: () => `book-catalog-${page.value}`,
    query: () => ({ page: page.value, pageSize: DEFAULT_PAGE_SIZE }),
    lazy: true,
    default: () => createEmptyPaginatedResponse<Book>(page.value, DEFAULT_PAGE_SIZE),
  })

  return {
    books: computed(() => data.value?.items ?? []),
    pagination: computed(
      () =>
        data.value?.pagination ??
        createEmptyPaginatedResponse<Book>(page.value, DEFAULT_PAGE_SIZE).pagination,
    ),
    page,
    setPage: (value: number) => (page.value = value),
    pending,
    error,
    refresh,
  }
}
