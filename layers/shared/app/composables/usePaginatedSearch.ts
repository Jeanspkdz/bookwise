import { useDebounceFn } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'

interface PaginatedSearchOptions<TField extends string> {
  enabled?: boolean
  defaultSearchBy: TField
  delay?: number
  syncToUrl?: boolean
  searchFields?: readonly TField[]
  filters?: Record<string, Ref<string | undefined>>
}

// Shares debounced search and pagination, optionally restoring and syncing URL parameters.
export function usePaginatedSearch<TField extends string>(options: PaginatedSearchOptions<TField>) {
  const search = ref('')
  const searchBy: ShallowRef<TField> = shallowRef(options.defaultSearchBy)
  const applied = ref('')
  const appliedSearch = computed(() => applied.value)
  const { page, setPage, resetPage } = usePagination()
  const filters = Object.entries(options.filters ?? {})
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
      [appliedSearch, searchBy, ...filters.map(([, value]) => value)],
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
    const urlFilters = filters.map(([key, value]) => ({
      value,
      query: useRouteQuery(key, '', {
        ...routeOptions,
        transform: (raw: unknown) => (typeof raw === 'string' ? raw.trim() : ''),
      }),
    }))

    const restoreRoute = (): void => {
      // Ignore our own URL writes so changing a filter doesn't erase text still being typed.
      if (
        applied.value === urlSearch.value &&
        searchBy.value === urlSearchBy.value &&
        page.value === urlPage.value &&
        urlFilters.every((filter) => (filter.value.value ?? '') === filter.query.value)
      )
        return
      restoringRoute = true
      applySearch.cancel?.()
      search.value = urlSearch.value
      applied.value = urlSearch.value
      searchBy.value = urlSearchBy.value
      for (const filter of urlFilters) filter.value.value = filter.query.value || undefined
      setPage(urlPage.value)
      restoringRoute = false
    }

    watch(
      [urlSearch, urlSearchBy, urlPage, ...urlFilters.map((filter) => filter.query)],
      restoreRoute,
    )
    restoreRoute()

    watch(
      [appliedSearch, searchBy, page, ...filters.map(([, value]) => value)],
      () => {
        if (urlSearch.value !== appliedSearch.value) urlSearch.value = appliedSearch.value
        if (urlSearchBy.value !== searchBy.value) urlSearchBy.value = searchBy.value
        if (urlPage.value !== page.value) urlPage.value = page.value
        for (const filter of urlFilters) {
          const value = filter.value.value ?? ''
          if (filter.query.value !== value) filter.query.value = value
        }
      },
      { flush: 'post' },
    )
  }

  const clearSearch = (): void => {
    search.value = ''
    applySearch.cancel?.()
    applied.value = ''
    searchBy.value = options.defaultSearchBy
    for (const [, value] of filters) value.value = undefined
    resetPage()
  }

  return { search, appliedSearch, searchBy, page, setPage, clearSearch }
}
