import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Custom hook that works like useEffect but performs a deep comparison of dependencies
 * instead of reference equality. This is useful when dealing with complex objects or arrays
 * in dependencies that could trigger unnecessary re-renders.
 *
 * Inspired by https://github.com/kentcdodds/use-deep-compare-effect
 *
 * @param callback Effect callback that can either return nothing (void) or return a cleanup function (() => void).
 * @param dependencies Array of dependencies to be deeply compared
 */
function useDeepCompareEffect(
  callback: () => void | (() => void),
  dependencies: any[],
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default useDeepCompareEffect;
