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
  const timer = useRef<NodeJS.Timeout>(null);
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

/**
 * Note: `leading` has higher priority rather than `trailing`
 * */
export function throttle<T extends(...args: any[]) => void>(
  callback: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {
    leading: true,
    trailing: false,
  },
) {
  let timer = null;
  let trailingArgs = null;

  return ((...args: any[]) => {
    if (timer) {
      trailingArgs = args;
      return;
    }

    if (options.leading) {
      callback(...args);
    } else {
      trailingArgs = args;
    }

    const invoke = () => {
      if (options.trailing && trailingArgs) {
        callback(...trailingArgs);
        trailingArgs = null;
        timer = setTimeout(invoke, delay);
      } else {
        timer = null;
      }
    };

    timer = setTimeout(invoke, delay);
  }) as T;
}
