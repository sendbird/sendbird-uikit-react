import { UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

import { isSameGroup } from './utils';
import { ReplyType } from '../../../types';
import {CoreMessageType} from "../../../utils";

/**
 * exported, should be backward compatible
 */
export const compareMessagesForGrouping = (
  prevMessage: CoreMessageType,
  currMessage: CoreMessageType,
  nextMessage: CoreMessageType,
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
