export function useAdminBookCatalog() {
  const { data, pending, error, refresh } = useFetch<Book[]>('/api/book', {
    method: 'GET',
    key: 'admin-books',
    lazy: true,
    default: () => [],
    headers: {
      'bookwise-bypass-cache': 'true',
    },
  })

  return {
    books: computed(() => data.value ?? []),
    pending,
    error,
    refresh,
  }
}
