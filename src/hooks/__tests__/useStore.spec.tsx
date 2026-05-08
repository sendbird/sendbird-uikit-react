import React, { createContext } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useStore } from '../useStore';
import { createStore, type Store } from '../../utils/storeManager';

type TestState = {
  count: number;
  label: string;
};

const initialState: TestState = {
  count: 0,
  label: 'initial',
};

const StoreContext = createContext<Store<TestState> | null>(null);

describe('useStore', () => {
  it('throws when used without a store provider', () => {
    expect(() => renderHook(() => useStore(StoreContext, (state) => state.count, initialState))).toThrow(
      'useStore must be used within a StoreProvider',
    );
  });

  it('selects store state and applies changed updates only', () => {
    const store = createStore(initialState);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    );

    const { result } = renderHook(() => useStore(StoreContext, (state) => state.count, initialState), { wrapper });

    expect(result.current.state).toBe(0);

    act(() => {
      result.current.updateState({ count: 1 });
    });
    expect(result.current.state).toBe(1);
    expect(store.getState()).toEqual({ count: 1, label: 'initial' });

    act(() => {
      result.current.updateState({ count: 1 });
    });
    expect(result.current.state).toBe(1);
    expect(store.getState()).toEqual({ count: 1, label: 'initial' });
  });
});
