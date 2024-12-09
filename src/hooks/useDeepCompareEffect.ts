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
 * instead of reference equality.
 *
 * Best used when:
 * - Working with complex objects without guaranteed immutability
 * - Handling data from external sources where reference equality isn't maintained
 * - Dealing with deeply nested objects where individual memoization is impractical
 *
 * Avoid using when:
 * - Detecting changes within array items is crucial
 * - Performance is critical (deep comparison is expensive)
 * - Working primarily with primitive values or simple objects
 *
 * @example
 * useDeepCompareEffect(() => {
 *   // Effect logic
 * }, [complexObject, anotherObject]);
 *
 * @param callback Effect callback that can return a cleanup function
 * @param dependencies Array of dependencies to be deeply compared
 */
function useDeepCompareEffect(
  callback: () => void | (() => void),
  dependencies: any[],
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default useDeepCompareEffect;
