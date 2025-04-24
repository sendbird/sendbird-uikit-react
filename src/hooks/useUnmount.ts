import { useLayoutEffect, useRef } from 'react';

// this hook accepts a callback to run component is unmounted
export function useUnmount(callback: () => void) {
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useLayoutEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}
