import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

type BookSearchField = 'all' | 'name' | 'author' | 'category'

interface UseBooksOptions {
  pageSize?: number
  search?: MaybeRefOrGetter<string | undefined>
  searchBy?: MaybeRefOrGetter<BookSearchField>
  page?: MaybeRefOrGetter<number>
  sort?: string
  order?: 'asc' | 'desc'
  category?: MaybeRefOrGetter<string | undefined>
  exclude?: MaybeRefOrGetter<string | undefined>
  enabled?: MaybeRefOrGetter<boolean>
  lazy?: boolean
}

export function useBooks(options: UseBooksOptions = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const page = computed(() => toValue(options.page) ?? 1)

  const enabled = computed(() => toValue(options.enabled) ?? true)
  const query = computed(() => ({
    search: toValue(options.search) || undefined,
    searchBy: toValue(options.searchBy) ?? 'all',
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
    lazy: options.lazy ?? true,
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
    pending,
    error,
    refresh,
  }
}
