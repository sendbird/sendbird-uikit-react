// thanks to: https://stackoverflow.com/questions/48048957/react-long-press-event
/* example:
  const Component = ({ onClick }) => {
    const onLongPress = useLongPress({
      onClick: onClick,
      onLongPress: () => {
        alert('longpress');
      }
    }, {
      delay: 500,
      shouldPreventDefault: true,
    });
    return (
      <button {...onLongPress}>
        hello
      </button>
    )
  }
*/
import React, {
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  useMediaQueryContext,
} from '../lib/MediaQueryContext';

const DEFAULT_DURATION = 300;

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) {
    return
  }

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onLongPress: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  delay?: number;
  shouldPreventDefault?: boolean;
}

interface UseLongPressType<T> {
  onMouseDown: (e: React.MouseEvent<T>) => void;
  onTouchStart: (e: React.TouchEvent<T>) => void;
  onMouseUp: (e: React.MouseEvent<T>) => void;
  onMouseLeave: (e: React.MouseEvent<T>) => void;
  onTouchEnd: (e: React.TouchEvent<T>) => void;
}

export default function useLongPress<T> ({
  onLongPress,
  onClick,
}: PressHandlers<T>, {
  delay = DEFAULT_DURATION,
  shouldPreventDefault = true,
}: Options = {}): UseLongPressType<T> {
  const { isMobile } = useMediaQueryContext();
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  // https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const target = useRef<EventTarget>();

  const start = useCallback((e: React.MouseEvent<T> | React.TouchEvent<T>) => {
    if (!isMobile) {
      return;
    }
    e.persist();
    const clonedEvent = {
      ...e
    };

    if (shouldPreventDefault && e.target) {
      e.target.addEventListener(
        'touchend',
        preventDefault, {
          passive: false
        }
      );
      target.current = e.target;
    }

    timeout.current = setTimeout(() => {
      onLongPress(clonedEvent);
      setLongPressTriggered(true);
    }, delay);
  }, [onLongPress, delay, shouldPreventDefault, isMobile]);

  const clear = useCallback((
    e: React.MouseEvent<T> | React.TouchEvent<T>,
    shouldTriggerClick = true,
  ) => {
    if (timeout?.current) {
      clearTimeout(timeout.current);
    }
    if (shouldTriggerClick && !longPressTriggered) {
      onClick?.(e);
    }
    setLongPressTriggered(false);

    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault);
    }
  },[shouldPreventDefault, onClick, longPressTriggered]);

  return {
    onMouseDown: (e: React.MouseEvent<T>) => start(e),
    onTouchStart: (e: React.TouchEvent<T>) => start(e),
    onMouseUp: (e: React.MouseEvent<T>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<T>) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent<T>) => clear(e),
  };
}
