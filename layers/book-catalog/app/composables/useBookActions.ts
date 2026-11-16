import type { Result } from '~~/layers/shared/shared/types/result'

export function useBookActions() {
  const { startUpload: startImageUpload } = useUploadThing('bookImage')
  const { startUpload: startVideoUpload } = useUploadThing('bookVideo')

  const createBook = async (
    payload: CreateBookPayload,
  ): Promise<Result<CreateBookResponse, string>> => {
    try {
      const [imageUploadResult, videoUploadResult] = await Promise.all([
        startImageUpload([payload.bookImage]),
        startVideoUpload([payload.bookVideo]),
      ])

      const imageUrl = imageUploadResult?.[0]?.ufsUrl
      const videoUrl = videoUploadResult?.[0]?.ufsUrl

      const response = await $fetch<CreateBookResponse>('/api/book', {
        method: 'POST',
        body: {
          name: payload.name,
          description: payload.description,
          summary: payload.summary,
          author: payload.author,
          category: payload.category,
          rating: payload.rating,
          totalBooks: payload.totalBooks,
          availableBooks: payload.totalBooks,
          imageUrl,
          videoUrl,
          coverColor: payload.coverColor,
        },
      })

      return { type: 'success', data: response }
    } catch {
      return { type: 'failure', error: 'Something went wrong. Failed to create book' }
    }
  }

  const updateBook = async (
    id: Book['id'],
    payload: UpdateBookPayload,
    currentBook: Book,
  ): Promise<Result<UpdateBookResponse, string>> => {
    try {
      let imageUrl = currentBook.imageUrl
      let videoUrl = currentBook.videoUrl

      if (payload.bookImage) {
        const imageUploadResult = await startImageUpload([payload.bookImage])
        const uploadedImageUrl = imageUploadResult?.[0]?.ufsUrl

        if (!uploadedImageUrl) {
          return { type: 'failure', error: 'Book Image could not be uploaded' }
        }

        imageUrl = uploadedImageUrl
      }

      if (payload.bookVideo) {
        const videoUploadResult = await startVideoUpload([payload.bookVideo])
        const uploadedVideoUrl = videoUploadResult?.[0]?.ufsUrl

        if (!uploadedVideoUrl) {
          return { type: 'failure', error: 'Book Video could not be uploaded' }
        }

        videoUrl = uploadedVideoUrl
      }

      const response = await $fetch<UpdateBookResponse>(`/api/book/${id}`, {
        method: 'PUT',
        body: {
          name: payload.name,
          description: payload.description,
          summary: payload.summary,
          author: payload.author,
          category: payload.category,
          rating: payload.rating,
          totalBooks: payload.totalBooks,
          availableBooks: payload.totalBooks,
          imageUrl,
          videoUrl,
          coverColor: payload.coverColor,
        },
      })

      return { type: 'success', data: response }
    } catch {
      return { type: 'failure', error: 'Something went wrong. Failed to update book' }
    }
  }

  const deleteBook = async (id: DeleteBookPayload): Promise<Result<DeleteBookResponse, string>> => {
    try {
      const response = await $fetch<DeleteBookResponse>(`/api/book/${id}`, {
        method: 'DELETE',
      })

      return { type: 'success', data: response }
    } catch {
      return { type: 'failure', error: 'Something went wrong. Failed to delete book' }
    }
  }

  return { createBook, updateBook, deleteBook }
}
