import './message-list.scss';

import React, { useState, useMemo } from 'react';
import isSameDay from 'date-fns/isSameDay';

import { useChannel } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';
import { compareMessagesForGrouping } from '../../context/utils';
import Message from '../Message';
import { RenderMessageProps } from '../../../../types';
import { isAboutSame } from '../../context/utils';
import uuidv4 from '../../../../utils/uuid';

export type MessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderPlaceholderEmpty?: () => React.ReactNode;
  renderCustomSeparator?: () => React.ReactNode;
};

const SCROLL_REF_CLASS_NAME = '.sendbird-msg--scroll-ref';

const MessageList: React.FC<MessageListProps> = (props: MessageListProps) => {
  const {
    renderMessage,
    renderPlaceholderEmpty,
    renderCustomSeparator,
  } = props;
  const {
    allMessages,
    hasMorePrev,
    setInitialTimeStamp,
    setAnimatedMessageId,
    setHighLightedMessageId,
    useMessageGrouping,
    scrollRef,
    onScrollCallback,
    onScrollDownCallback,
    messagesDispatcher,
    messageActionTypes,
    currentGroupChannel,
  } = useChannel();
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
            element.scrollTop = scrollHeight - clientHeight;
          } catch (error) {
            //
          }
        }
      });
    }

    // save the lastest scroll bottom value
    if (scrollRef?.current) {
      const current = scrollRef?.current;
      setScrollBottom(current.scrollHeight - current.scrollTop - current.offsetHeight)
    }

    // do this later
    setTimeout(() => {
      // mark as read if scroll is at end
      if (clientHeight + scrollTop === scrollHeight) {
        messagesDispatcher({
          type: messageActionTypes.MARK_AS_READ,
          payload: { channel: currentGroupChannel },
        });
        currentGroupChannel?.markAsRead();
      }
    }, 500);
  };

  const onClickScrollBot = () => {
    setInitialTimeStamp?.(null);
    setAnimatedMessageId?.(null);
    setHighLightedMessageId?.(null);
    if (scrollRef?.current?.scrollTop) {
      scrollRef.current.scrollTop = scrollRef?.current?.scrollHeight - scrollRef?.current?.offsetHeight;
    }
  };

  // Because every message components are re-rendered everytime by every scroll events
  const memoizedAllMessages = useMemo(() => {
    return (
      allMessages.map((m, idx) => {
        const previousMessage = allMessages[idx - 1];
        const nextMessage = allMessages[idx + 1];
        const [chainTop, chainBottom] = useMessageGrouping
          ? compareMessagesForGrouping(previousMessage, m, nextMessage)
          : [false, false];
        const previousMessageCreatedAt = previousMessage?.createdAt;
        const currentCreatedAt = m.createdAt;
        // https://stackoverflow.com/a/41855608
        const hasSeparator = !(previousMessageCreatedAt && (
          isSameDay(currentCreatedAt, previousMessageCreatedAt)
        ));

        const handleScroll = () => {
          const current = scrollRef?.current;
          if (current) {
            const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
            if (scrollBottom < bottom) {
              current.scrollTop += bottom - scrollBottom;
            }
          }
        }

        return (
          <Message
            handleScroll={handleScroll}
            renderMessage={renderMessage}
            message={m}
            hasSeparator={hasSeparator}
            chainTop={chainTop}
            chainBottom={chainBottom}
            renderCustomSeparator={renderCustomSeparator}
            key={m.messageId + uuidv4()}
          />
        );
      })
    );
  }, [allMessages]);

  if (allMessages.length < 1) {
    return (
      <>
        {
          renderPlaceholderEmpty?.() || (
            <PlaceHolder
              className="sendbird-conversation__no-messages"
              type={PlaceHolderTypes.NO_MESSAGES}
            />)
        }
      </>
    );
  }
  return (
    <div className="sendbird-conversation__messages">
      <div className="sendbird-conversation__scroll-container">
        <div className="sendbird-conversation__padding" />
        <div
          className="sendbird-conversation__messages-padding"
          ref={scrollRef}
          onScroll={onScroll}
        >
          {memoizedAllMessages}
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
