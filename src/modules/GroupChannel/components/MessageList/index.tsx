import './index.scss';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Member } from '@sendbird/chat/groupChannel';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';

import { CoreMessageType, isSendableMessage } from '../../../../utils';
import { EveryMessage, TypingIndicatorType } from '../../../../types';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Message from '../Message';
import { getMessagePartsInfo } from './getMessagePartsInfo';
import UnreadCount from '../UnreadCount';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import TypingIndicatorBubble from '../../../../ui/TypingIndicatorBubble';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { getComponentKeyFromMessage } from '../../context/utils';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
import { BaseMessage } from '@sendbird/chat/message';

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

  renderRemoveMessageModal?: GroupChannelUIBasicProps['renderRemoveMessageModal'];

  renderEditInput?: GroupChannelUIBasicProps['renderEditInput'];
  renderScrollToBottomOrUnread?: GroupChannelUIBasicProps['renderScrollToBottomOrUnread'];
}

const MessageListContainer = ({ scrollRef, renderList, messages, isScrollBottomReached }: { 
  scrollRef: React.MutableRefObject<HTMLDivElement>, 
  renderList: () => React.ReactElement,
  messages: BaseMessage[],
  isScrollBottomReached: boolean;
}) => {
  const prevMessagesLengthRef = useRef(messages.length);
  const lastClientHeight = useRef<number>();

  // handles scrolling the list to the bottom before browser paint
  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    lastClientHeight.current = scrollRef.current.clientHeight;
  }, []);

  // If message count has increased and you were scrolled to the top
  // scroll down 1px so the scrollbar isn't anchored to the top when the new items get rendered.
  // This fixes a flicker that happens when old messages get rendered in.
  useLayoutEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && scrollRef.current.scrollTop === 0) {
      scrollRef.current.style.overflowY = 'hidden';
      scrollRef.current.scrollTop = 1;
    } else if (messages.length > prevMessagesLengthRef.current && isScrollBottomReached) {
      // if the scrollbar was previously at the bottom, maintain the scroll at the bottom after new messages come in. 
      // The scroll pubsub system kicks in after the message comes in, which is especially obvious when the scroll list was previously at the bottom.
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  useLayoutEffect(() => {
    // The above useLayoutEffect is not sufficient because of scroll inertia and bounce.
    // To deal with inertia and bounce, the list is temporarily rendered a non-scrollable list.
    // This cancels the inertia and, as a result, bounce.
    const cb = () => {
      if (scrollRef.current.scrollTop === 0) {
        scrollRef.current.scrollTop = 1;
        scrollRef.current.style.overflowY = 'hidden';
      } else {
        scrollRef.current.style.overflowY = 'scroll';
      }
    };
    cb();
    scrollRef.current.addEventListener('scroll', cb)
    return () => scrollRef.current.removeEventListener('scroll', cb)
  }, [])

  // when the size of the scroll list changes because of the input text area, keep the scroll position the same
  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const onResize = () => {
      const diff = lastClientHeight.current - scrollRef.current.clientHeight;
      lastClientHeight.current = scrollRef.current.clientHeight;

      if (diff > 0) {
        scrollRef.current.scrollTop = scrollRef.current.scrollTop + diff;
      }
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(scrollRef.current);
    return () => resizeObserver.unobserve(scrollRef.current);
  }, [scrollRef.current])

  return (
    <div className="sendbird-conversation__messages-padding" ref={scrollRef}>
      {renderList()}
    </div>
  )
}

export const MessageList = ({
  className = '',
  renderMessage = (props) => <Message {...props} />,
  renderEditInput,
  renderRemoveMessageModal,
  renderMessageContent,
  renderSuggestedReplies,
  renderCustomSeparator,
  renderScrollToBottomOrUnread,
  renderPlaceholderLoader = () => <PlaceHolder type={PlaceHolderTypes.LOADING} />,
  renderPlaceholderEmpty = () => <PlaceHolder className="sendbird-conversation__no-messages" type={PlaceHolderTypes.NO_MESSAGES} />,
  renderFrozenNotification = () => <FrozenNotification className="sendbird-conversation__messages__notification" />,
}: GroupChannelMessageListProps) => {
  const {
    channelUrl,
    hasNext,
    loading,
    messages,
    newMessages,
    scrollToBottom,
    isScrollBottomReached,
    isMessageGroupingEnabled,
    scrollRef,
    scrollDistanceFromBottomRef,
    currentChannel,
    replyType,
    scrollPubSub,
  } = useGroupChannelContext();
  const shouldDisplayScrollToBottom = hasNext() || !isScrollBottomReached;
  const [delayedDisplayScrollToBottom, setDelayedDisplayScrollToBottom] = useState(shouldDisplayScrollToBottom);
  const store = useSendbirdStateContext();

  const [unreadSinceDate, setUnreadSinceDate] = useState<Date>();

  // To account for tween states while scrolling, delay the render of the scroll to bottom button
  useEffect(() => {
    let timeout;
    if (shouldDisplayScrollToBottom) {
      timeout = setTimeout(() => {
        setDelayedDisplayScrollToBottom(true)
      }, 250);
    }
    return () => {
      if (shouldDisplayScrollToBottom) {
        setDelayedDisplayScrollToBottom(false);
      }
      clearTimeout(timeout)
    }
  }, [shouldDisplayScrollToBottom])

  useEffect(() => {
    if (isScrollBottomReached) {
      setUnreadSinceDate(undefined);
    } else {
      setUnreadSinceDate(new Date());
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
  };

  if (loading) {
    return renderPlaceholderLoader();
  }

  if (messages.length === 0) {
    return renderPlaceholderEmpty();
  }

  return (
    <>
      <div className={`sendbird-conversation__messages ${className}`}>
        <div className="sendbird-conversation__scroll-container">
          <div className="sendbird-conversation__padding" />
            <MessageListContainer
              scrollRef={scrollRef}
              isScrollBottomReached={isScrollBottomReached}
              messages={messages}
              renderList={() => (
                <>
                  {messages.map((message, idx) => {
                    const { chainTop, chainBottom, hasSeparator } = getMessagePartsInfo({
                      allMessages: messages as CoreMessageType[],
                      replyType,
                      isMessageGroupingEnabled,
                      currentIndex: idx,
                      currentMessage: message as CoreMessageType,
                      currentChannel,
                      currentUserId: store.config.userId
                    });
                    const isOutgoingMessage = isSendableMessage(message) && message.sender.userId === store.config.userId;
                    return (
                      <MessageProvider message={message} key={getComponentKeyFromMessage(message)} isByMe={isOutgoingMessage}>
                        {renderMessage({
                          handleScroll: onMessageContentSizeChanged,
                          message: message as EveryMessage,
                          hasSeparator,
                          chainTop,
                          chainBottom,
                          renderMessageContent,
                          renderSuggestedReplies,
                          renderCustomSeparator,
                          renderRemoveMessageModal,
                          renderEditInput
                        })}
                      </MessageProvider>
                    );
                  })}
                  {!hasNext() &&
                    store?.config?.groupChannel?.enableTypingIndicator &&
                    store?.config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Bubble) && (
                      <TypingIndicatorBubbleWrapper channelUrl={channelUrl} handleScroll={onMessageContentSizeChanged} />
                  )}
                </>
              )}
            />
        </div>

        <>{renderer.frozenNotification()}</>
        {
          renderScrollToBottomOrUnread ? renderScrollToBottomOrUnread({
            onScrollToBottom: scrollToBottom,
            onScrollToUnread: scrollToBottom,
            unreadCount: newMessages.length,
            lastReadAt: unreadSinceDate,
            shouldDisplayScrollToBottom: delayedDisplayScrollToBottom,
            shouldDisplayUnreadNotifications: !!(!isScrollBottomReached && unreadSinceDate),
          }) : (
            <>
              <>{renderer.unreadMessagesNotification()}</>
              <>{renderer.scrollToBottomButton()}</>
            </>
          )
        }
      </div>
    </>
  );
};

const TypingIndicatorBubbleWrapper = (props: { handleScroll: () => void; channelUrl: string }) => {
  const { stores } = useSendbirdStateContext();
  const [typingMembers, setTypingMembers] = useState<Member[]>([]);

  useGroupChannelHandler(stores.sdkStore.sdk, {
    onTypingStatusUpdated(channel) {
      if (channel.url === props.channelUrl) {
        setTypingMembers(channel.getTypingUsers());
      }
    },
  });

  return <TypingIndicatorBubble typingMembers={typingMembers} handleScroll={props.handleScroll} />;
};

export default MessageList;
