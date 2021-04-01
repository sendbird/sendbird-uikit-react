import React, { ReactElement, useRef, useState, useMemo } from 'react';
import isSameDay from 'date-fns/isSameDay';
import {
  ClientFileMessage,
  ClientUserMessage,
  EveryMessage,
  RenderCustomMessage,
} from '../../../index';
import MessageHoc from './MessageHOC';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

import PlaceHolder, { PlaceHolderTypes } from '../../../ui/PlaceHolder';
import './openchannel-conversation-scroll.scss';
import { compareMessagesForGrouping } from '../utils';

interface Props {
  openchannel: SendBird.OpenChannel;
  user: SendBird.User;
  allMessages: Array<EveryMessage>;
  useMessageGrouping: boolean;
  isOnline: boolean;
  hasMore: boolean;
  renderCustomMessage?: RenderCustomMessage;
  onScroll(callback?: () => void): void;
  updateMessage(messageId: number, text: string, callback?: () => void): void;
  deleteMessage(message: ClientUserMessage | ClientFileMessage, callback?: () => void): void;
  resendMessage(failedMessage: ClientUserMessage | ClientFileMessage): void;
}

function OpenchannelConversationScroll(
  {
    useMessageGrouping = true,
    openchannel,
    user,
    allMessages,
    isOnline = true,
    hasMore,
    onScroll,
    renderCustomMessage,
    updateMessage,
    deleteMessage,
    resendMessage,
  }: Props,
  ref: React.RefObject<HTMLDivElement>,
): ReactElement {
  const scrollRef = ref || useRef(null);
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  const handleOnScroll = (e) => {
    const element = e.target;
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = element;
    if (
      (scrollHeight > scrollTop + clientHeight)
      && (window.navigator.userAgent.indexOf('MSIE ') < 0) // don't show button in IE
    ) {
      setShowScrollDownButton(true);
    } else {
      setShowScrollDownButton(false);
    }

    if (!hasMore) {
      return;
    }
    if (scrollTop === 0) {
      const nodes = scrollRef.current.querySelectorAll('.sendbird-msg--scroll-ref');
      const first = nodes && nodes[0];
      onScroll(() => {
        try {
          first.scrollIntoView();
        } catch (error) { }
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      setShowScrollDownButton(false);
    }
  };

  const hasMessage = useMemo(() => {
    return allMessages.length > 0;
  }, [allMessages.length]);

  return (
    <div
      className="sendbird-openchannel-conversation-scroll"
      onScroll={handleOnScroll}
      ref={scrollRef}
    >
      <div className="sendbird-openchannel-conversation-scroll__container">
        <div className="sendbird-openchannel-conversation-scroll__container__padding" />
        <div className={`sendbird-openchannel-conversation-scroll__container__item-container${hasMessage ? '' : '--no-messages'}`}>
          {
            hasMessage
              ? (
                allMessages.map((message, index) => {
                  let status: string;

                  if (message.messageType !== 'admin') {
                    status = message.sendingStatus;
                  }

                  const previousMessage = allMessages[index - 1];
                  const nextMessage = allMessages[index - 1];

                  const previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
                  const currentCreatedAt = message.createdAt;
                  // https://stackoverflow.com/a/41855608
                  const hasSeperator = !(previousMessageCreatedAt && (
                    isSameDay(currentCreatedAt, previousMessageCreatedAt)
                  ));

                  const [chainTop, chainBottom] = useMessageGrouping
                    ? compareMessagesForGrouping(previousMessage, message, nextMessage)
                    : [false, false];
                  return (
                    <MessageHoc
                      renderCustomMessage={renderCustomMessage}
                      channel={openchannel}
                      key={message.messageId}
                      message={message}
                      status={status}
                      userId={user.userId}
                      disabled={!isOnline}
                      editDisabled={openchannel.isFrozen}
                      hasSeperator={hasSeperator}
                      chainTop={chainTop}
                      chainBottom={chainBottom}
                      deleteMessage={deleteMessage}
                      updateMessage={updateMessage}
                      resendMessage={resendMessage}
                    />
                  )
                })
              )
              : (
                <PlaceHolder
                  className="sendbird-openchannel-conversation-scroll__container__place-holder"
                  type={PlaceHolderTypes.NO_MESSAGES}
                />
              )
          }
        </div>
        {
          showScrollDownButton && (
            <div
              className="sendbird-openchannel-conversation-scroll__container__scroll-bottom-button"
              onClick={scrollToBottom}
              onKeyDown={scrollToBottom}
              tabIndex={0}
              role="button"
            >
              <Icon
                width="24px"
                height="24px"
                type={IconTypes.CHEVRON_DOWN}
                fillColor={IconColors.CONTENT}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}

export default React.forwardRef(OpenchannelConversationScroll);
