import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useContext, useRef, useCallback, useMemo } from 'react';
import { type Store, hasStateChanged } from '../utils/storeManager';

type StoreSelector<T, U> = (state: T) => U;

export type EqualityFn<T> = (left: T, right: T) => boolean;

/**
 * A generic hook for accessing and updating store state
 * @param StoreContext
 * @param selector
 * @param initialState
 */
export function useStore<T, U>(
  StoreContext: React.Context<Store<T> | null>,
  selector: StoreSelector<T, U>,
  initialState: T,
) {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  // Ensure the stability of the selector function using useRef
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  /**
   * useSyncExternalStore - a new API introduced in React18
   * but we're using a shim for now since it's only available in 18 >= version.
   * useSyncExternalStore simply tracks changes in an external store that is not dependent on React
   * through useState and useEffect
   * and helps with re-rendering and state sync through the setter of useState
   */
  const state = useSyncExternalStore(
    store.subscribe,
    () => selectorRef.current(store.getState()),
    () => selectorRef.current(initialState),
  );

  const updateState = useCallback((updates: Partial<T>) => {
    const currentState = store.getState();

    if (hasStateChanged(currentState, updates)) {
      store.setState((prevState) => ({
        ...prevState,
        ...updates,
      }));
    }
  }, [store]);

  return useMemo(() => ({
    state,
    updateState,
  }), [state, updateState]);
}

/**
 * Narrow-slice store subscription. Returns the selector output and only
 * triggers a rerender when the selector output changes per `equalityFn`
 * (default: `Object.is`).
 *
 * Implementation: a memoized `getSnapshot` returns the LAST selected value
 * by reference when equality holds, so `useSyncExternalStore`'s internal
 * `Object.is(prev, next)` comparison short-circuits. This is the standard
 * memoizing-getSnapshot pattern used by zustand/redux-react.
 *
 * Consumers needing value-semantics on object snapshots should pass a
 * shallow or deep equality function explicitly. The default identity
 * comparison is sufficient for primitives and for object slices that are
 * known to be reference-stable.
 *
 * @throws Error when used outside of a matching StoreContext provider.
 */
export function useStoreSelector<TState, TSelected>(
  StoreContext: React.Context<Store<TState> | null>,
  selector: StoreSelector<TState, TSelected>,
  equalityFn: EqualityFn<TSelected> = Object.is,
): TSelected {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStoreSelector must be used within a StoreProvider');
  }

  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const equalityRef = useRef(equalityFn);
  equalityRef.current = equalityFn;

  // Caches both the raw store snapshot and the derived selector value.
  // Re-runs the selector only when the raw snapshot reference changed
  // (i.e., after a store notification). This prevents getSnapshot from
  // returning unstable references for selectors that build new objects
  // each call.
  const memo = useRef<{
    rawSnapshot: TState | undefined;
    selected: TSelected;
    initialized: boolean;
  }>({ rawSnapshot: undefined, selected: undefined as unknown as TSelected, initialized: false });

  const getSnapshot = useCallback(() => {
    const raw = store.getState();
    if (memo.current.initialized && Object.is(memo.current.rawSnapshot, raw)) {
      return memo.current.selected;
    }
    const next = selectorRef.current(raw);
    if (memo.current.initialized && equalityRef.current(memo.current.selected, next)) {
      // Selector output is "equal" per equalityFn — preserve the previous
      // reference for stable identity downstream.
      memo.current = { rawSnapshot: raw, selected: memo.current.selected, initialized: true };
      return memo.current.selected;
    }
    memo.current = { rawSnapshot: raw, selected: next, initialized: true };
    return next;
  }, [store]);

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
