export interface CreateBookPayload extends Omit<
  Book,
  'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'videoUrl' | 'availableBooks'
> {
  bookImage: File
  bookVideo: File
}
export type CreateBookEventHandler = (payload: CreateBookPayload) => Promise<void>
export type CreateBookResponse = {
  createdBook: Book
}

export interface UpdateBookPayload extends Omit<
  Book,
  'id' | 'createdAt' | 'updatedAt' | 'imageUrl' | 'videoUrl' | 'availableBooks'
> {
  bookImage?: File | undefined
  bookVideo?: File | undefined
}
export type UpdateBookEventHandler = (payload: UpdateBookPayload) => Promise<void>
export type UpdateBookResponse = {
  updatedBook: Book
}

export type DeleteBookPayload = Book['id']
export type DeleteBookEventHandler = (bookId: DeleteBookPayload) => Promise<void>
export type DeleteBookResponse = {
  deletedBook: Book
}
