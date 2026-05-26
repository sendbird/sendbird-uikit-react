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

/**
 * Reason tag for `applyStorePatch`. Free-form string today; Phase 2's
 * runtime adapter will narrow this to a discriminated event union.
 */
export type StorePatchReason = string;

export type ApplyStorePatchOptions = {
  /**
   * Bypass the `hasStateChanged` equality short-circuit so subscribers are
   * notified even when the resulting state is structurally equal. Required
   * for legacy paths where reference identity is load-bearing (e.g. channel
   * switch — see `useGroupChannel.setCurrentChannel`). Equivalent to
   * `store.setState(patch, true)`.
   */
  bypassEquality?: boolean;
};

/**
 * Narrow patch helper that respects the production equality short-circuit
 * and emits a `reason` to a dev/test instrumentation hook for debugging.
 *
 * Production (`NODE_ENV === 'production'`) is a thin wrapper around
 * `store.setState`. Test/dev environments invoke
 * `globalThis.__APPLY_STORE_PATCH_HOOK__({ reason, keys, bypassEquality })`
 * if present — a simple way to correlate runtime events with state writes
 * during test assertions or debugging.
 */
export function applyStorePatch<TState>(
  store: Store<TState>,
  patch: Partial<TState>,
  reason: StorePatchReason,
  opts?: ApplyStorePatchOptions,
): void {
  const bypassEquality = opts?.bypassEquality === true;
  if (process.env.NODE_ENV !== 'production') {
    const hook = (globalThis as unknown as {
      __APPLY_STORE_PATCH_HOOK__?: (info: {
        reason: StorePatchReason;
        keys: string[];
        bypassEquality: boolean;
      }) => void;
    }).__APPLY_STORE_PATCH_HOOK__;
    if (typeof hook === 'function') {
      hook({ reason, keys: Object.keys(patch as object), bypassEquality });
    }
  }
  store.setState(patch as Partial<TState>, bypassEquality);
}
