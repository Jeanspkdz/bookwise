import { useRouteQuery } from '@vueuse/router'
import { watch } from 'vue'

// Syncs serialized state with query parameters; callers own parsing and state restoration.
export function useQuerySync<T extends Record<string, string>>(
  state: () => T,
  options: { defaults: T; restore: (values: T) => void },
) {
  const routeOptions = { route: useRoute(), router: useRouter(), mode: 'replace' as const }
  const entries = (Object.keys(options.defaults) as Array<keyof T & string>).map((key) => ({
    key,
    query: useRouteQuery(key, options.defaults[key], {
      ...routeOptions,
      transform: (value: unknown) => (typeof value === 'string' ? value : options.defaults[key]),
    }),
  }))
  const restore = (): void => {
    const current = state()
    if (entries.every(({ key, query }) => current[key] === query.value)) return
    const values = Object.fromEntries(entries.map(({ key, query }) => [key, query.value])) as T
    options.restore(values)
  }
  watch(
    entries.map(({ query }) => query),
    restore,
  )
  restore()
  watch(
    state,
    (values) => {
      for (const { key, query } of entries) {
        if (query.value !== values[key]) query.value = values[key]
      }
    },
    { flush: 'post' },
  )
}
