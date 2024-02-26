import './index.scss';
import React, { useEffect, useState } from 'react';
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
import { useScrollBehavior } from './hooks/useScrollBehavior';
import TypingIndicatorBubble from '../../../../ui/TypingIndicatorBubble';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { getComponentKeyFromMessage } from '../../context/utils';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';

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
}

export const MessageList = ({
  className = '',
  renderMessage = (props) => <Message {...props} />,
  renderMessageContent,
  renderCustomSeparator,
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
        const diff = currentDistance - latestDistance;
        // Move the scroll as much as the height of the message has changed
        scrollPubSub.publish('scroll', { top: elem.scrollTop + diff, lazy: false });
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
                    renderCustomSeparator,
                  })}
                </MessageProvider>
              );
            })}
            {!hasNext()
              && store?.config?.groupChannel?.enableTypingIndicator
              && store?.config?.groupChannel?.typingIndicatorTypes?.has(TypingIndicatorType.Bubble) && (
                <TypingIndicatorBubbleWrapper channelUrl={channelUrl} handleScroll={onMessageContentSizeChanged} />
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
