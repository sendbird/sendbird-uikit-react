// Referrence: https://github.com/pmndrs/zustand
export type Store<T> = {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
};

/**
 * A custom store creation utility
 */
export function createStore<T extends object>(initialState: T): Store<T> {
  let state = { ...initialState };
  const listeners = new Set<() => void>();

  const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  return {
    getState: () => state,
    setState,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
