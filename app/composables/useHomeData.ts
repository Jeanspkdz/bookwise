import type { Result } from '~~/layers/shared/shared/types/result'
import { useRequestFetch } from '#app'

export function useHomeData() {
  const requestFetch = useRequestFetch()

  const getFeaturedBook = async (): Promise<Result<GetFeaturedBookResponse, string>> => {
    try {
      const data = await requestFetch<GetFeaturedBookResponse>('/api/book', {
        method: 'GET',
        query: { featured: true },
      })
      return { type: 'success', data }
    } catch {
      return { type: 'failure', error: 'Something went wrong. Failed to get featured book' }
    }
  }

  const getPopularBooks = async (): Promise<Result<GetPopularBooksResponse, string>> => {
    try {
      const data = await requestFetch<GetPopularBooksResponse>('/api/book', {
        method: 'GET',
        query: { sort: 'popular' },
      })
      return { type: 'success', data }
    } catch {
      return { type: 'failure', error: 'Something went wrong. Failed to get popular books' }
    }
  }

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
