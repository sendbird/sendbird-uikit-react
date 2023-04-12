/**
 * CreateAction
 * @param T - the payload types { [K]: T[K]}
 * @returns the union of all the payload as actionTypes { type: K, payload: T[K] }
 * Note, recommend to keep the payload as optional if the payload is null
 * Note, keep a const object of the action types to avoid typos
 * see README.md for more info
 */
export type CreateAction<T> = {
  [K in keyof T]: T[K] extends null ? { type: K, payload?: null } : { type: K, payload: T[K] }
}[keyof T];

