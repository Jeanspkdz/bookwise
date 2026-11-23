import { ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, WatchSource } from 'vue'


export function usePagination(resetOn: WatchSource[] = []) {
  const page = ref(1)
  const setPage = (value: number): void => {
    page.value = value
  }
  const resetPage = (): void => setPage(1)

  if (resetOn.length) watch(resetOn, resetPage)

  const watchTotalPages = (source: MaybeRefOrGetter<number | undefined>): void => {
    watch(
      () => toValue(source),
      (totalPages) => {
        const lastPage = Math.max(1, totalPages ?? 1)
        if (page.value > lastPage) setPage(lastPage)
      },
    )
  }

  return { page, setPage, resetPage, watchTotalPages }
}
