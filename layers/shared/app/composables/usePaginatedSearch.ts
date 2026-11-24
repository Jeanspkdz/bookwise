import { useDebounceFn } from '@vueuse/core'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'

interface PaginatedSearchOptions<TField extends string> {
  enabled?: boolean
  defaultSearchBy: TField
  delay?: number
  filters?: Record<string, Ref<string | undefined>>
}

// Owns search input, debounce and pagination without depending on routing or fetching.
export function usePaginatedSearch<TField extends string>(options: PaginatedSearchOptions<TField>) {
  const search = ref('')
  const searchBy: ShallowRef<TField> = shallowRef(options.defaultSearchBy)
  const applied = ref('')
  const appliedSearch = computed(() => applied.value)
  const { page, setPage, resetPage } = usePagination()
  const filters = Object.entries(options.filters ?? {})
  let restoringState = false
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
      if (options.enabled !== false && !restoringState) void applySearch(value)
    },
    { flush: 'sync' },
  )
  if (options.enabled !== false) {
    watch(
      [appliedSearch, searchBy, ...filters.map(([, value]) => value)],
      () => {
        if (!restoringState) resetPage()
      },
      { flush: 'sync' },
    )
  }

  const restoreState = (state: {
    search: string
    page: number
    searchBy?: TField
    filters?: Record<string, string | undefined>
  }): void => {
    restoringState = true
    applySearch.cancel?.()
    search.value = state.search
    applied.value = state.search.trim()
    searchBy.value = state.searchBy ?? options.defaultSearchBy
    for (const [key, value] of filters) value.value = state.filters?.[key]
    setPage(state.page)
    restoringState = false
  }
  const clearSearch = (): void => restoreState({ search: '', page: 1 })

  return { search, appliedSearch, searchBy, page, setPage, clearSearch, restoreState }
}
