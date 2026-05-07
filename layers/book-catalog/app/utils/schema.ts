import { z } from 'zod'

const MB = 1024 * 1024

export const createBookSchema = z.object({
  name: z.string().min(1, { error: 'Enter a valid book title' }),
  author: z.string().min(1, { error: 'Enter a valid author name' }),
  category: z.string().min(1, { error: 'Enter a valid genre' }),
  description: z.string().min(10, { error: 'Description must be at least 10 characters' }),
  rating: z
    .number({ error: 'Enter a valid rating' })
    .min(0, { error: 'Rating must be at least 0' })
    .max(5, { error: 'Rating cannot exceed 5' }),
  totalBooks: z.coerce.number().min(1, { error: 'Enter a number greater than 0' }),
  bookImage: z
    .file({ error: 'Please upload a book image' })
    .max(10 * MB, 'Image must be smaller than 10MB')
    .mime(['image/jpeg', 'image/png', 'image/webp'], 'Only JPG, PNG, or WEBP images are allowed'),
  coverColor: z.stringFormat('hex-color', /^#([0-9a-fA-F]{6})$/, {
    error: 'Enter a valid hex color',
  }),
  bookVideo: z
    .file({ error: 'Please upload a video' })
    .max(20 * MB, 'Video must be smaller than 20MB'),
  summary: z.string().min(10, { error: 'Summary must be at least 10 characters' }),
})
export type CreateBookSchema = z.infer<typeof createBookSchema>

export const updateBookSchema = createBookSchema.extend({
  bookImage: z
    .file()
    .max(10 * MB, 'Image must be smaller than 10MB')
    .mime(['image/jpeg', 'image/png', 'image/webp'], 'Only JPG, PNG, or WEBP images are allowed')
    .optional(),

  bookVideo: z
    .file()
    .max(20 * MB, 'Video must be smaller than 20MB')
    .optional(),
})
export type UpdateBookSchema = z.infer<typeof updateBookSchema>
