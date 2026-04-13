export type EntityId = string

export type TimestampValue = Date | string

export type UserRole = 'admin' | 'user'

export interface User {
  id: EntityId
  fullName: string
  email: string
  universityId: string
  password: string
  universityIdImage: string
  isVerified: boolean
  role: UserRole
  createdAt: TimestampValue
  updatedAt: TimestampValue
}

export interface Book {
  id: EntityId
  name: string
  description: string
  summary: string
  author: string
  category: string
  rating: number
  totalBooks: number
  availableBooks: number
  imageUrl: string
  videoUrl: string
  createdAt: TimestampValue
  updatedAt: TimestampValue
}

export interface Borrow {
  id: EntityId
  userId: User['id']
  bookId: Book['id']
  borrowDate: TimestampValue
  dueDate: TimestampValue
  returnDate: TimestampValue | null
  createdAt: TimestampValue
  updatedAt: TimestampValue
}
