export function useHomeData() {
  const { getFeaturedBook, getPopularBooks } = useBooks()

  const asyncData = useAsyncData('home-data', async () => {
    const [featuredResult, popularResult] = await Promise.all([
      getFeaturedBook(),
      getPopularBooks(),
    ])

    const featuredBook = featuredResult.type === 'success' ? featuredResult.data.featuredBook : null
    const popularBooks = popularResult.type === 'success' ? popularResult.data.popularBooks : []

    return {
      featuredBook,
      popularBooks,
    }
  })

  return {
    featuredBook: computed(() => asyncData.data.value?.featuredBook ?? null),
    popularBooks: computed(() => asyncData.data.value?.popularBooks ?? []),
    pending: asyncData.pending,
    error: asyncData.error,
    refresh: asyncData.refresh,
  }
}
