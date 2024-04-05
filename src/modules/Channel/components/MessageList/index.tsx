/* We operate the CSS files for Channel&GroupChannel modules in the GroupChannel */
import '../../../GroupChannel/components/MessageList/index.scss';

import React, { useState } from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import { useChannelContext } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Message from '../Message';
import { EveryMessage, TypingIndicatorType } from '../../../../types';
import { isAboutSame } from '../../context/utils';
import UnreadCount from '../UnreadCount';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';
import { useSetScrollToBottom } from './hooks/useSetScrollToBottom';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import TypingIndicatorBubble from '../../../../ui/TypingIndicatorBubble';
import { useOnScrollPositionChangeDetector } from '../../../../hooks/useOnScrollReachedEndDetector';

import { getMessagePartsInfo } from '../../../GroupChannel/components/MessageList/getMessagePartsInfo';
import { GroupChannelMessageListProps } from '../../../GroupChannel/components/MessageList';
import { GroupChannelUIBasicProps } from '../../../GroupChannel/components/GroupChannelUI/GroupChannelUIView';
import { deleteNullish } from '../../../../utils/utils';

const SCROLL_BOTTOM_PADDING = 50;

export interface MessageListProps extends GroupChannelMessageListProps {
  /**
   * Customizes all child components of the message component.
   * */
  renderMessage?: GroupChannelUIBasicProps['renderMessage'];

  renderEditInput?: GroupChannelUIBasicProps['renderEditInput'];

  renderScrollToBottomOrUnread?: GroupChannelUIBasicProps['renderScrollToBottomOrUnread'];
}
export const MessageList = (props: MessageListProps) => {
  const { className = '' } = props;
  const {
    renderMessage,
    renderMessageContent,
    renderSuggestedReplies,
    renderCustomSeparator,
    renderRemoveMessageModal,
    renderScrollToBottomOrUnread,
    renderEditInput,
    renderPlaceholderLoader = () => <PlaceHolder type={PlaceHolderTypes.LOADING} />,
    renderPlaceholderEmpty = () => <PlaceHolder className="sendbird-conversation__no-messages" type={PlaceHolderTypes.NO_MESSAGES} />,
    renderFrozenNotification = () => <FrozenNotification className="sendbird-conversation__messages__notification" />,
  } = deleteNullish(props);

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
    unreadSinceDate,
    typingMembers,
  } = useChannelContext();

  const store = useSendbirdStateContext();
  const allMessagesFiltered =
    typeof filterMessageList === 'function' ? allMessages.filter(filterMessageList as (message: EveryMessage) => boolean) : allMessages;
  const markAsReadScheduler = store.config.markAsReadScheduler;

  const [isScrollBottom, setIsScrollBottom] = useState(false);

  useScrollBehavior();

  /**
   * @param {function} callback callback from useHandleOnScrollCallback, it adjusts scroll position
   * */
  const onScroll = (callback: (...params: unknown[]) => void) => {
    const element = scrollRef?.current;
    if (element == null) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = element;

    if (hasMorePrev && isAboutSame(scrollTop, 0, SCROLL_BUFFER)) {
      onScrollCallback(callback);
    }

    if (hasMoreNext && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)) {
      onScrollDownCallback(callback);
    }

    if (!disableMarkAsRead && isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER) && !!currentGroupChannel) {
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
      if (scrollBottom < bottom && (!isBottomMessageAffected || scrollBottom < SCROLL_BUFFER)) {
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

  const onScrollReachedEndDetector = useOnScrollPositionChangeDetector({
    onReachedBottom: () => {
      /**
       * Note that this event is already being called in onScroll() above. However, it is only being called when
       * hasMoreNext is true but it needs to be called when hasNext is false when reached bottom as well.
       */
      if (!hasMoreNext && !disableMarkAsRead && !!currentGroupChannel) {
        messagesDispatcher({
          type: messageActionTypes.MARK_AS_READ,
          payload: { channel: currentGroupChannel },
        });
        markAsReadScheduler.push(currentGroupChannel);
      }
      setIsScrollBottom(true);
    },
    onReachedTop: () => {
      setIsScrollBottom(false);
    },
    onInBetween: () => {
      setIsScrollBottom(false);
    },
  });

  const { scrollToBottomHandler, scrollBottom } = useSetScrollToBottom({ loading });

  if (loading) {
    return renderPlaceholderLoader();
  }

  if (allMessagesFiltered.length < 1) {
    return renderPlaceholderEmpty();
  }
  const handleUnreadCountClick = () => {
    if (scrollRef?.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
  };

  const isUnreadNotificationButtonDisplayed = !!((!isScrollBottom || hasMoreNext) && (unreadSince || unreadSinceDate));
  const isScrollToBottomButtonDisplayed = scrollBottom > SCROLL_BOTTOM_PADDING;
  return (
    <>
      {!isScrolled && <PlaceHolder type={PlaceHolderTypes.LOADING} />}
      <div className={`sendbird-conversation__messages ${className}`}>
        <div className="sendbird-conversation__scroll-container">
          <div className="sendbird-conversation__padding" />
          <div
            className="sendbird-conversation__messages-padding"
            ref={scrollRef}
            onScroll={(e) => {
              handleOnScroll();
              scrollToBottomHandler(e);
              onScrollReachedEndDetector(e);
            }}
          >
            {allMessagesFiltered.map((m, idx) => {
              const { chainTop, chainBottom, hasSeparator } = getMessagePartsInfo({
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
                    message={m as EveryMessage}
                    hasSeparator={hasSeparator}
                    chainTop={chainTop}
                    chainBottom={chainBottom}
                    renderMessageContent={renderMessageContent}
                    renderSuggestedReplies={renderSuggestedReplies}
                    renderCustomSeparator={renderCustomSeparator}
                    renderRemoveMessageModal={renderRemoveMessageModal}
                    renderEditInput={renderEditInput}
                    // backward compatibility
                    renderMessage={renderMessage}
                  />
                </MessageProvider>
              );
            })}
            {localMessages.map((m, idx) => {
              const { chainTop, chainBottom } = getMessagePartsInfo({
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
                    message={m as EveryMessage}
                    chainTop={chainTop}
                    chainBottom={chainBottom}
                    renderMessageContent={renderMessageContent}
                    renderSuggestedReplies={renderSuggestedReplies}
                    renderCustomSeparator={renderCustomSeparator}
                    renderEditInput={renderEditInput}
                    // backward compatibility
                    renderMessage={renderMessage}
                  />
                </MessageProvider>
              );
            })}
            {!hasMoreNext &&
              store?.config?.groupChannel?.enableTypingIndicator &&
              store?.config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Bubble) && (
                <TypingIndicatorBubble typingMembers={typingMembers} handleScroll={moveScroll} />
              )}
            {/* show frozen notifications, */}
            {/* show new message notifications, */}
          </div>
        </div>
        {currentGroupChannel?.isFrozen && renderFrozenNotification()}
        {
          /**
           * Show unread count IFF scroll is not bottom or is bottom but hasNext is true.
           */
          !renderScrollToBottomOrUnread && (!isScrollBottom || hasMoreNext) && (unreadSince || unreadSinceDate) && (
            <UnreadCount
              className="sendbird-conversation__messages__notification"
              count={currentGroupChannel?.unreadMessageCount}
              time={unreadSince}
              lastReadAt={unreadSinceDate}
              onClick={handleUnreadCountClick}
            />
          )
        }
        {
          // This flag is an unmatched variable
          !renderScrollToBottomOrUnread && isScrollToBottomButtonDisplayed && (
            <div
              className="sendbird-conversation__scroll-bottom-button"
              onClick={onClickScrollBot}
              onKeyDown={onClickScrollBot}
              tabIndex={0}
              role="button"
            >
              <Icon width="24px" height="24px" type={IconTypes.CHEVRON_DOWN} fillColor={IconColors.PRIMARY} />
            </div>
          )
        }
        {renderScrollToBottomOrUnread?.({
          onScrollToBottom: onClickScrollBot,
          onScrollToUnread: handleUnreadCountClick,
          unreadCount: currentGroupChannel?.unreadMessageCount ?? 0,
          lastReadAt: unreadSinceDate,
          shouldDisplayScrollToBottom: isScrollToBottomButtonDisplayed,
          shouldDisplayUnreadNotifications: isUnreadNotificationButtonDisplayed,
        })}
      </div>
    </>
  );
};

export default MessageList;
