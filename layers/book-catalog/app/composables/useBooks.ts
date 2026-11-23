import { isRef, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

type BookSearchField = 'all' | 'name' | 'author' | 'category'

interface UseBooksOptions {
  pageSize?: number
  search?: boolean
  syncToUrl?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  category?: MaybeRefOrGetter<string | undefined>
  exclude?: MaybeRefOrGetter<string | undefined>
  enabled?: MaybeRefOrGetter<boolean>
  lazy?: boolean
}

export function useBooks(options: UseBooksOptions = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const { search, appliedSearch, searchBy, page, setPage, clearSearch } =
    usePaginatedSearch<BookSearchField>({
      enabled: options.search ?? false,
      defaultSearchBy: 'all',
      syncToUrl: options.syncToUrl,
      searchFields: options.syncToUrl ? ['all'] : ['all', 'name', 'author', 'category'],
      filters: isRef(options.category) ? { category: options.category } : undefined,
    })

  const enabled = computed(() => toValue(options.enabled) ?? true)
  const query = computed(() => ({
    search: options.search ? appliedSearch.value || undefined : undefined,
    searchBy: options.search ? searchBy.value : undefined,
    category: toValue(options.category),
    exclude: toValue(options.exclude),
    page: page.value,
    pageSize,
    sort: options.sort,
    order: options.order,
  }))
  const { data, pending, error, refresh, clear } = useFetch<PaginatedResponse<Book>>('/api/book', {
    key: `books-${useId()}`,
    query,
    watch: false,
    immediate: enabled.value,
    lazy: options.lazy ?? !options.search,
    default: () => createEmptyPaginatedResponse<Book>(page.value, pageSize),
  })

  watch([query, enabled], () => {
    if (enabled.value) void refresh()
    else clear()
  })

  return {
    books: computed(() => data.value?.items ?? []),
    pagination: computed(
      () =>
        data.value?.pagination ??
        createEmptyPaginatedResponse<Book>(page.value, pageSize).pagination,
    ),
    page,
    setPage,
    search,
    appliedSearch,
    searchBy,
    clearSearch,
    pending,
    error,
    refresh,
  }
}
