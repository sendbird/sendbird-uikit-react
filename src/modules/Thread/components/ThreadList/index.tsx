import React, { RefObject } from 'react';
import type { UserMessage } from '@sendbird/chat/message';

import './index.scss';

import type { SendableMessageType } from '../../../../utils';
import ThreadListItem, { ThreadListItemProps } from './ThreadListItem';
import { useThreadContext } from '../../context/ThreadProvider';
import { compareMessagesForGrouping } from '../../../../utils/messages';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { isSameDay } from 'date-fns';
import { MessageProvider } from '../../../Message/context/MessageProvider';
import { getCaseResolvedReplyType } from '../../../../lib/utils/resolvedReplyType';

export interface ThreadListProps {
  className?: string;
  renderMessage?: (props: ThreadListItemProps) => React.ReactElement;
  renderCustomSeparator?: (props: { message: SendableMessageType }) => React.ReactElement;
  scrollRef?: RefObject<HTMLDivElement>;
  scrollBottom?: number;
}

export default function ThreadList({
  className,
  renderMessage = (props) => <ThreadListItem {...props} />,
  renderCustomSeparator,
  scrollRef,
  scrollBottom,
}: ThreadListProps): React.ReactElement {
  const { config } = useSendbirdStateContext();
  const { userId } = config;
  const {
    currentChannel,
    allThreadMessages,
    localThreadMessages,
  } = useThreadContext();

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
            getCaseResolvedReplyType(config.groupChannel.replyType).upperCase,
          )
          : [false, false];
        const hasSeparator = !(prevMessage?.createdAt > 0 && (
          isSameDay(message?.createdAt, prevMessage?.createdAt)
        ));

        const handleScroll = () => {
          const current = scrollRef?.current;
          if (current && scrollBottom) {
            const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
            if (scrollBottom < bottom) {
              current.scrollTop += bottom - scrollBottom;
            }
          }
        };

        return (
          <MessageProvider message={message} isByMe={isByMe} key={message?.messageId}>
            {
              renderMessage({
                message: message as SendableMessageType,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
                renderCustomSeparator: renderCustomSeparator,
                handleScroll: handleScroll,
              })
            }
          </MessageProvider>
        );
      })}
      {localThreadMessages.map((message) => {
        const isByMe = (message as UserMessage)?.sender?.userId === userId;
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
              renderMessage({
                message: message as SendableMessageType,
                hasSeparator: false,
                renderCustomSeparator: renderCustomSeparator,
                handleScroll: handleScroll,
              })
            }
          </MessageProvider>
        );
      })}
    </div>
  );
}
