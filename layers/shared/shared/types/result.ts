type Success<T> = { type: 'success'; data: T }
type Failure<E> = { type: 'failure'; error: E }

export type Result<T, E> = Success<T> | Failure<E>
