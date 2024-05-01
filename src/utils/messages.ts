import { SendingStatus, type BaseMessage, type UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import format from 'date-fns/format';

import { ReplyType } from '../types';
import type { CoreMessageType } from '.';
import { isReadMessage, isSendableMessage } from '.';

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
  currentUserId?: string,
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
    isSameGroup(prevMessage, currMessage, currentUserId) && isAcceptable,
    isSameGroup(currMessage, nextMessage, currentUserId) && isAcceptable,
  ];
};

export const getMessageCreatedAt = (message: BaseMessage) => format(message.createdAt, 'p');

// Group current user's messages together. The current user's messages
// may not have their userId on it, and if not, we assume that messages w/ a
// local send status is the current user's as well.
// Given the above is true, group by timestamp
export const areBothFromMyUserAndInSameGroup = (
  message?: CoreMessageType,
  comparingMessage?: CoreMessageType,
  currentUserId?: string
) => {
  if (!currentUserId || !message?.createdAt || !comparingMessage?.createdAt) return false;

  const isFirstMessageByMe = getIsByMe(currentUserId, message);
  const isSecondMessageByMe = getIsByMe(currentUserId, comparingMessage);

  if (isFirstMessageByMe && isSecondMessageByMe) {
    return getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage);
  }

  return false;
}

export const isSameGroup = (
  message: CoreMessageType,
  comparingMessage: CoreMessageType,
  currentUserId?: string
) => {
  if (areBothFromMyUserAndInSameGroup(message, comparingMessage, currentUserId)) {
    return true;
  }

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

  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message) === getMessageCreatedAt(comparingMessage)
  );
};

export const getIsByMe = (userId: string, message: BaseMessage) => { 
  if (!isSendableMessage(message) || !userId) return false;
  const messageIsLocalType = [SendingStatus.FAILED, SendingStatus.PENDING].includes(message.sendingStatus);

  return userId === message.sender.userId || messageIsLocalType;
}

export default {
  compareMessagesForGrouping,
  getMessageCreatedAt,
  isSameGroup,
};
