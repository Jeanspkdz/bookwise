import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

export function useAdminBookCatalog() {
  const page = ref(1)
  const sort = ref<'author' | 'rating' | 'category' | 'name' | 'createdAt'>('createdAt')
  const order = ref<'asc' | 'desc'>('asc')
  const { data, pending, error, refresh } = useFetch<PaginatedResponse<Book>>('/api/book', {
    method: 'GET',
    key: () => `admin-books-${page.value}-${sort.value}-${order.value}`,
    query: () => ({
      page: page.value,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: sort.value,
      order: order.value,
    }),
    lazy: true,
    default: () => createEmptyPaginatedResponse<Book>(page.value, DEFAULT_PAGE_SIZE),
    headers: {
      'bookwise-bypass-cache': 'true',
    },
  })

  watch(
    () => data.value?.pagination.totalPages,
    (totalPages) => {
      const lastPage = Math.max(1, totalPages ?? 1)

      if (page.value > lastPage) {
        page.value = lastPage
      }
    },
  )

  return {
    books: computed(() => data.value?.items ?? []),
    pagination: computed(
      () =>
        data.value?.pagination ??
        createEmptyPaginatedResponse<Book>(page.value, DEFAULT_PAGE_SIZE).pagination,
    ),
    page,
    setPage: (value: number) => (page.value = value),
    setSort: (field: typeof sort.value, direction: typeof order.value) => {
      sort.value = field
      order.value = direction
      page.value = 1
    },
    pending,
    error,
    refresh,
  }
}
