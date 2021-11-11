import './openchannel-message-list.scss';

import React, { ReactElement, useRef, useState, useMemo } from 'react';
import isSameDay from 'date-fns/isSameDay';

// import MessageHoc from './MessageHOC';
import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { compareMessagesForGrouping } from '../../context/utils';
import { useOpenChannel } from '../../context/OpenChannelProvider';
import OpenChannelMessage from '../OpenChannelMessage';
import { RenderMessageProps } from '../../../../types';

export type OpenchannelMessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  renderPlaceHolderEmptyList?: () => React.ReactNode;
}

function OpenchannelMessageList(
  props: OpenchannelMessageListProps,
  ref: React.RefObject<HTMLDivElement>,
): ReactElement {
  const {
    useMessageGrouping = true,
    allMessages,
    hasMore,
    onScroll,
  } = useOpenChannel();
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
                  const hasSeparator = !(previousMessageCreatedAt && (
                    isSameDay(currentCreatedAt, previousMessageCreatedAt)
                  ));

                  const [chainTop, chainBottom] = useMessageGrouping
                    ? compareMessagesForGrouping(previousMessage, message, nextMessage)
                    : [false, false];
                  return (
                    <OpenChannelMessage
                      key={message?.messageId || message?.reqId}
                      message={message}
                      chainTop={chainTop}
                      chainBottom={chainBottom}
                      hasSeparator={hasSeparator}
                      renderMessage={props?.renderMessage}
                      status={status}
                    />
                  )
                })
              )
              : props?.renderPlaceHolderEmptyList?.() || (
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

export default React.forwardRef(OpenchannelMessageList);
