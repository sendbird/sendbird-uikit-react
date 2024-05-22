import React from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { usePreservedCallback } from '@sendbird/uikit-tools';
import { useThrottleCallback } from '../useThrottleCallback';

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
