import { useLayoutEffect } from 'react';
import { usePreservedCallback } from '@sendbird/uikit-tools';

type KeyDownCallbackMap = Record<string, (event: React.KeyboardEvent<HTMLDivElement>) => void>;

export function useKeyDown(
  ref: React.RefObject<HTMLDivElement>,
  keyDownCallbackMap: KeyDownCallbackMap,
): React.KeyboardEventHandler<HTMLDivElement> {

  useLayoutEffect(() => {
    ref.current?.focus();
  }, [ref.current]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = usePreservedCallback((event) => {
    const callback = keyDownCallbackMap[event.key];
    callback?.(event);
    event.stopPropagation();
  });

  return onKeyDown;
}
