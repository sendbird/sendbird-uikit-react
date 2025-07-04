import './index.scss';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';

import { CoreMessageType, isSendableMessage, getHTMLTextDirection, SendableMessageType } from '../../../../utils';
import { EveryMessage, RenderMessageParamsType, TypingIndicatorType } from '../../../../types';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Message from '../Message';
import UnreadCount from '../UnreadCount';
import NewMessageCount from '../NewMessageCount';
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
      hasPrevious,
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
    },
    actions: {
      scrollToBottom,
      setIsScrollBottomReached,
      markAsReadAll,
      markAsUnread,
      setReadStateChanged,
    },
  } = useGroupChannel();

  const { state } = useSendbird();
  const { stringSet } = useLocalization();

  const [unreadSinceDate, setUnreadSinceDate] = useState<Date>();
  const [isChangedChannel, setIsChangedChannel] = useState(false);
  const [showUnreadCount, setShowUnreadCount] = useState(true);

  const firstUnreadMessageIdRef = useRef<number | string>();
  const hasInitializedRef = useRef(false);

  // current channel url ref
  const currentChannelUrlRef = useRef<string>();
  // current messages ref
  const currentMessagesRef = useRef<CoreMessageType[]>([]);

  /**
   * Find the first unread message in the message list
   */
  const findFirstUnreadMessage = (
    message: CoreMessageType,
    index: number,
    allMessages: CoreMessageType[],
    currentChannel: GroupChannel,
    hasPrevious: boolean,
  ): boolean => {
    const currentCreatedAt = message.createdAt;

    // condition 1: message.createdAt === (channel.myLastRead + 1)
    if (currentCreatedAt === (currentChannel.myLastRead + 1)) {
      return true;
    }

    // condition 2: there is no previous message that satisfies the condition, and the current message is the first message that satisfies the condition
    if (!hasPrevious && currentCreatedAt > (currentChannel.myLastRead + 1)) {
      const hasPreviousMatchingMessage = allMessages
        .slice(0, index)
        .some(msg => msg.createdAt === (currentChannel.myLastRead + 1));
      return !hasPreviousMatchingMessage;
    }
    return false;
  };

  const getFirstUnreadMessage = (): number | string => {
    if (state.config.groupChannel.enableMarkAsUnread) {
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i] as CoreMessageType;
        const isFind = findFirstUnreadMessage(message, i, messages as CoreMessageType[], currentChannel, hasPrevious());
        if (isFind) {
          return message.messageId;
        }
      }
    }
    return undefined;
  };

  // check changed channel
  useEffect(() => {
    if (currentChannel?.url !== currentChannelUrlRef.current) {
      currentChannelUrlRef.current = currentChannel?.url;

      // initialize
      firstUnreadMessageIdRef.current = undefined;
      setShowUnreadCount(true);
      hasInitializedRef.current = false;
      if (markAsUnreadSourceRef?.current !== undefined) {
        markAsUnreadSourceRef.current = undefined;
      }
      setIsChangedChannel(true);
    } else {
      setIsChangedChannel(false);
    }
  }, [currentChannel?.url]);

  // when enableMarkAsUnread is true, check changed messages
  useEffect(() => {
    if (state.config.groupChannel.enableMarkAsUnread && isChangedChannel) {
      if (!hasInitializedRef.current) {
        if (currentMessagesRef.current !== messages) {
          currentMessagesRef.current = messages as CoreMessageType[];
          const firstUnreadMessageId = getFirstUnreadMessage();
          if (firstUnreadMessageId) {
            firstUnreadMessageIdRef.current = firstUnreadMessageId;
          }
          hasInitializedRef.current = true;
        }
      }
    }
  }, [messages]);

  useMemo(() => {
    if (state.config.groupChannel.enableMarkAsUnread && hasInitializedRef.current) {
      const firstUnreadMessageId = getFirstUnreadMessage();

      if (firstUnreadMessageId && firstUnreadMessageIdRef.current !== firstUnreadMessageId) {
        firstUnreadMessageIdRef.current = firstUnreadMessageId;
      }
    }
  }, [messages.length]);

  useEffect(() => {
    if (state.config.groupChannel.enableMarkAsUnread && hasInitializedRef.current) {
      if (readState === 'unread') {
        // when readState === 'unread' find first unread message
        const firstUnreadMessageId = getFirstUnreadMessage();
        if (firstUnreadMessageId !== firstUnreadMessageIdRef.current) {
          firstUnreadMessageIdRef.current = firstUnreadMessageId;
        }
      }
      setReadStateChanged(null);
    }
  }, [readState]);

  useEffect(() => {
    if (!state.config.groupChannel.enableMarkAsUnread) {
      if (isScrollBottomReached) {
        setUnreadSinceDate(undefined);
      } else {
        setUnreadSinceDate(new Date());
      }
    }
  }, [isScrollBottomReached]);

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

  const renderer = {
    frozenNotification() {
      if (!currentChannel || !currentChannel.isFrozen) return null;
      return renderFrozenNotification();
    },
    unreadMessagesNotification() {
      if (markAsUnreadSourceRef?.current === 'manual' || !showUnreadCount) return null;
      return (
        <UnreadCount
          className="sendbird-unread-messages-count"
          count={currentChannel?.unreadMessageCount ?? 0}
          lastReadAt={unreadSinceDate}
          isFrozenChannel={currentChannel?.isFrozen || false}
          onClick={() => {
            markAsReadAll(currentChannel);
          }}
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
      if (isScrollBottomReached) return null;
      return (
        <NewMessageCount
          className="sendbird-new-messages-count"
          count={newMessages.length}
          onClick={() => scrollToBottom()}
        />
      );
    },
  };

  const checkDisplayedNewMessageSeparator = (isNewMessageSeparatorVisible: boolean) => {
    if (isNewMessageSeparatorVisible) {
      setShowUnreadCount(false);
      if (newMessages.length > 0) {
        markAsUnread(newMessages[0] as SendableMessageType, 'internal');
        firstUnreadMessageIdRef.current = newMessages[0].messageId;
      } else if (markAsUnreadSourceRef?.current !== 'manual') {
        markAsReadAll(currentChannel);
      }
    }
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
            if (hasInitializedRef.current && isScrollBottomReached && newMessages.length > 0) {
              resetNewMessages();
            }
            setIsScrollBottomReached(isScrollBottomReached);
          }}
          messages={messages}
          renderMessage={({ message, index }) => {
            const { chainTop, chainBottom, hasSeparator, hasNewMessageSeparator } = getMessagePartsInfo({
              allMessages: messages as CoreMessageType[],
              stringSet,
              replyType: replyType ?? 'NONE',
              isMessageGroupingEnabled: isMessageGroupingEnabled ?? false,
              currentIndex: index,
              currentMessage: message as CoreMessageType,
              currentChannel: currentChannel!,
              hasPrevious: hasPrevious(),
              firstUnreadMessageId: firstUnreadMessageIdRef.current,
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
