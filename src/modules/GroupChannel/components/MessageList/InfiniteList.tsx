import React, { forwardRef, UIEventHandler, useLayoutEffect, useRef } from 'react';
import { BaseMessage } from '@sendbird/chat/message';
import { isAboutSame } from '../../../Channel/context/utils';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import { noop } from '../../../../utils/utils';

type Props = {
  messages: BaseMessage[];
  renderMessage: (props: { message: BaseMessage; index: number }) => React.ReactNode;

  scrollPositionRef: React.MutableRefObject<number>;
  scrollDistanceFromBottomRef: React.MutableRefObject<number>;

  onLoadPrevious: () => Promise<void>;
  onLoadNext: () => Promise<void>;
  loadThreshold?: number;

  typingIndicator?: React.ReactNode;
  onScrollPosition?: (position: 'top' | 'bottom' | 'middle') => void;
};

export const InfiniteList = forwardRef((props: Props, listRef: React.RefObject<HTMLDivElement>) => {
  const {
    messages,
    renderMessage,

    scrollPositionRef,
    scrollDistanceFromBottomRef,

    onLoadPrevious,
    onLoadNext,
    loadThreshold = 0.05,

    typingIndicator,
    onScrollPosition = noop,
  } = props;

  const isFetching = React.useRef(false);
  const direction = React.useRef<'top' | 'bottom'>();
  const oldScrollTop = useRef(0);

  // SideEffect: keep scroll position
  useLayoutEffect(() => {
    if (listRef.current) {
      if (direction.current === 'top') {
        listRef.current.scrollTop = listRef.current.scrollHeight - scrollPositionRef.current;
      }
      if (direction.current === 'bottom') {
        listRef.current.scrollTop = oldScrollTop.current;
      }
      direction.current = undefined;
    }
  }, [listRef.current, messages.length]);

  const handleScroll: UIEventHandler<HTMLDivElement> = async () => {
    if (!listRef.current) return;
    const list = listRef.current;

    onScrollPosition(getReachedStatus(list));

    scrollPositionRef.current = list.scrollHeight - list.scrollTop;
    scrollDistanceFromBottomRef.current = scrollPositionRef.current - list.clientHeight;
    oldScrollTop.current = list.scrollTop;

    if (isFetching.current) return;

    const threshold = list.clientHeight * Math.min(Math.max(0, loadThreshold), 1);
    if (list.scrollTop <= threshold) {
      isFetching.current = true;
      direction.current = 'top';
      await onLoadPrevious();
      isFetching.current = false;
    } else if (list.scrollHeight - list.scrollTop - list.clientHeight <= threshold) {
      isFetching.current = true;
      direction.current = 'bottom';
      await onLoadNext();
      isFetching.current = false;
    } else {
      direction.current = undefined;
    }
  };

  return (
    <div className="sendbird-conversation__scroll-container">
      <div className="sendbird-conversation__padding" />
      <div
        ref={listRef}
        className="sendbird-conversation__messages-padding"
        data-testid="sendbird-message-list-container"
        onScroll={handleScroll}
      >
        {messages.map((message, index) => renderMessage({ message, index }))}
        {typingIndicator}
      </div>
    </div>
  );
});

function getReachedStatus(element: HTMLDivElement) {
  if (isAboutSame(element.scrollTop, 0, SCROLL_BUFFER)) {
    return 'top';
  }

  if (isAboutSame(element.scrollHeight, element.clientHeight + element.scrollTop, SCROLL_BUFFER)) {
    return 'bottom';
  }

  return 'middle';
}
