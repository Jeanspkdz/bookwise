import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export function useSimilarBooks(
  bookId: MaybeRefOrGetter<Book['id']>,
  category: MaybeRefOrGetter<Book['category'] | undefined>,
) {
  const currentBookId = computed(() => toValue(bookId))
  const currentCategory = computed(() => toValue(category))

  const {
    data: similarBooks,
    pending,
    error,
    refresh,
  } = useFetch<Book[]>('/api/book', {
    key: () => `similar-books-${currentBookId.value}-${currentCategory.value ?? ''}`,
    query: () => ({
      category: currentCategory.value,
      exclude: currentBookId.value,
      limit: 6,
    }),
    watch: [currentBookId, currentCategory],
    default: () => [],
    immediate: computed(() => Boolean(currentCategory.value)),
  })

  return { similarBooks, pending, error, refresh }
}
