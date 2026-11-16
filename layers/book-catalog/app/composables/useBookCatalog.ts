export function useBookCatalog() {
  const { data, pending, error, refresh } = useFetch<Book[]>('/api/book', {
    method: 'GET',
    key: 'book-catalog',
    lazy: true,
    default: () => [],
  })

  return {
    books: computed(() => data.value ?? []),
    pending,
    error,
    refresh,
  }
}
