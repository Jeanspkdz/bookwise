import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { PaginatedResponse } from '~~/layers/shared/shared/types/pagination'
import { createEmptyPaginatedResponse } from '~~/layers/shared/shared/utils/pagination'

export function useSimilarBooks(
  bookId: MaybeRefOrGetter<Book['id']>,
  category: MaybeRefOrGetter<Book['category'] | undefined>,
) {
  const currentBookId = computed(() => toValue(bookId))
  const currentCategory = computed(() => toValue(category))

  const {
    data: similarBooksData,
    pending,
    error,
    refresh,
  } = useFetch<PaginatedResponse<Book>>('/api/book', {
    key: () => `similar-books-${currentBookId.value}-${currentCategory.value ?? ''}`,
    query: () => ({
      category: currentCategory.value,
      exclude: currentBookId.value,
      page: 1,
      pageSize: 6,
    }),
    watch: [currentBookId, currentCategory],
    default: () => createEmptyPaginatedResponse<Book>(1, 6),
    immediate: Boolean(currentCategory.value),
  })

  return {
    similarBooks: computed(() => similarBooksData.value?.items ?? []),
    pending,
    error,
    refresh,
  }
}
