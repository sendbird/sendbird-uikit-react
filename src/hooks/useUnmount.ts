import { DependencyList, useLayoutEffect } from 'react';

// this hook accepts a callback to run component is unmounted
export function useUnmount(callback: () => void, deps: DependencyList = []) {
  useLayoutEffect(() => {
    return () => {
      callback();
    };
  }, deps);
}
