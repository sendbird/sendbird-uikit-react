import './message-list.scss';

import React from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Message from '../Message';
import { EveryMessage, RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { isAboutSame } from '../../context/utils';
import { getMessagePartsInfo } from './getMessagePartsInfo';
import UnreadCount from '../UnreadCount';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { UserMessage } from '@sendbird/chat/message';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';
import { useSetScrollToBottom } from './hooks/useSetScrollToBottom';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import * as utils from '../../context/utils';

const SCROLL_BOTTOM_PADDING = 50;

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
    localMessages,
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
    isScrolled,
    unreadSince,
  } = useChannelContext();

  const store = useSendbirdStateContext();
  const allMessagesFiltered = (typeof filterMessageList === 'function')
    ? allMessages.filter((filterMessageList as (message: EveryMessage) => boolean))
    : allMessages;
  const markAsReadScheduler = store.config.markAsReadScheduler;

  useScrollBehavior();

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
      onScrollCallback();
    }

    if (isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER) && hasMoreNext) {
      onScrollDownCallback(([messages]) => {
        if (messages) {
          try {
            setTimeout(() => utils.scrollIntoLast(0, scrollRef),
              /**
               * Rendering MFM takes long time so we need this.
               * But later we should find better solution.
               */
              1000,
            );
            // element.scrollTop = scrollHeight - clientHeight;
            // scrollRef.current.scrollTop = scrollHeight - clientHeight;
          } catch (error) {
            //
          }
        }
      });
    }

    if (!disableMarkAsRead
      && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)
      && !!currentGroupChannel
    ) {
      messagesDispatcher({
        type: messageActionTypes.MARK_AS_READ,
        payload: { channel: currentGroupChannel },
      });
      markAsReadScheduler.push(currentGroupChannel);
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

  /**
   * 1. Move the messsage list scroll
   *    when each message's height is changed by `reactions` OR `showEdit`
   * 2. Keep the scrollBottom value after fetching new message list
   */
  const moveScroll = (isBottomMessageAffected = false): void => {
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      if (scrollBottom < bottom
        && (!isBottomMessageAffected || scrollBottom < SCROLL_BUFFER)) {
        // Move the scroll as much as the height of the message has changed
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

  const { scrollToBottomHandler, scrollBottom } = useSetScrollToBottom({ loading });

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
    <>
      {
        !isScrolled && <PlaceHolder type={PlaceHolderTypes.LOADING} />
      }
      <div className={`sendbird-conversation__messages ${className}`}>
        <div className="sendbird-conversation__scroll-container">
          <div className="sendbird-conversation__padding" />
          <div
            className="sendbird-conversation__messages-padding"
            ref={scrollRef}
            onScroll={(e) => {
              handleOnScroll();
              scrollToBottomHandler(e);
            }}
          >
            {
              allMessagesFiltered.map((m, idx) => {
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
                      handleScroll={moveScroll}
                      renderMessage={renderMessage}
                      message={m as EveryMessage}
                      hasSeparator={hasSeparator}
                      chainTop={chainTop}
                      chainBottom={chainBottom}
                      renderCustomSeparator={renderCustomSeparator}
                    />
                  </MessageProvider>
                );
              })
            }
            {
              localMessages.map((m, idx) => {
                const {
                  chainTop,
                  chainBottom,
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
                      handleScroll={moveScroll}
                      renderMessage={renderMessage}
                      message={m as EveryMessage}
                      chainTop={chainTop}
                      chainBottom={chainBottom}
                      renderCustomSeparator={renderCustomSeparator}
                    />
                  </MessageProvider>
                );
              })
            }
            {/* show frozen notifications, */}
            {/* show new message notifications, */}
          </div>
        </div>
        {currentGroupChannel?.isFrozen && (
          <FrozenNotification className="sendbird-conversation__messages__notification" />
        )}
        {unreadSince && (
          <UnreadCount
            className="sendbird-conversation__messages__notification"
            count={currentGroupChannel?.unreadMessageCount}
            time={unreadSince}
            onClick={() => {
              if (scrollRef?.current?.scrollTop) {
                scrollRef.current.scrollTop = (scrollRef?.current?.scrollHeight ?? 0) - (scrollRef?.current?.offsetHeight ?? 0);
              }
              if (!disableMarkAsRead && !!currentGroupChannel) {
                markAsReadScheduler.push(currentGroupChannel);
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
        )}
        {
          // This flag is an unmatched variable
          scrollBottom > SCROLL_BOTTOM_PADDING && (
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
    </>
  );
};

export default MessageList;
