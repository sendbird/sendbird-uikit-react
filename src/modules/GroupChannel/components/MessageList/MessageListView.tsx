import './index.scss';
import React, { useEffect, useState } from 'react';
import type { BaseMessage } from '@sendbird/chat/message';
import type { GroupChannel, Member } from '@sendbird/chat/groupChannel';
import { useGroupChannelHandler } from '@sendbird/uikit-tools';

import type { CoreMessageType } from '../../../../utils';
import type { EveryMessage, RenderCustomSeparatorProps, RenderMessageProps, ReplyType } from '../../../../types';
import { TypingIndicatorType } from '../../../../types';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Message from '../Message';
import { getMessagePartsInfo } from './getMessagePartsInfo';
import UnreadCount from '../UnreadCount';
import FrozenNotification from '../FrozenNotification';
import { SCROLL_BUFFER } from '../../../../utils/consts';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import TypingIndicatorBubble, { type TypingIndicatorBubbleProps } from '../../../../ui/TypingIndicatorBubble';
import { getComponentKeyFromMessage } from '../../context/utils';

export interface MessageListViewBasicProps {
  className?: string;
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderPlaceholderLoader?: () => React.ReactElement;
  renderFrozenNotification?: () => React.ReactElement;
}
interface MessageListViewChannelContextProps {
  hasNext: () => boolean;
  loading: boolean;
  messages: BaseMessage[];
  scrollToBottom: () => void;
  isScrollBottomReached?: boolean;
  isMessageGroupingEnabled?: boolean;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  scrollDistanceFromBottomRef: React.MutableRefObject<number>;
  currentChannel: GroupChannel;
  replyType?: ReplyType;
}
export interface MessageListViewProps extends MessageListViewBasicProps, MessageListViewChannelContextProps {
  unreadMessageCount: number;
}

export const MessageListView = ({
  className = '',
  hasNext,
  loading,
  messages,
  scrollToBottom,
  isScrollBottomReached,
  isMessageGroupingEnabled,
  scrollRef,
  scrollDistanceFromBottomRef,
  currentChannel,
  replyType,
  renderMessage,
  renderPlaceholderEmpty,
  renderCustomSeparator,
  renderPlaceholderLoader,
  renderFrozenNotification,
  unreadMessageCount,
}: MessageListViewProps) => {
  const store = useSendbirdStateContext();

  const [unreadSinceDate, setUnreadSinceDate] = useState<Date>();

  useScrollBehavior();
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
        // Move the scroll as much as the height of the message has changed
        elem.scrollTop += currentDistance - latestDistance;
      }
    }
  };

  const renderer = {
    frozenNotification() {
      if (!currentChannel || !currentChannel.isFrozen) return null;

      if (renderFrozenNotification) return renderFrozenNotification();
      return <FrozenNotification className="sendbird-conversation__messages__notification" />;
    },
    unreadMessagesNotification() {
      if (isScrollBottomReached || !unreadSinceDate) return null;
      return (
        <UnreadCount
          className="sendbird-conversation__messages__notification"
          count={unreadMessageCount}
          lastReadAt={unreadSinceDate}
          onClick={scrollToBottom}
        />
      );
    },
    scrollToBottomButton() {
      if (!hasNext() && isScrollBottomReached) return null;

      return (
        <div
          className="sendbird-conversation__scroll-bottom-button"
          onClick={scrollToBottom}
          onKeyDown={scrollToBottom}
          tabIndex={0}
          role="button"
        >
          <Icon width="24px" height="24px" type={IconTypes.CHEVRON_DOWN} fillColor={IconColors.PRIMARY} />
        </div>
      );
    },
  };

  if (loading) {
    if (renderPlaceholderLoader) return renderPlaceholderLoader();
    return <PlaceHolder type={PlaceHolderTypes.LOADING} />;
  }

  if (messages.length === 0) {
    if (renderPlaceholderEmpty) return renderPlaceholderEmpty();
    return <PlaceHolder className="sendbird-conversation__no-messages" type={PlaceHolderTypes.NO_MESSAGES} />;
  }

  return (
    <>
      {/* TODO: Display the loading indicator while adjusting the scroll position */}
      {/* {!isScrolled && <PlaceHolder type={PlaceHolderTypes.LOADING} />} */}
      <div className={`sendbird-conversation__messages ${className}`}>
        <div className="sendbird-conversation__scroll-container">
          <div className="sendbird-conversation__padding" />
          <div className="sendbird-conversation__messages-padding" ref={scrollRef}>
            {messages.map((message, idx) => {
              const { chainTop, chainBottom, hasSeparator } = getMessagePartsInfo({
                allMessages: messages as CoreMessageType[],
                replyType,
                isMessageGroupingEnabled,
                currentIndex: idx,
                currentMessage: message as CoreMessageType,
                currentChannel,
              });
              const isOutgoingMessage = message.isUserMessage() && message.sender.userId === store.config.userId;
              return (
                <MessageProvider message={message} key={getComponentKeyFromMessage(message)} isByMe={isOutgoingMessage}>
                  <Message
                    handleScroll={onMessageContentSizeChanged}
                    renderMessage={renderMessage}
                    message={message as EveryMessage}
                    hasSeparator={hasSeparator}
                    chainTop={chainTop}
                    chainBottom={chainBottom}
                    renderCustomSeparator={renderCustomSeparator}
                  />
                </MessageProvider>
              );
            })}
            {!hasNext()
              && store?.config?.groupChannel?.enableTypingIndicator
              && store?.config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Bubble) && (
                <TypingIndicatorBubbleWrapper handleScroll={onMessageContentSizeChanged} />
            )}
          </div>
        </div>

        <>{renderer.frozenNotification()}</>
        <>{renderer.unreadMessagesNotification()}</>
        <>{renderer.scrollToBottomButton()}</>
      </div>
    </>
  );
};

const TypingIndicatorBubbleWrapper = (props: Pick<TypingIndicatorBubbleProps, 'handleScroll'>) => {
  const { stores } = useSendbirdStateContext();
  const [typingMembers, setTypingMembers] = useState<Member[]>([]);

  useGroupChannelHandler(stores.sdkStore.sdk, {
    onTypingStatusUpdated(channel) {
      setTypingMembers(channel.getTypingUsers());
    },
  });

  return <TypingIndicatorBubble typingMembers={typingMembers} handleScroll={props.handleScroll} />;
};

export default MessageListView;
