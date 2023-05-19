import './message-list.scss';

import React, { useState } from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Message from '../Message';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { isAboutSame } from '../../context/utils';
import { getMessagePartsInfo } from './getMessagePartsInfo';
import UnreadCount from '../UnreadCount';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import { EveryMessage } from '../../../..';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { UserMessage } from '@sendbird/chat/message';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';

export interface MessageListProps {
  className?: string;
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderPlaceholderLoader?: () => React.ReactElement;
}

const MessageList: React.FC<MessageListProps> = ({
  className = '',
  renderMessage,
  renderPlaceholderEmpty,
  renderCustomSeparator,
  renderPlaceholderLoader,
}) => {
  const {
    allMessages,
    hasMorePrev,
    hasMoreNext,
    setInitialTimeStamp,
    setAnimatedMessageId,
    setHighLightedMessageId,
    isMessageGroupingEnabled,
    scrollRef,
    onScrollCallback,
    onScrollDownCallback,
    messagesDispatcher,
    messageActionTypes,
    currentGroupChannel,
    disableMarkAsRead,
    filterMessageList,
    replyType,
    loading,
    unreadSince,
  } = useChannelContext();
  const store = useSendbirdStateContext();
  const [scrollBottom, setScrollBottom] = useState(0);
  const allMessagesFiltered = (typeof filterMessageList === 'function')
    ? allMessages.filter((filterMessageList as (message: EveryMessage) => boolean))
    : allMessages;
  const markAsReadScheduler = store.config.markAsReadScheduler;

  const onScroll = () => {
    const element = scrollRef?.current;
    if (element == null) {
      return;
    }

    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;

    if (isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
      onScrollCallback((messages) => {
        if (messages) {
          try {
            //
          } catch (error) {
            //
          }
        }
      });
    }

    if (isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER) && hasMoreNext) {
      onScrollDownCallback(([messages]) => {
        if (messages) {
          try {
            // element.scrollTop = scrollHeight - clientHeight;
            // scrollRef.current.scrollTop = scrollHeight - clientHeight;
          } catch (error) {
            //
          }
        }
      });
    }

    // Save the lastest scroll bottom value
    setScrollBottom(element.scrollHeight - element.scrollTop - element.offsetHeight);

    if (!disableMarkAsRead && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)) {
      messagesDispatcher({
        type: messageActionTypes.MARK_AS_READ,
        payload: { channel: currentGroupChannel },
      });
      markAsReadScheduler?.push(currentGroupChannel);
    }
  };

  const onClickScrollBot = () => {
    setInitialTimeStamp?.(null);
    setAnimatedMessageId?.(null);
    setHighLightedMessageId?.(null);
    if (scrollRef?.current?.scrollTop > -1) {
      scrollRef.current.scrollTop = (scrollRef?.current?.scrollHeight ?? 0) - (scrollRef?.current?.offsetHeight ?? 0);
    }
  };

  const handleMessageHeightChange = () => {
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      if (scrollBottom < bottom && scrollBottom <= SCROLL_BUFFER) {
        current.scrollTop += bottom - scrollBottom;
      }
    }
  };

  const handleOnScroll = useHandleOnScrollCallback({
    hasMore: hasMorePrev,
    hasNext: hasMoreNext,
    onScroll,
    scrollRef,
  });

  if (loading) {
    return (typeof renderPlaceholderLoader === 'function')
      ? renderPlaceholderLoader()
      : <PlaceHolder type={PlaceHolderTypes.LOADING} />;
  }
  if (allMessagesFiltered.length < 1) {
    if (renderPlaceholderEmpty && typeof renderPlaceholderEmpty === 'function') {
      return renderPlaceholderEmpty();
    }
    return <PlaceHolder className="sendbird-conversation__no-messages" type={PlaceHolderTypes.NO_MESSAGES} />;
  }
  return (
    <div className={`sendbird-conversation__messages ${className}`}>
      <div className="sendbird-conversation__scroll-container">
        <div className="sendbird-conversation__padding" />
        <div
          className="sendbird-conversation__messages-padding"
          ref={scrollRef}
          onScroll={handleOnScroll}
        >
          {allMessagesFiltered.map((m, idx) => {
            const {
              chainTop,
              chainBottom,
              hasSeparator,
            } = getMessagePartsInfo({
              allMessages: allMessagesFiltered,
              replyType,
              isMessageGroupingEnabled,
              currentIndex: idx,
              currentMessage: m,
              currentChannel: currentGroupChannel,
            });
            const isByMe = (m as UserMessage)?.sender?.userId === store?.config?.userId;
            return (
              <MessageProvider message={m} key={m?.messageId} isByMe={isByMe}>
                <Message
                  handleScroll={handleMessageHeightChange}
                  renderMessage={renderMessage}
                  message={m}
                  hasSeparator={hasSeparator}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                  renderCustomSeparator={renderCustomSeparator}
                />
              </MessageProvider>
            );
          })}
          {/* show frozen notifications */}
          {/* show new message notifications */}
        </div>
      </div>
      {currentGroupChannel?.isFrozen && (
        <FrozenNotification className="sendbird-conversation__messages__notification" />
      )}
      <UnreadCount
        className="sendbird-conversation__messages__notification"
        count={currentGroupChannel?.unreadMessageCount}
        time={unreadSince}
        onClick={() => {
          if (scrollRef?.current?.scrollTop) {
            scrollRef.current.scrollTop = (scrollRef?.current?.scrollHeight ?? 0) - (scrollRef?.current?.offsetHeight ?? 0);
          }
          if (!disableMarkAsRead) {
            markAsReadScheduler?.push(currentGroupChannel);
            messagesDispatcher({
              type: messageActionTypes.MARK_AS_READ,
              payload: { channel: currentGroupChannel },
            });
          }
          setInitialTimeStamp(null);
          setAnimatedMessageId(null);
          setHighLightedMessageId(null);
        }}
      />
      {
        // This flag is an unmatched variable
        scrollBottom > 1 && (
          <div
            className="sendbird-conversation__scroll-bottom-button"
            onClick={onClickScrollBot}
            onKeyDown={onClickScrollBot}
            tabIndex={0}
            role="button"
          >
            <Icon
              width="24px"
              height="24px"
              type={IconTypes.CHEVRON_DOWN}
              fillColor={IconColors.PRIMARY}
            />
          </div>
        )
      }
    </div>
  );
};

export default MessageList;
