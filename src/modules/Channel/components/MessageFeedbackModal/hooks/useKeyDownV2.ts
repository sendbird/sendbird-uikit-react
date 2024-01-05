import { useCallback, useLayoutEffect } from 'react';

type KeyDownCallbackMap = Record<string, (event: React.KeyboardEvent<HTMLDivElement>) => void>;

interface UseKeyDownV2Props {
  ref: React.RefObject<HTMLDivElement>;
  keyDownCallbackMap: KeyDownCallbackMap;
}

export function useKeyDownV2(props: UseKeyDownV2Props): React.KeyboardEventHandler<HTMLDivElement> {
  const { ref, keyDownCallbackMap } = props;

  useLayoutEffect(() => {
    ref.current?.focus();
  }, [ref.current]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
    switch (event.key) {
      case 'Escape': {
        const callback = keyDownCallbackMap['Escape'];
        callback?.(event);
        break;
      }
      case 'ArrowLeft': {
        const callback = keyDownCallbackMap['ArrowLeft'];
        callback?.(event);
        break;
      }
      case 'ArrowRight': {
        const callback = keyDownCallbackMap['ArrowRight'];
        callback?.(event);
        break;
      }
      case 'Enter': {
        const callback = keyDownCallbackMap['Enter'];
        callback?.(event);
        break;
      }
      default:
        break;
    }
    event.stopPropagation();
  }, []);

  return onKeyDown;
}
