import React, { useCallback } from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { useDebounce } from '../useDebounce';

const BUFFER_DELAY = 500;

export interface UseOnScrollReachedEndDetectorProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  onReachedTop?: () => void;
  onReachedBottom?: () => void;
  onInBetween?: () => void;
}

export function useOnScrollPositionChangeDetector(props: UseOnScrollReachedEndDetectorProps): () => void {
  const {
    scrollRef,
    onReachedTop,
    onReachedBottom,
    onInBetween,
  } = props;

// import { usePreservedCallback } from "@sendbird/uikit-tools";
  const cb = usePreservedCallback(() => {
    const current = scrollRef?.current;
    if (current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = current;
      if (isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
        onReachedTop();
      } else if (isAboutSame(scrollHeight, clientHeight + scrollTop, SCROLL_BUFFER)) {
        onReachedBottom();
      } else {
        onInBetween();
      }
    }
  });

  return useDebounce(cb, BUFFER_DELAY);
}
