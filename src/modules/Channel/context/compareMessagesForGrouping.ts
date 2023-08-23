import { UserMessage, FileMessage, AdminMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { isSameGroup } from './utils';
import { ReplyType } from '../../../types';

/**
 * exported, should be backward compatible
 */
export const compareMessagesForGrouping = (
  prevMessage: UserMessage | FileMessage | AdminMessage,
  currMessage: UserMessage | FileMessage | AdminMessage,
  nextMessage: UserMessage | FileMessage | AdminMessage,
  currentChannel: GroupChannel,
  replyType: ReplyType,
): [
  chainTop: boolean,
  chainBottom: boolean,
] => {
  if (replyType === 'THREAD' && currMessage?.threadInfo) {
    return [false, false];
  }
  const sendingStatus = (currMessage as UserMessage)?.sendingStatus || '';
  const isAcceptable = sendingStatus !== 'pending' && sendingStatus !== 'failed';
  return [
    isSameGroup(prevMessage, currMessage, currentChannel) && isAcceptable,
    isSameGroup(currMessage, nextMessage, currentChannel) && isAcceptable,
  ];
};
