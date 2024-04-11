import { SendingStatus, type BaseMessage, type UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import format from 'date-fns/format';

import { ReplyType } from '../types';
import type { CoreMessageType } from '.';
import { isReadMessage } from '.';

/**
 * exported, should be backward compatible
 * @returns [chainTop: `boolean`, chainBottom: `boolean`]
 */
export const compareMessagesForGrouping = (
  prevMessage: CoreMessageType,
  currMessage: CoreMessageType,
  nextMessage: CoreMessageType,
  currentChannel?: GroupChannel,
  replyType?: ReplyType,
) => {
  if (!currentChannel || (currentChannel as GroupChannel).channelType !== 'group') {
    return [
      isSameGroup(prevMessage, currMessage),
      isSameGroup(currMessage, nextMessage),
    ];
  }

  if (replyType === 'THREAD' && currMessage?.threadInfo) {
    return [false, false];
  }
  const sendingStatus = (currMessage as UserMessage)?.sendingStatus || '';
  const isAcceptable = sendingStatus !== 'failed';
  return [
    isSameGroup(prevMessage, currMessage, currentChannel) && isAcceptable,
    isSameGroup(currMessage, nextMessage, currentChannel) && isAcceptable,
  ];
};

export const getMessageCreatedAt = (message: BaseMessage) => format(message.createdAt, 'p');

export const isSameGroup = (
  message: CoreMessageType,
  comparingMessage: CoreMessageType,
  currentChannel?: GroupChannel,
) => {
  if (
    !(
      message
      && comparingMessage
      && message.messageType
      && message.messageType !== 'admin'
      && comparingMessage.messageType
      && comparingMessage?.messageType !== 'admin'
      && 'sender' in message
      && 'sender' in comparingMessage
      && message.createdAt
      && comparingMessage.createdAt
      && message.sender.userId
      && comparingMessage.sender.userId
    )
  ) {
    return false;
  }

  // group pending messages with any message type other than failed
  // Given the above is true, group by timestamp and sender id
  if ([message.sendingStatus, comparingMessage.sendingStatus].includes(SendingStatus.PENDING) &&
      ![message.sendingStatus, comparingMessage.sendingStatus].includes(SendingStatus.FAILED)) {
    return (
      message?.sender?.userId === comparingMessage?.sender?.userId
      && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
    );
  }

  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
  );
};

export default {
  compareMessagesForGrouping,
  getMessageCreatedAt,
  isSameGroup,
};
