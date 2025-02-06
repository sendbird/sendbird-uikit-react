import './openchannel-message-list.scss';

import React, { ReactElement, useRef, useState, useMemo } from 'react';
import { UserMessage } from '@sendbird/chat/message';
import isSameDay from 'date-fns/isSameDay';

import Icon, { IconTypes, IconColors } from '../../../../ui/Icon';

import PlaceHolder, { PlaceHolderTypes } from '../../../../ui/PlaceHolder';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';
import OpenChannelMessage from '../OpenChannelMessage';
import { RenderMessageProps } from '../../../../types';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';
import { compareMessagesForGrouping } from '../../../../utils/messages';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../lib/LocalizationContext';

export type OpenChannelMessageListProps = {
  renderMessage?: (props: RenderMessageProps) => React.ReactElement;
  renderPlaceHolderEmptyList?: () => React.ReactElement;
};

/** @deprecated * */
export type OpenchannelMessageListProps = OpenChannelMessageListProps;

function OpenChannelMessageList(props: OpenChannelMessageListProps, ref: React.ForwardedRef<HTMLDivElement>): ReactElement {
  const {
    isMessageGroupingEnabled = true,
    allMessages,
    hasMore,
    onScroll,
  } = useOpenChannelContext();
  const { state } = useSendbird();
  const { stringSet } = useLocalization();
  const userId = state.config.userId;
  const localRef = useRef<HTMLDivElement>(null);
  const scrollRef = ref || localRef;
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  const scrollToBottom = () => {
    if (scrollRef && 'current' in scrollRef && scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      setShowScrollDownButton(false);
    }
  };

  const handleOnScroll = useHandleOnScrollCallback({
    setShowScrollDownButton,
    hasMore,
    onScroll,
    scrollRef: scrollRef as any,
  });

  const memoizedMessageList = useMemo(() => {
    if (allMessages.length > 0) {
      return (
        allMessages.map((message, index) => {
          const previousMessage = allMessages[index - 1];
          const nextMessage = allMessages[index - 1];

          const previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
          const currentCreatedAt = message?.createdAt;
          // https://stackoverflow.com/a/41855608
          const hasSeparator = !(previousMessageCreatedAt && (
            isSameDay(currentCreatedAt, previousMessageCreatedAt)
          ));

          const [chainTop, chainBottom] = isMessageGroupingEnabled
            ? compareMessagesForGrouping(previousMessage, message, nextMessage, stringSet)
            : [false, false];
          const isByMe = (message as UserMessage)?.sender?.userId === userId;
          const key = message?.messageId || (message as UserMessage)?.reqId;
          return (
            <MessageProvider message={message} isByMe={isByMe} key={key}>
              <OpenChannelMessage
                message={message}
                chainTop={chainTop}
                chainBottom={chainBottom}
                hasSeparator={hasSeparator}
                renderMessage={props?.renderMessage}
              />
            </MessageProvider>
          );
        })
      );
    }
    return (
      props?.renderPlaceHolderEmptyList?.() || (
        <PlaceHolder
          className="sendbird-openchannel-conversation-scroll__container__place-holder"
          type={PlaceHolderTypes.NO_MESSAGES}
        />
      )
    );
  }, [allMessages]);

  return (
    <div className="sendbird-openchannel-conversation-scroll">
      <div className="sendbird-openchannel-conversation-scroll__container">
        <div className="sendbird-openchannel-conversation-scroll__container__padding" />
        <div
          className={[
            'sendbird-openchannel-conversation-scroll__container__item-container',
            (allMessages.length > 0) ? '' : 'no-messages',
          ].join(' ')}
          onScroll={handleOnScroll}
          ref={scrollRef}
        >
          {memoizedMessageList}
        </div>
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
  );
}

export default React.forwardRef(OpenChannelMessageList);
