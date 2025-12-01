import './index.scss';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';

import { CoreMessageType, isSendableMessage, getHTMLTextDirection, SendableMessageType, isAdminMessage } from '../../../../utils';
import { EveryMessage, RenderMessageParamsType, TypingIndicatorType } from '../../../../types';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Message from '../Message';
import UnreadCount from '../UnreadCount';
import UnreadCountFloatingButton from '../UnreadCountFloatingButton';
import NewMessageCountFloatingButton from '../NewMessageCountFloatingButton';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import TypingIndicatorBubble from '../../../../ui/TypingIndicatorBubble';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
import { deleteNullish } from '../../../../utils/utils';
import { getMessagePartsInfo } from './getMessagePartsInfo';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { getComponentKeyFromMessage, isContextMenuClosed } from '../../context/utils';
import { InfiniteList } from './InfiniteList';
import { useGroupChannel } from '../../context/hooks/useGroupChannel';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../lib/LocalizationContext';

export interface GroupChannelMessageListProps {
  className?: string;
  /**
   * A function that customizes the rendering of each message component in the message list component.
   */
  renderMessage?: GroupChannelUIBasicProps['renderMessage'];
  /**
   * A function that customizes the rendering of the content portion of each message component.
   */
  renderMessageContent?: GroupChannelUIBasicProps['renderMessageContent'];
  /**
   * A function that customizes the rendering of a separator component between messages.
   */
  renderCustomSeparator?: GroupChannelUIBasicProps['renderCustomSeparator'];
  /**
   * A function that customizes the rendering of a loading placeholder component.
   */
  renderPlaceholderLoader?: GroupChannelUIBasicProps['renderPlaceholderLoader'];
  /**
   * A function that customizes the rendering of an empty placeholder component when there are no messages in the channel.
   */
  renderPlaceholderEmpty?: GroupChannelUIBasicProps['renderPlaceholderEmpty'];
  /**
   * A function that customizes the rendering of a frozen notification component when the channel is frozen.
   */
  renderFrozenNotification?: GroupChannelUIBasicProps['renderFrozenNotification'];
  /**
   * A function that customizes the rendering of a suggested replies component.
   */
  renderSuggestedReplies?: GroupChannelUIBasicProps['renderSuggestedReplies'];
}

export const MessageList = (props: GroupChannelMessageListProps) => {
  const { className = '' } = props;
  const {
    renderMessage = (props: RenderMessageParamsType) => <Message {...props} />,
    renderMessageContent,
    renderSuggestedReplies,
    renderCustomSeparator,
    renderPlaceholderLoader = () => <PlaceHolder type={PlaceHolderTypes.LOADING} />,
    renderPlaceholderEmpty = () => <PlaceHolder className="sendbird-conversation__no-messages" type={PlaceHolderTypes.NO_MESSAGES} />,
    renderFrozenNotification = () => <FrozenNotification className="sendbird-conversation__messages__notification" />,
  } = deleteNullish(props);

  const {
    state: {
      channelUrl,
      hasNext,
      loading,
      messages,
      newMessages,
      isScrollBottomReached,
      isMessageGroupingEnabled,
      currentChannel,
      replyType,
      scrollPubSub,
      loadNext,
      loadPrevious,
      resetNewMessages,
      scrollRef,
      scrollPositionRef,
      scrollDistanceFromBottomRef,
      markAsUnreadSourceRef,
      readState,
      isFocusOnLastMessage,
    },
    actions: {
      scrollToBottom,
      setIsScrollBottomReached,
      markAsReadAll,
      markAsUnread,
      scrollToMessage,
    },
  } = useGroupChannel();

  const { state, state: { config: { groupChannel: { enableMarkAsUnread } } } } = useSendbird();
  const { stringSet } = useLocalization();

  const [unreadSinceDate, setUnreadSinceDate] = useState<Date>();
  const [showUnreadCount, setShowUnreadCount] = useState(false);

  const isInitializedRef = useRef(false);
  const separatorMessageRef = useRef<CoreMessageType | undefined>(undefined);
  const isUnreadMessageExistInChannel = useRef<boolean>(false);

  // Find the first unread message
  const firstUnreadMessage = useMemo(() => {
    if (!enableMarkAsUnread || !isInitializedRef.current || messages.length === 0 || readState === 'read' || !currentChannel?.myLastRead) {
      return undefined;
    }

    if (readState === 'unread') {
      separatorMessageRef.current = undefined;
      isUnreadMessageExistInChannel.current = true;
    }

    const myLastRead = currentChannel.myLastRead;
    const willFindMessageCreatedAt = myLastRead + 1;

    // 조건 1: 정확히 myLastRead + 1인 메시지 찾기
    const exactMatchMessage = messages.find((message) => message.createdAt === willFindMessageCreatedAt);

    if (exactMatchMessage) {
      return exactMatchMessage as CoreMessageType;
    }

    // 조건 2: myLastRead + 1보다 큰 첫 번째 메시지 찾기 (Admin 메시지 제외)
    return messages.find((message) => message.createdAt > willFindMessageCreatedAt && !isAdminMessage(message as any)) as CoreMessageType | undefined;
  }, [messages, currentChannel?.myLastRead, readState]);

  useEffect(() => {
    if (currentChannel?.url && loading) {
      // done get channel and messages
      setShowUnreadCount(currentChannel?.unreadMessageCount > 0);
      isInitializedRef.current = true;
      isUnreadMessageExistInChannel.current = currentChannel?.lastMessage?.createdAt > currentChannel?.myLastRead;
    }
  }, [currentChannel?.url, loading]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (!enableMarkAsUnread) {
      // backward compatibility
      if (isScrollBottomReached) {
        setUnreadSinceDate(undefined);
      } else {
        setUnreadSinceDate(new Date());
      }
    } else if (isScrollBottomReached) {
      if (markAsUnreadSourceRef?.current !== 'manual') {
        if (currentChannel?.unreadMessageCount > 0) {
          if (separatorMessageRef.current || !isUnreadMessageExistInChannel.current) {
            // called markAsReadAll as after the first unread message is displayed
            markAsReadAll(currentChannel);
          }
        }
      }
    }
  }, [isScrollBottomReached]);

  const checkDisplayedNewMessageSeparator = useCallback((isNewMessageSeparatorVisible: boolean) => {
    if (!isInitializedRef.current || !firstUnreadMessage) return;

    if (isNewMessageSeparatorVisible && currentChannel?.unreadMessageCount > 0) {
      setShowUnreadCount(false);
    } else if (!isNewMessageSeparatorVisible && currentChannel?.unreadMessageCount > 0) {
      setShowUnreadCount(true);
    }

    if (isNewMessageSeparatorVisible && markAsUnreadSourceRef?.current !== 'manual') {
      if (newMessages?.length > 0) {
        markAsUnread(newMessages[0] as SendableMessageType, 'internal');
        separatorMessageRef.current = undefined;
      } else if (firstUnreadMessage) {
        if (!separatorMessageRef.current || separatorMessageRef.current.messageId !== firstUnreadMessage.messageId) {
          separatorMessageRef.current = firstUnreadMessage;
        }
        markAsReadAll(currentChannel);
      }
    }
  }, [firstUnreadMessage, markAsUnread, markAsReadAll, currentChannel?.unreadMessageCount]);

  /**
   * 1. Move the message list scroll
   *    when each message's height is changed by `reactions` OR `showEdit`
   * 2. Keep the scrollBottom value after fetching new message list
   */
  const onMessageContentSizeChanged = (isBottomMessageAffected = false): void => {
    const elem = scrollRef.current;
    if (elem) {
      const latestDistance = scrollDistanceFromBottomRef.current;
      const currentDistance = elem.scrollHeight - elem.scrollTop - elem.offsetHeight;
      if (latestDistance < currentDistance && (!isBottomMessageAffected || latestDistance < SCROLL_BUFFER)) {
        const diff = currentDistance - latestDistance;
        // Move the scroll as much as the height of the message has changed
        scrollPubSub.publish('scroll', { top: elem.scrollTop + diff, lazy: false, animated: false });
      }
    }
  };

  /**
   * Force scroll to message
   * when new message is received
   * and the message content height is over the current scroll height
   */
  const forceScrollToMessage = (ref: React.MutableRefObject<any>, message: CoreMessageType) => {
    if (!isFocusOnLastMessage) return;
    const messageComponent = ref.current;
    const messageComponentHeight = messageComponent?.clientHeight;
    const currentScrollHeight = scrollRef.current?.offsetHeight;

    if (messageComponentHeight > currentScrollHeight) {
      scrollToMessage(message.createdAt, message.messageId);
    } else if (isScrollBottomReached) {
      scrollToBottom();
    }
  };

  const renderer = {
    frozenNotification() {
      if (!currentChannel || !currentChannel.isFrozen) return null;
      return renderFrozenNotification();
    },
    unreadMessagesNotification() {
      if (enableMarkAsUnread) {
        if (!showUnreadCount || currentChannel?.unreadMessageCount === 0) return null;
        return (
          <UnreadCountFloatingButton
            className="sendbird-unread-messages-count"
            count={currentChannel?.unreadMessageCount ?? 0}
            isFrozenChannel={currentChannel?.isFrozen || false}
            onClick={() => {
              if (newMessages.length > 0) {
                resetNewMessages();
              }
              isUnreadMessageExistInChannel.current = false;
              markAsReadAll(currentChannel);
            }}
          />
        );
      }
      if (isScrollBottomReached || !unreadSinceDate) return null;
      return (
        <UnreadCount
          className="sendbird-conversation__messages__notification"
          count={newMessages.length}
          lastReadAt={unreadSinceDate}
          onClick={() => scrollToBottom()}
        />
      );
    },
    scrollToBottomButton() {
      if (!hasNext() && isScrollBottomReached) return null;

      return (
        <div
          className="sendbird-conversation__scroll-bottom-button"
          onClick={() => scrollToBottom()}
          onKeyDown={() => scrollToBottom()}
          tabIndex={0}
          role="button"
        >
          <Icon width="24px" height="24px" type={IconTypes.CHEVRON_DOWN} fillColor={IconColors.PRIMARY} />
        </div>
      );
    },
    newMessageCount() {
      // 스크롤이 bottom에 있을 때는 new message count를 표시하지 않음
      if (isScrollBottomReached) return null;
      return (
        <NewMessageCountFloatingButton
          className="sendbird-new-messages-count"
          count={newMessages.length}
          onClick={() => scrollToBottom()}
        />
      );
    },
  };

  if (loading) {
    return renderPlaceholderLoader();
  }

  if (messages.length === 0) {
    return renderPlaceholderEmpty();
  }

  return (
    <>
      <div
        className={`sendbird-conversation__messages ${className}`}
        dir={getHTMLTextDirection(
          state.config.htmlTextDirection,
          state.config.forceLeftToRightMessageLayout,
        )}
      >
        <InfiniteList
          ref={scrollRef}
          initDeps={[channelUrl]}
          scrollPositionRef={scrollPositionRef}
          scrollDistanceFromBottomRef={scrollDistanceFromBottomRef}
          onLoadNext={loadNext}
          onLoadPrevious={loadPrevious}
          onScrollPosition={(it) => {
            const isScrollBottomReached = it === 'bottom';
            if (isInitializedRef.current && isScrollBottomReached) {
              if (newMessages.length > 0) {
                resetNewMessages();
              } else if (!isUnreadMessageExistInChannel.current && currentChannel?.unreadMessageCount === 0) {
                markAsReadAll(currentChannel);
              }
            }
            setIsScrollBottomReached(isScrollBottomReached);
          }}
          messages={messages}
          renderMessage={({ message, index }) => {
            const finalFirstUnreadMessageId = separatorMessageRef.current?.messageId || firstUnreadMessage?.messageId;

            const { chainTop, chainBottom, hasSeparator, hasNewMessageSeparator } = getMessagePartsInfo({
              allMessages: messages as CoreMessageType[],
              stringSet,
              replyType: replyType ?? 'NONE',
              isMessageGroupingEnabled: isMessageGroupingEnabled ?? false,
              currentIndex: index,
              currentMessage: message as CoreMessageType,
              currentChannel: currentChannel!,
              firstUnreadMessageId: finalFirstUnreadMessageId,
              isUnreadMessageExistInChannel,
            });

            const isOutgoingMessage = isSendableMessage(message) && message.sender.userId === state.config.userId;

            return (
              <MessageProvider message={message} key={getComponentKeyFromMessage(message)} isByMe={isOutgoingMessage}>
                {renderMessage({
                  handleScroll: onMessageContentSizeChanged,
                  message: message as EveryMessage,
                  hasSeparator,
                  hasNewMessageSeparator,
                  chainTop,
                  chainBottom,
                  renderMessageContent,
                  renderSuggestedReplies,
                  renderCustomSeparator,
                  onNewMessageSeparatorVisibilityChange: checkDisplayedNewMessageSeparator,
                  forceScrollToMessage,
                })}
              </MessageProvider>
            );
          }}
          typingIndicator={
            !hasNext()
            && state?.config?.groupChannel?.enableTypingIndicator
            && state?.config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Bubble) && (
              <TypingIndicatorBubbleWrapper channelUrl={channelUrl} handleScroll={onMessageContentSizeChanged} />
            )
          }
        />
        <>{renderer.frozenNotification()}</>
        <>{renderer.unreadMessagesNotification()}</>
        <>{renderer.scrollToBottomButton()}</>
        <>{renderer.newMessageCount()}</>
      </div>
    </>
  );
};

const TypingIndicatorBubbleWrapper = (props: { handleScroll: () => void; channelUrl: string }) => {
  const { state: { stores } } = useSendbird();
  const {
    state: {
      isScrollBottomReached,
      scrollPubSub,
    },
  } = useGroupChannel();
  const [typingMembers, setTypingMembers] = useState<Member[]>([]);

  useGroupChannelHandler(stores.sdkStore.sdk, {
    onTypingStatusUpdated(channel) {
      if (channel.url === props.channelUrl) {
        setTypingMembers(channel.getTypingUsers());
      }

      if (isScrollBottomReached && isContextMenuClosed()) {
        setTimeout(() => {
          scrollPubSub.publish('scrollToBottom', {});
        }, 10);
      }
    },
  });

  return <TypingIndicatorBubble typingMembers={typingMembers} handleScroll={props.handleScroll} />;
};

export default MessageList;
