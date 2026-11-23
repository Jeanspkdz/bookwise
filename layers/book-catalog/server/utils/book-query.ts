import { and, asc, desc, getColumns, ilike, ne, or } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { z } from 'zod'
import { bookSchema } from '~~/layers/shared/server/db/schema/book.schema'

export type SortableBookField = keyof typeof bookSchema.$inferSelect
const bookColumns = getColumns(bookSchema)
export const sortableBookFieldSchema = z
  .string()
  .refine((field) => Object.hasOwn(bookColumns, field), 'Invalid book sort field')
  .transform((field) => field as SortableBookField)

export class BookQueryBuilder {
  private filters: SQL[] = []
  private sort: SortableBookField = 'createdAt'
  private order: 'asc' | 'desc' = 'asc'

  search(value?: string, field: 'all' | 'name' | 'author' | 'category' = 'all') {
    if (value) {
      const pattern = `%${value.replace(/[\\%_]/g, '\\$&')}%`
      const fields = field === 'all' ? (['name', 'author', 'category'] as const) : [field]
      const filter = or(...fields.map((key) => ilike(bookColumns[key], pattern)))
      if (filter) this.filters.push(filter)
    }
    return this
  }

  category(value?: string) {
    if (value) this.filters.push(ilike(bookColumns.category, value.replace(/[\\%_]/g, '\\$&')))
    return this
  }

  exclude(id?: string) {
    if (id) this.filters.push(ne(bookColumns.id, id))
    return this
  }

  sortBy(field: SortableBookField, order: 'asc' | 'desc' = 'asc') {
    this.sort = field
    this.order = order
    return this
  }

  build() {
    const column = bookColumns[this.sort]
    const orderFn = this.order === 'asc' ? asc : desc

    return {
      where: this.filters.length ? and(...this.filters) : undefined,
      orderBy: [orderFn(column), asc(bookColumns.id)] as const,
    }
  }
}
