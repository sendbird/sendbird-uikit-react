import './message-list.scss';

import React, { useState } from 'react';

import { useChannelContext } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import Message from '../Message';
import { RenderCustomSeparatorProps, RenderMessageProps } from '../../../../types';
import { isAboutSame } from '../../context/utils';
import { getMessagePartsInfo } from './getMessagePartsInfo';

export interface MessageListProps {
  className?: string;
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceholderEmpty?: () => React.ReactElement;
  renderCustomSeparator?: (props: RenderCustomSeparatorProps) => React.ReactElement;
  renderPlaceholderLoader?: () => React.ReactElement;
}

const SCROLL_REF_CLASS_NAME = '.sendbird-msg--scroll-ref';

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
    replyType,
    loading,
  } = useChannelContext();
  const [scrollBottom, setScrollBottom] = useState(0);

  const onScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;

    if (scrollTop === 0) {
      if (!hasMorePrev) {
        return;
      }
      const nodes = scrollRef.current.querySelectorAll(SCROLL_REF_CLASS_NAME);
      const first = nodes && nodes[0];
      onScrollCallback(([messages]) => {
        if (messages) {
          // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
          // Set block to nearest to prevent unexpected scrolling from outer components
          try {
            first.scrollIntoView({ block: "start", inline: "nearest" });
          } catch (error) {
            //
          }
        }
      });
    }

    if (isAboutSame(clientHeight + scrollTop, scrollHeight, 10)) {
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
    if (scrollRef?.current) {
      const current = scrollRef?.current;
      setScrollBottom(current.scrollHeight - current.scrollTop - current.offsetHeight)
    }

    if (!disableMarkAsRead && isAboutSame(clientHeight + scrollTop, scrollHeight, 10)) {
      // Mark as read if scroll is at end
      setTimeout(() => {
        messagesDispatcher({
          type: messageActionTypes.MARK_AS_READ,
          payload: { channel: currentGroupChannel },
        });
        try {
          currentGroupChannel?.markAsRead?.();
        } catch {
          //
        }
      }, 500);
    }
  };

  const onClickScrollBot = () => {
    setInitialTimeStamp?.(null);
    setAnimatedMessageId?.(null);
    setHighLightedMessageId?.(null);
    if (scrollRef?.current?.scrollTop > -1) {
      scrollRef.current.scrollTop = scrollRef?.current?.scrollHeight - scrollRef?.current?.offsetHeight;
    }
  };

  const handleScroll = () => {
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      if (scrollBottom < bottom) {
        current.scrollTop += bottom - scrollBottom;
      }
    }
  };

  if (loading) {
    if (renderPlaceholderLoader && typeof renderPlaceholderLoader === 'function') {
      return renderPlaceholderLoader();
    }
    return <PlaceHolder type={PlaceHolderTypes.LOADING} />;
  }
  if (allMessages.length < 1) {
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
          onScroll={onScroll}
        >
          {allMessages.map((m, idx) => {
            const {
              chainTop,
              chainBottom,
              hasSeparator,
            } = getMessagePartsInfo({
              allMessages,
              replyType,
              isMessageGroupingEnabled,
              currentIndex: idx,
              currentMessage: m,
              currentChannel: currentGroupChannel,
            });
            return (
              <Message
                key={m?.messageId}
                handleScroll={handleScroll}
                renderMessage={renderMessage}
                message={m}
                hasSeparator={hasSeparator}
                chainTop={chainTop}
                chainBottom={chainBottom}
                renderCustomSeparator={renderCustomSeparator}
              />
            );
          })}
          {/* show frozen notifications */}
          {/* show new message notifications */}
        </div>
      </div>
      {
        // This flag is an unmatched variable
        (scrollBottom > 1) && (
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
