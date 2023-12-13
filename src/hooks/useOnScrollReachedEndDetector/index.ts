import React, { useEffect, useRef } from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { useDebounce } from '../useDebounce';
import { usePreservedCallback } from '@sendbird/uikit-tools';

const BUFFER_DELAY = 500;

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

      if (isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
        onReachedTop(positionEvent);
      } else if (isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
        onReachedBottom(positionEvent);
      } else {
        onInBetween(positionEvent);
      }
    }
  });

  return useDebounce(cb, BUFFER_DELAY);
}
export function useOnScrollPositionChangeDetectorWithRef(
  scrollRef: React.RefObject<HTMLDivElement>,
  params: UseOnScrollReachedEndDetectorParams,
) {
  const _params = useRef(params);
  _params.current = params;

  useEffect(() => {
    const elem = scrollRef.current;
    if (elem) {
      // TODO: apply throttle
      const callback = () => {
        const { scrollTop, scrollHeight, clientHeight } = elem;

        const event: onPositionEvent = {
          distanceFromBottom: scrollHeight - scrollTop - clientHeight,
        };

        if (isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
          _params.current.onReachedTop(event);
        } else if (isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
          _params.current.onReachedBottom(event);
        } else {
          _params.current.onInBetween(event);
        }
      };

      elem.addEventListener('scroll', callback);
      return () => elem.removeEventListener('scroll', callback);
    }
  }, [scrollRef.current]);
}
