import React, { useLayoutEffect, useRef } from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { usePreservedCallback } from '@sendbird/uikit-tools';
import { throttle, useThrottleCallback } from '../useThrottleCallback';

const BUFFER_DELAY = 100;

type onPositionEvent = { distanceFromBottom: number };
export interface UseOnScrollReachedEndDetectorParams {
  onReachedTop?: (event: onPositionEvent) => void;
  onReachedBottom?: (event: onPositionEvent) => void;
  onInBetween?: (event: onPositionEvent) => void;
}

export function useOnScrollPositionChangeDetector(
  params: UseOnScrollReachedEndDetectorParams,
): (event: React.UIEvent<HTMLDivElement, UIEvent>) => void {
  const { onReachedTop, onReachedBottom, onInBetween } = params;

  const cb = usePreservedCallback((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event?.target) {
      const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement;

      const positionEvent: onPositionEvent = {
        distanceFromBottom: scrollHeight - scrollTop - clientHeight,
      };

      if (onReachedTop && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
        onReachedTop(positionEvent);
      } else if (onReachedBottom && isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
        onReachedBottom(positionEvent);
      } else if (onInBetween) {
        onInBetween(positionEvent);
      }
    }
  });

  return useThrottleCallback(cb, BUFFER_DELAY, { trailing: true });
}
export function useOnScrollPositionChangeDetectorWithRef(
  scrollRef: React.RefObject<HTMLDivElement>,
  params: UseOnScrollReachedEndDetectorParams,
) {
  const _params = useRef(params);
  _params.current = params;

  useLayoutEffect(() => {
    const elem = scrollRef.current;
    if (elem) {
      const callback = throttle(
        () => {
          const { scrollTop, scrollHeight, clientHeight } = elem;

          const event: onPositionEvent = {
            distanceFromBottom: scrollHeight - scrollTop - clientHeight,
          };

          const reachedTop = _params.current.onReachedTop && isAboutSame(scrollTop, 0, SCROLL_BUFFER);
          const reachedBottom = _params.current.onReachedBottom && isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER);
          if (reachedBottom) {
            _params.current.onReachedBottom(event);
          } else if (reachedTop) {
            _params.current.onReachedTop(event);
          } else if (_params.current.onInBetween) {
            _params.current.onInBetween(event);
          }
        },
        BUFFER_DELAY,
        { trailing: true },
      );

      elem.addEventListener('scroll', callback);
      return () => elem.removeEventListener('scroll', callback);
    }
  }, [scrollRef.current]);
}
