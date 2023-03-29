import './openchannel-message-list.scss';

import React, { ReactElement, useRef, useState, useMemo, useLayoutEffect, useEffect } from 'react';
import isSameDay from 'date-fns/isSameDay';

import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { compareMessagesForGrouping } from '../../context/utils';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';
import OpenChannelMessage from '../OpenChannelMessage';
import { RenderMessageProps } from '../../../../types';
import { FileMessage, UserMessage } from '@sendbird/chat/message';

export type OpenchannelMessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ElementType<RenderMessageProps>;
  renderPlaceHolderEmptyList?: () => React.ReactElement;
}

function OpenchannelMessageList(
  props: OpenchannelMessageListProps,
  ref: React.RefObject<HTMLDivElement>,
): ReactElement {
  const {
    isMessageGroupingEnabled = true,
    allMessages,
    hasMore,
    onScroll,
  } = useOpenChannelContext();
  const scrollRef = ref || useRef(null);
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  // page scroll states
  const [pageScrollHeight, setPageScrollHeight] = useState(0);
  const [pageScrollTop, setPageScrollTop] = useState(0);

  const handleOnScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = element;
    if (scrollTop !== pageScrollTop) {
      setPageScrollTop(scrollTop);
    }
    if (scrollHeight > scrollTop + clientHeight + 1) {
      setShowScrollDownButton(true);
    } else {
      setShowScrollDownButton(false);
    }

    if (!hasMore) {
      return;
    }
    if (scrollTop === 0) {
      onScroll(() => {
        // noop
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      setShowScrollDownButton(false);
    }
  };

  useEffect(() => {
    setPageScrollHeight(scrollRef?.current?.scrollHeight || 0);
  }, [scrollRef?.current?.scrollHeight]);
  useLayoutEffect(() => {
    /**
     * The pageScrollHeight and pageScrollTop have different values
     * with the scrollHeight and scrollTop of srollRef.current at this moment
     */
    const previousScrollBottom = pageScrollHeight - pageScrollTop;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousScrollBottom;
  }, [allMessages?.length]);

  const memoizedMessageList = useMemo(() => {
    if (allMessages.length > 0) {
      return (
        allMessages.map((message, index) => {
          const previousMessage = allMessages[index - 1];
          const nextMessage = allMessages[index - 1];

          const previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
          const currentCreatedAt = message?.createdAt;
          // https://stackoverflow.com/a/41855608
          const hasSeparator = !(previousMessageCreatedAt && (
            isSameDay(currentCreatedAt, previousMessageCreatedAt)
          ));

          const [chainTop, chainBottom] = isMessageGroupingEnabled
            ? compareMessagesForGrouping(previousMessage, message, nextMessage)
            : [false, false];
          return (
            <OpenChannelMessage
              key={message?.messageId || (message as UserMessage | FileMessage)?.reqId}
              message={message}
              chainTop={chainTop}
              chainBottom={chainBottom}
              hasSeparator={hasSeparator}
              renderMessage={props?.renderMessage}
            />
          )
        })
      );
    }
    return (
      props?.renderPlaceHolderEmptyList?.() || (
        <PlaceHolder
          className="sendbird-openchannel-conversation-scroll__container__place-holder"
          type={PlaceHolderTypes.NO_MESSAGES}
        />
      )
    );
  }, [allMessages]);

  return (
    <div className="sendbird-openchannel-conversation-scroll">
      <div className="sendbird-openchannel-conversation-scroll__container">
        <div className="sendbird-openchannel-conversation-scroll__container__padding" />
        <div
          className={[
            'sendbird-openchannel-conversation-scroll__container__item-container',
            (allMessages.length > 0) ? '' : 'no-messages',
          ].join(' ')}
          onScroll={handleOnScroll}
          ref={scrollRef}
        >
          {memoizedMessageList}
        </div>
      </div>
      {
        showScrollDownButton && (
          <div
            className="sendbird-openchannel-conversation-scroll__container__scroll-bottom-button"
            onClick={scrollToBottom}
            onKeyDown={scrollToBottom}
            tabIndex={0}
            role="button"
          >
            <Icon
              width="24px"
              height="24px"
              type={IconTypes.CHEVRON_DOWN}
              fillColor={IconColors.CONTENT}
            />
          </div>
        )
      }
    </div>
  );
}

export default React.forwardRef(OpenchannelMessageList);
