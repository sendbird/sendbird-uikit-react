import React, { useCallback } from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';

export interface UseHandleOnScrollCallbackProps {
  hasMore: boolean;
  onScroll(fn: () => void): void;
  scrollRef: React.RefObject<HTMLDivElement>;
  setShowScrollDownButton?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function calcScrollBottom(scrollHeight: number, scrollTop: number): number {
  return scrollHeight - scrollTop
}

export function useHandleOnScrollCallback({
  hasMore,
  onScroll,
  scrollRef,
  setShowScrollDownButton,
}: UseHandleOnScrollCallbackProps): () => void {
  return useCallback(() => {
    const element = scrollRef?.current;
    if (element == null) {
      return;
    }

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = element;
    // https://sendbird.atlassian.net/browse/SBISSUE-11759
    // the edge case where channel is inside a page that already has scroll
    // scrollintoView will move the whole page, which we dont want
    const scrollBottom = calcScrollBottom(scrollHeight, scrollTop);
    // even if there is more to fetch or not,
    // we still have to show the scroll to bottom button
    if (typeof setShowScrollDownButton === 'function') {
      setShowScrollDownButton(scrollHeight > scrollTop + clientHeight + 1)
    }
    if (!hasMore) {
      return;
    }
    if (scrollTop < SCROLL_BUFFER) {
      onScroll(() => {
        // sets the scroll position to the bottom of the new messages
        element.scrollTop = element.scrollHeight - scrollBottom;
      });
    }
  }, [
    setShowScrollDownButton,
    hasMore,
    onScroll,
    scrollRef,
  ]);
}
