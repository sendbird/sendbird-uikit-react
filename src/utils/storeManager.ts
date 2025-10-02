import isEqual from 'lodash/isEqual';

// Referrence: https://github.com/pmndrs/zustand
export type Store<T> = {
  getState: () => T;
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), force?: boolean) => void;
  subscribe: (listener: () => void) => () => void;
};

export function hasStateChanged<T>(prevState: T, updates: Partial<T>): boolean {
  return Object.entries(updates).some(([key, value]) => {
    if (typeof prevState[key as keyof T] === 'function' && typeof value === 'function') {
      /**
       * Function is not considered as state change. Why?
       * Because function is not a value, it's a reference.
       * If we consider non-memoized function as state change,
       * it will always be true and cause unnecessary re-renders.
       */
      return false;
    }

    return !isEqual(prevState[key as keyof T], value);
  });
}

interface StoreSetStateJob<T> {
  partial: Partial<T> | ((state: T) => Partial<T>);
  force?: boolean;
}

/**
 * A custom store creation utility
 */
export function createStore<T extends object>(initialState: T): Store<T> {
  let state = { ...initialState };
  const queue: StoreSetStateJob<T>[] = [];
  const listeners = new Set<() => void>();

  const processQueue = () => {
    const job = queue.shift();
    if (!job) return;

    const { partial, force } = job;
    const nextState = typeof partial === 'function' ? partial(state) : partial;
    const hasChanged = hasStateChanged(state, nextState);
    if (force || hasChanged) {
      state = { ...state, ...nextState };
      listeners.forEach((listener) => listener());
    }
  };
  const setState = (partial: Partial<T> | ((state: T) => Partial<T>), force?: boolean) => {
    queue.push({ partial, force });
    processQueue();
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
