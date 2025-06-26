import { GroupChannel } from '@sendbird/chat/groupChannel';
import isSameDay from 'date-fns/isSameDay';

import { compareMessagesForGrouping } from '../../../../utils/messages';
import { ReplyType } from '../../../../types';
import { CoreMessageType } from '../../../../utils';
import { StringSet } from '../../../../ui/Label/stringSet';

export interface GetMessagePartsInfoProps {
  allMessages: Array<CoreMessageType>;
  stringSet: StringSet
  isMessageGroupingEnabled?: boolean;
  currentIndex: number;
  currentMessage: CoreMessageType;
  currentChannel?: GroupChannel | null;
  replyType?: string;
  firstUnreadMessageId?: number | string | undefined;
}

interface OutPuts {
  chainTop: boolean,
  chainBottom: boolean,
  hasSeparator: boolean,
  hasNewMessageSeparator: boolean,
  newFirstUnreadMessageId?: number | string | undefined,
}

/**
 * exported, should be backward compatible
 */
export const getMessagePartsInfo = ({
  allMessages,
  stringSet,
  isMessageGroupingEnabled = true,
  currentIndex = 0,
  currentMessage,
  currentChannel = null,
  replyType = '',
  firstUnreadMessageId,
}: GetMessagePartsInfoProps): OutPuts => {
  const previousMessage = allMessages[currentIndex - 1];
  const nextMessage = allMessages[currentIndex + 1];
  const [chainTop, chainBottom] = isMessageGroupingEnabled
    ? compareMessagesForGrouping(previousMessage, currentMessage, nextMessage, stringSet, currentChannel, (replyType as ReplyType))
    : [false, false];
  const previousMessageCreatedAt = previousMessage?.createdAt;
  const currentCreatedAt = currentMessage.createdAt;

  // NOTE: for pending/failed messages
  const isLocalMessage = 'sendingStatus' in currentMessage && (currentMessage.sendingStatus !== 'succeeded');

  // https://stackoverflow.com/a/41855608
  const hasSeparator = isLocalMessage ? false : !(previousMessageCreatedAt && (isSameDay(currentCreatedAt, previousMessageCreatedAt)));
  let hasNewMessageSeparator = false;
  let newFirstUnreadMessageId;
  if (!firstUnreadMessageId) {
    hasNewMessageSeparator = currentChannel.myLastRead === (currentCreatedAt - 1);
    if (hasNewMessageSeparator) newFirstUnreadMessageId = currentMessage.messageId;
  } else if (currentMessage.messageId === firstUnreadMessageId || currentChannel.myLastRead === (currentCreatedAt - 1)) {
    hasNewMessageSeparator = true;
    newFirstUnreadMessageId = currentMessage.messageId;
  }

  return {
    chainTop,
    chainBottom,
    hasSeparator,
    hasNewMessageSeparator,
    newFirstUnreadMessageId,
  };
};
