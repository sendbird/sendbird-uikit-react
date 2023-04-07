import React, { RefObject, useMemo } from 'react';
import { BaseMessage, FileMessage, UserMessage } from '@sendbird/chat/message';

import './index.scss';
import ThreadListItem from './ThreadListItem';
import { useThreadContext } from '../../context/ThreadProvider';
import { compareMessagesForGrouping } from '../../context/utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { isSameDay } from 'date-fns';
import { MessageProvider } from '../../../Message/context/MessageProvider';

export interface ThreadListProps {
  className?: string;
  allThreadMessages: Array<UserMessage | FileMessage | BaseMessage>;
  renderMessage?: (props: {
    message: UserMessage | FileMessage,
    chainTop: boolean,
    chainBottom: boolean,
    hasSeparator: boolean,
  }) => React.ReactElement;
  renderCustomSeparator?: (props: { message: UserMessage | FileMessage }) => React.ReactElement;
  scrollRef?: RefObject<HTMLDivElement>;
  scrollBottom?: number;
}

export default function ThreadList({
  className,
  allThreadMessages,
  renderMessage,
  renderCustomSeparator,
  scrollRef,
  scrollBottom,
}: ThreadListProps): React.ReactElement {
  const { config } = useSendbirdStateContext();
  const { replyType, userId } = config;
  const {
    currentChannel,
  } = useThreadContext();

  const MemorizedMessage = useMemo(() => ({
    message,
    chainTop,
    chainBottom,
    hasSeparator,
  }) => {

    if (typeof renderMessage === 'function') {
      return renderMessage({
        message: message as UserMessage | FileMessage,
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
        // @ts-ignore
        const isByMe = message?.sender?.userId === userId;
        const prevMessage = allThreadMessages[idx - 1];
        const nextMessage = allThreadMessages[idx + 1];
        const [chainTop, chainBottom] = true// isMessageGroupingEnabled
          ? compareMessagesForGrouping(
            prevMessage as UserMessage | FileMessage,
            message as UserMessage | FileMessage,
            nextMessage as UserMessage | FileMessage,
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

        return MemorizedMessage({
          message,
          chainTop,
          chainBottom,
          hasSeparator,
        }) || (
            <MessageProvider message={message} isByMe={isByMe} key={message?.messageId}>
              <ThreadListItem
                message={message as UserMessage | FileMessage}
                chainTop={chainTop}
                chainBottom={chainBottom}
                hasSeparator={hasSeparator}
                renderCustomSeparator={renderCustomSeparator}
                handleScroll={handleScroll}
              />
            </MessageProvider>
          );
      })}
    </div>
  );
}
