export type PartialBy<O extends object, Keys extends keyof O> = {
  [K in Keys]?: O[K]
} & Omit<O, Keys>
