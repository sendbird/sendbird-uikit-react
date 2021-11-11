import './message-list.scss';

import React from 'react';
import isSameDay from 'date-fns/isSameDay';

import { useChannel } from '../../context/ChannelProvider';
import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import Icon, { IconTypes } from '../../../../ui/Icon';
import { compareMessagesForGrouping } from '../../context/utils';
import Message from '../Message';
import { RenderMessageProps } from '../../../../types';

export type MessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderPlaceholderEmpty?: () => React.ReactNode;
  renderCustomSeperator?: () => React.ReactNode;
};

const MessageList: React.FC<MessageListProps> = (props: MessageListProps) => {
  const {
    renderMessage,
    renderPlaceholderEmpty,
    renderCustomSeperator,
  } = props;
  const {
    allMessages,
    hasMoreToBottom,
    setIntialTimeStamp,
    setAnimatedMessageId,
    setHighLightedMessageId,
    useMessageGrouping,
    scrollRef,
  } = useChannel();

  const onClickScrollBot = () => {
    setIntialTimeStamp?.(null);
    setAnimatedMessageId?.(null);
    setHighLightedMessageId?.(null);
  };

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
            // onScroll={onScroll}
          >
            {
              allMessages.map(
                (m, idx) => {
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
                    // const current = scrollRef?.current;
                    // if (current) {
                    //   const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
                    //   // const { scrollBottom = 0 } = this.state;
                    //   if (scrollBottom < bottom) {
                    //     current.scrollTop += bottom - scrollBottom;
                    //   }
                    // }
                  }

                  return (
                    <Message
                      handleScroll={handleScroll}
                      renderMessage={renderMessage}
                      message={m}
                      hasSeparator={hasSeparator}
                      chainTop={chainTop}
                      chainBottom={chainBottom}
                      renderCustomSeperator={renderCustomSeperator}
                      key={m.messageId || m.reqId}
                    />
                  )
                },
              )
            }
          </div>
        </div>
        {
          hasMoreToBottom && (
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
