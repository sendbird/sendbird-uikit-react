import { useContext, useRef, useSyncExternalStore, useCallback } from 'react';
import { type Store } from '../utils/storeManager';

type StoreSelector<T, U> = (state: T) => U;

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
    store.setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, [store]);

  return {
    state,
    updateState,
  };
}
