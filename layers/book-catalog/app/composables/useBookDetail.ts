import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

interface UseBookDetailOptions {
  lazy?: boolean
}

export function useBookDetail(id: MaybeRefOrGetter<Book['id']>, options: UseBookDetailOptions = {}) {
  const { lazy = true } = options
  const bookId = computed(() => toValue(id))

  const {
    data: book,
    pending,
    error,
    refresh,
    execute,
  } = useFetch<Book | null>(() => `/api/book/${bookId.value}`, {
    method: 'GET',
    key: () => `admin-book-${bookId.value}`,
    lazy,
    default: () => null,
    watch: [bookId],
  })

  return { book, pending, error, refresh, execute }
}
