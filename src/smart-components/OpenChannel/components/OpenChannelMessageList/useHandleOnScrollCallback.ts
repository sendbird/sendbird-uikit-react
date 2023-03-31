import React, { useCallback } from "react";
import { SCROLL_BUFFER } from "../../../../utils/consts";

export interface UseHandleOnScrollCallbackProps {
  setShowScrollDownButton: React.Dispatch<React.SetStateAction<boolean>>;
  hasMore: boolean;
  onScroll(fn: () => void): void;
  scrollRef: React.RefObject<HTMLDivElement>;
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
    const scrollBottom = scrollHeight - scrollTop;
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
        // Fetch more messages
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
