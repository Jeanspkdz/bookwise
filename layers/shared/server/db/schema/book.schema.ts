import { createId } from '@paralleldrive/cuid2'
import { pgTable } from 'drizzle-orm/pg-core'
import * as t from 'drizzle-orm/pg-core'

import { timestamps } from './_column.helpers'

export const bookSchema = pgTable('book', {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: t.text().notNull(),
  description: t.text().notNull(),
  summary: t.text().notNull(),
  author: t.text().notNull(),
  category: t.text().notNull(),
  rating: t.real().notNull().default(0),
  totalBooks: t.integer().notNull().default(0),
  availableBooks: t.integer().notNull().default(0),
  imageUrl: t.text().notNull(),
  imageKey: t.text(),
  videoUrl: t.text().notNull(),
  videoKey: t.text(),
  coverColor: t.varchar({ length: 7 }).notNull().default('#FFFFFF'),
  ...timestamps,
})
