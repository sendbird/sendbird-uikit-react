import { useLayoutEffect } from 'react';

// this hook accepts a callback to run component is unmounted
export function useUnmount(callback: () => void) {
  useLayoutEffect(() => {
    return () => {
      callback();
    };
  }, []);
}
