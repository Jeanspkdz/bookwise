import { useDebounceFn } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import type { ShallowRef } from 'vue'

interface PaginatedSearchOptions<TField extends string> {
  enabled?: boolean
  defaultSearchBy: TField
  delay?: number
  syncToUrl?: boolean
  searchFields?: readonly TField[]
}

// Shares debounced search and pagination, optionally restoring and syncing URL parameters.
export function usePaginatedSearch<TField extends string>(options: PaginatedSearchOptions<TField>) {
  const search = ref('')
  const searchBy: ShallowRef<TField> = shallowRef(options.defaultSearchBy)
  const applied = ref('')
  const appliedSearch = computed(() => applied.value)
  const { page, setPage, resetPage } = usePagination()
  let restoringRoute = false
  let disposed = false

  const applySearch = useDebounceFn((value: string) => {
    if (!disposed && value === search.value) applied.value = value.trim()
  }, options.delay ?? 300)
  onScopeDispose(() => {
    disposed = true
    applySearch.cancel?.()
  })

  watch(
    search,
    (value) => {
      if (options.enabled !== false && !restoringRoute) void applySearch(value)
    },
    { flush: 'sync' },
  )

  if (options.enabled !== false) {
    watch(
      [appliedSearch, searchBy],
      () => {
        if (!restoringRoute) resetPage()
      },
      { flush: 'sync' },
    )
  }

  if (options.syncToUrl) {
    // Pass Nuxt's router explicitly so VueUse shares the app's router instance.
    const routeOptions = {
      route: useRoute(),
      router: useRouter(),
      mode: 'replace' as const,
    }
    const urlSearch = useRouteQuery('search', '', {
      ...routeOptions,
      transform: (value: unknown) => (typeof value === 'string' ? value.trim().slice(0, 200) : ''),
    })
    const urlSearchBy = useRouteQuery('searchBy', options.defaultSearchBy, {
      ...routeOptions,
      transform: (value: unknown) =>
        options.searchFields?.find((field) => field === value) ?? options.defaultSearchBy,
    })
    const urlPage = useRouteQuery('page', '1', {
      ...routeOptions,
      transform: {
        get: (value: unknown) => {
          const number = typeof value === 'string' ? Number(value) : NaN
          return Number.isSafeInteger(number) && number > 0 ? number : 1
        },
        set: (value: number) => String(value),
      },
    })

    const restoreRoute = (): void => {
      restoringRoute = true
      applySearch.cancel?.()
      search.value = urlSearch.value
      applied.value = urlSearch.value
      searchBy.value = urlSearchBy.value
      setPage(urlPage.value)
      restoringRoute = false
    }

    watch([urlSearch, urlSearchBy, urlPage], restoreRoute)
    restoreRoute()

    watch(
      [appliedSearch, searchBy, page],
      ([text, field, currentPage]) => {
        if (urlSearch.value !== text) urlSearch.value = text
        if (urlSearchBy.value !== field) urlSearchBy.value = field
        if (urlPage.value !== currentPage) urlPage.value = currentPage
      },
      { flush: 'post' },
    )
  }

  const clearSearch = (): void => {
    search.value = ''
    applySearch.cancel?.()
    applied.value = ''
    searchBy.value = options.defaultSearchBy
    resetPage()
  }

  return { search, appliedSearch, searchBy, page, setPage, clearSearch }
}
