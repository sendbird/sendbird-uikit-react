import React, { useCallback } from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { useDebounce } from '../useDebounce';

const BUFFER_DELAY = 500;

export interface UseOnScrollReachedEndDetectorProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  onReachedTop?: () => void;
  onReachedBottom?: () => void;
}

export function useOnScrollReachedEndDetector(props: UseOnScrollReachedEndDetectorProps): () => void {
  const {
    scrollRef,
    onReachedTop,
    onReachedBottom,
  } = props;

  const cb = useCallback(() => {
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
      }
    }
  }, [scrollRef, onReachedTop, onReachedBottom]);

  return useDebounce(cb, BUFFER_DELAY);
}
