import React, { useCallback } from 'react';
import { SCROLL_BUFFER } from '../../../../utils/consts';

export interface UseHandleOnScrollCallbackProps {
  setShowScrollDownButton: React.Dispatch<React.SetStateAction<boolean>>;
  hasMore: boolean;
  onScroll(fn: () => void): void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export function calcScrollBottom(scrollHeight: number, scrollTop: number): number {
  return scrollHeight - scrollTop
}

export function useHandleOnScrollCallback({
  setShowScrollDownButton,
  hasMore,
  onScroll,
  scrollRef,
}: UseHandleOnScrollCallbackProps): (e: React.UIEvent<HTMLElement>) => void {
  return useCallback((e) => {
    const element = e.target as Element;
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
    if (scrollHeight > scrollTop + clientHeight + 1) {
      setShowScrollDownButton(true);
    } else {
      setShowScrollDownButton(false);
    }
    if (!hasMore) {
      return;
    }
    if (scrollTop < SCROLL_BUFFER) {
      onScroll(() => {
        // sets the scroll position to the bottom of the new messages
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollBottom;
      });
    }
  }, [
    setShowScrollDownButton,
    hasMore,
    onScroll,
    scrollRef,
  ]);
}
