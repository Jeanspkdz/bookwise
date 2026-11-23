import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { DEFAULT_PAGE_SIZE } from '~~/layers/shared/shared/utils/constants'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

type BookSearchField = 'all' | 'name' | 'author' | 'category'

interface UseBooksOptions {
  pageSize?: number
  search?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  category?: MaybeRefOrGetter<string | undefined>
  exclude?: MaybeRefOrGetter<string | undefined>
  enabled?: MaybeRefOrGetter<boolean>
  lazy?: boolean
}

export function useBooks(options: UseBooksOptions = {}) {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE
  const search = ref('')
  const searchBy = ref<BookSearchField>('all')
  const page = ref(1)
  const appliedSearch = ref('')
  let searchTimer: ReturnType<typeof setTimeout> | undefined

  if (options.search) {
    watch(search, (value) => {
      clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        page.value = 1
        appliedSearch.value = value.trim()
      }, 300)
    })
    watch(searchBy, () => {
      page.value = 1
    })
    onScopeDispose(() => clearTimeout(searchTimer))
  }

  const category = computed(() => toValue(options.category))
  const enabled = computed(() => toValue(options.enabled) ?? true)
  const query = computed(() => ({
    search: options.search ? appliedSearch.value || undefined : undefined,
    searchBy: options.search ? searchBy.value : undefined,
    category: category.value,
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

  const clearSearch = () => {
    clearTimeout(searchTimer)
    search.value = ''
    appliedSearch.value = ''
    searchBy.value = 'all'
    page.value = 1
  }

  return {
    books: computed(() => data.value?.items ?? []),
    pagination: computed(
      () =>
        data.value?.pagination ??
        createEmptyPaginatedResponse<Book>(page.value, pageSize).pagination,
    ),
    page,
    setPage: (value: number) => (page.value = value),
    search,
    appliedSearch: readonly(appliedSearch),
    searchBy,
    clearSearch,
    pending,
    error,
    refresh,
  }
}
