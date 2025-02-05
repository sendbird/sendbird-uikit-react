import { type BaseMessage, type UserMessage } from '@sendbird/chat/message';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import format from 'date-fns/format';

import { ReplyType } from '../types';
import type { CoreMessageType } from '.';
import { isReadMessage } from '.';
import { StringSet } from '../ui/Label/stringSet';

/**
 * exported, should be backward compatible
 * @returns [chainTop: `boolean`, chainBottom: `boolean`]
 */
export const compareMessagesForGrouping = (
  prevMessage: CoreMessageType,
  currMessage: CoreMessageType,
  nextMessage: CoreMessageType,
  stringSet: StringSet,
  currentChannel?: GroupChannel | null,
  replyType?: ReplyType,
) => {
  if (!currentChannel || (currentChannel as GroupChannel).channelType !== 'group') {
    return [
      isSameGroup(prevMessage, currMessage, stringSet),
      isSameGroup(currMessage, nextMessage, stringSet),
    ];
  }

  if (replyType === 'THREAD' && currMessage?.threadInfo) {
    return [false, false];
  }
  const sendingStatus = (currMessage as UserMessage)?.sendingStatus || '';
  const isAcceptable = sendingStatus !== 'pending' && sendingStatus !== 'failed';
  return [
    isSameGroup(prevMessage, currMessage, stringSet, currentChannel) && isAcceptable,
    isSameGroup(currMessage, nextMessage, stringSet, currentChannel) && isAcceptable,
  ];
};

export const getMessageCreatedAt = (message: BaseMessage, stringSet: StringSet) => {
  return format(message.createdAt, stringSet.DATE_FORMAT__MESSAGE_CREATED_AT);
};

export const isSameGroup = (
  message: CoreMessageType,
  comparingMessage: CoreMessageType,
  stringSet: StringSet,
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
  return (
    message?.sendingStatus === comparingMessage?.sendingStatus
    && message?.sender?.userId === comparingMessage?.sender?.userId
    && getMessageCreatedAt(message, stringSet) === getMessageCreatedAt(comparingMessage, stringSet)
  ) && (
    currentChannel ? isReadMessage(currentChannel, message) === isReadMessage(currentChannel, comparingMessage) : true
  );
};

export default {
  compareMessagesForGrouping,
  getMessageCreatedAt,
  isSameGroup,
};
