import { useEffect, useRef } from 'react';
import { usePreservedCallback } from '@sendbird/uikit-tools';

/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
export function useThrottleCallback<T extends(...args: any[]) => void>(
  callback: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {
    leading: true,
    trailing: false,
  },
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailingArgs = useRef<any[] | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return usePreservedCallback((...args: any[]) => {
    if (timer.current) {
      trailingArgs.current = args;
      return;
    }

    if (options.leading) {
      callback(...args);
    } else {
      trailingArgs.current = args;
    }

    const invoke = () => {
      if (options.trailing && trailingArgs.current) {
        callback(...trailingArgs.current);
        trailingArgs.current = null;
        timer.current = setTimeout(invoke, delay);
      } else {
        timer.current = null;
      }
    };

    timer.current = setTimeout(invoke, delay);
  }) as T;
}
