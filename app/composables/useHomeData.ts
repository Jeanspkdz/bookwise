export function useHomeData() {
  const { getFeaturedBook, getPopularBooks } = useBooks()

  const {
    data: featuredData,
    pending: featuredPending,
    refresh: refreshFeaturedBook,
  } = useAsyncData('home-featured-book', async () => {
    const result = await getFeaturedBook()

    if (result.type === 'failure') {
      return {
        featuredBook: null,
        featuredError: result.error,
      }
    }

    return {
      featuredBook: result.data.featuredBook,
      featuredError: null,
    }
  })

  const {
    data: popularData,
    pending: popularPending,
    refresh: refreshPopularBooks,
  } = useAsyncData('home-popular-books', async () => {
    const result = await getPopularBooks()

    if (result.type === 'failure') {
      return {
        popularBooks: [],
        popularError: result.error,
      }
    }

    return {
      popularBooks: result.data.popularBooks,
      popularError: null,
    }
  })

  const refreshHomeData = () => Promise.all([refreshFeaturedBook(), refreshPopularBooks()])

  return {
    featuredBook: computed(() => featuredData.value?.featuredBook ?? null),
    featuredError: computed(() => featuredData.value?.featuredError ?? null),
    featuredPending,
    refreshFeaturedBook,

    popularBooks: computed(() => popularData.value?.popularBooks ?? []),
    popularError: computed(() => popularData.value?.popularError ?? null),
    popularPending,
    refreshPopularBooks,

    refreshHomeData,
  }
}
