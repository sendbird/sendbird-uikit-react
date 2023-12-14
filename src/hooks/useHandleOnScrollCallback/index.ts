import React from 'react';
import { SCROLL_BUFFER } from '../../utils/consts';
import { useThrottleCallback } from '../useThrottleCallback';
import { isAboutSame } from '../../modules/Channel/context/utils';
import { usePreservedCallback } from '@sendbird/uikit-tools';

const DELAY = 100;

export interface UseHandleOnScrollCallbackProps {
  hasMore: boolean;
  hasNext?: boolean;
  onScroll(callback: () => void): void;
  scrollRef: React.RefObject<HTMLDivElement>;
  setShowScrollDownButton?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsScrolled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function calcScrollBottom(
  scrollHeight: number,
  scrollTop: number,
): number {
  return scrollHeight - scrollTop;
}

export function useHandleOnScrollCallback({
  hasMore,
  hasNext,
  onScroll,
  scrollRef,
  setShowScrollDownButton,
}: UseHandleOnScrollCallbackProps): () => void {

  const scrollCb = usePreservedCallback(() => {
    const element = scrollRef?.current;
    if (element == null) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
    // https://sendbird.atlassian.net/browse/SBISSUE-11759
    // the edge case where channel is inside a page that already has scroll
    // scrollintoView will move the whole page, which we dont want
    const scrollBottom = calcScrollBottom(scrollHeight, scrollTop);
    // even if there is more to fetch or not,
    // we still have to show the scroll to bottom button
    if (typeof setShowScrollDownButton === 'function') {
      setShowScrollDownButton(scrollHeight > scrollTop + clientHeight + 1);
    }

    // Load previous messages
    // 1. check if hasMore(hasPrevious) and reached to top
    // 2. load previous messages (onScroll)
    // 3. maintain scroll position (sets the scroll position to the bottom of the new messages)
    if (hasMore && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
      onScroll(() => {
        const messagesAreAddedToView = element.scrollHeight > scrollHeight;
        if (messagesAreAddedToView) element.scrollTop = element.scrollHeight - scrollBottom;
      });
    }

    // Load next messages
    // 1. check if hasNext and reached to bottom
    // 2. load next messages (onScroll)
    // 3. maintain scroll position (sets the scroll position to the top of the new messages)
    if (hasNext && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)) {
      onScroll(() => {
        const messagesAreAddedToView = element.scrollHeight > scrollHeight;
        if (messagesAreAddedToView) element.scrollTop = scrollTop;
      });
    }
  });

  return useThrottleCallback(scrollCb, DELAY, { trailing: true });
}
