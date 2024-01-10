import React, { RefObject, useMemo } from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import './index.scss';

import type { SendableMessageType } from '../../../../utils';
import ThreadListItem from './ThreadListItem';
import { useThreadContext } from '../../context/ThreadProvider';
import { compareMessagesForGrouping } from '../../../../utils/messages';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { isSameDay } from 'date-fns';
import { MessageProvider } from '../../../Message/context/MessageProvider';

export interface ThreadListProps {
  className?: string;
  renderMessage?: (props: {
    message: SendableMessageType,
    chainTop: boolean,
    chainBottom: boolean,
    hasSeparator: boolean,
  }) => React.ReactElement;
  renderCustomSeparator?: (props: { message: SendableMessageType }) => React.ReactElement;
  scrollRef?: RefObject<HTMLDivElement>;
  scrollBottom?: number;
}

export default function ThreadList({
  className,
  renderMessage,
  renderCustomSeparator,
  scrollRef,
  scrollBottom,
}: ThreadListProps): React.ReactElement {
  const { config } = useSendbirdStateContext();
  const { replyType, userId } = config;
  const {
    currentChannel,
    allThreadMessages,
    localThreadMessages,
  } = useThreadContext();

  const MemorizedMessage = useMemo(() => ({
    message,
    chainTop,
    chainBottom,
    hasSeparator,
  }) => {

    if (typeof renderMessage === 'function') {
      return renderMessage({
        message: message as SendableMessageType,
        chainTop,
        chainBottom,
        hasSeparator,
      });
    }
    return null;
  }, [renderMessage]);

  return (
    <div className={`sendbird-thread-list ${className}`}>
      {allThreadMessages.map((message, idx) => {
        const isByMe = (message as UserMessage)?.sender?.userId === userId;
        const prevMessage = allThreadMessages[idx - 1];
        const nextMessage = allThreadMessages[idx + 1];
        // eslint-disable-next-line no-constant-condition
        const [chainTop, chainBottom] = true// isMessageGroupingEnabled
          ? compareMessagesForGrouping(
            prevMessage as SendableMessageType,
            message as SendableMessageType,
            nextMessage as SendableMessageType,
            currentChannel,
            replyType,
          )
          : [false, false];
        const hasSeparator = !(prevMessage?.createdAt > 0 && (
          isSameDay(message?.createdAt, prevMessage?.createdAt)
        ));

        const handleScroll = () => {
          const current = scrollRef?.current;
          if (current) {
            const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
            if (scrollBottom < bottom) {
              current.scrollTop += bottom - scrollBottom;
            }
          }
        };

        return (
          <MessageProvider message={message} isByMe={isByMe} key={message?.messageId}>
            {
              MemorizedMessage({
                message,
                chainTop,
                chainBottom,
                hasSeparator,
              }) || (
                <ThreadListItem
                  message={message as SendableMessageType}
                  chainTop={chainTop}
                  chainBottom={chainBottom}
                  hasSeparator={hasSeparator}
                  renderCustomSeparator={renderCustomSeparator}
                  handleScroll={handleScroll}
                />
              )
            }
          </MessageProvider>
        );
      })}
      {localThreadMessages.map((message, idx) => {
        const isByMe = (message as UserMessage)?.sender?.userId === userId;
        const prevMessage = localThreadMessages[idx - 1];
        const nextMessage = localThreadMessages[idx + 1];
        // eslint-disable-next-line no-constant-condition
        const [chainTop, chainBottom] = true// isMessageGroupingEnabled
          ? compareMessagesForGrouping(
            prevMessage as SendableMessageType,
            message as SendableMessageType,
            nextMessage as SendableMessageType,
            currentChannel,
            replyType,
          )
          : [false, false];
        const hasSeparator = !(prevMessage?.createdAt > 0 && (
          isSameDay(message?.createdAt, prevMessage?.createdAt)
        ));

        const handleScroll = () => {
          const current = scrollRef?.current;
          if (current) {
            const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
            if (scrollBottom < bottom) {
              current.scrollTop += bottom - scrollBottom;
            }
          }
        };

        return (
          <MessageProvider message={message} isByMe={isByMe} key={message?.messageId}>
            {
              MemorizedMessage({
                message,
                chainTop,
                chainBottom,
                hasSeparator,
              }) || (
                <ThreadListItem
                  message={message as SendableMessageType}
                  hasSeparator={false}
                  renderCustomSeparator={renderCustomSeparator}
                  handleScroll={handleScroll}
                />
              )
            }
          </MessageProvider>
        );
      })}
    </div>
  );
}
