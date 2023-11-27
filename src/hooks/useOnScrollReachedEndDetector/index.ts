import React from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { useDebounce } from '../useDebounce';
import { usePreservedCallback } from '@sendbird/uikit-tools';

const BUFFER_DELAY = 500;

export interface UseOnScrollReachedEndDetectorProps {
  onReachedTop?: () => void;
  onReachedBottom?: () => void;
  onInBetween?: () => void;
}

export function useOnScrollPositionChangeDetector(
  props: UseOnScrollReachedEndDetectorProps,
): (event: React.UIEvent<HTMLDivElement, UIEvent>) => void {
  const {
    onReachedTop,
    onReachedBottom,
    onInBetween,
  } = props;

  const cb = usePreservedCallback((event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event?.target) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = event.target as HTMLDivElement;
      if (isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
        onReachedTop?.();
      } else if (isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
        onReachedBottom?.();
      } else {
        onInBetween?.();
      }
    }
  });

  return useDebounce(cb, BUFFER_DELAY);
}
