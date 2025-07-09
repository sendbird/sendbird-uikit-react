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
  hasPrevious?: boolean;
  firstUnreadMessageId?: number | string | undefined;
  isCurrentDeviceMessage?: boolean;
}

interface OutPuts {
  chainTop: boolean,
  chainBottom: boolean,
  hasSeparator: boolean,
  hasNewMessageSeparator: boolean,
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
  isCurrentDeviceMessage,
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

  const hasNewMessageSeparator = !isCurrentDeviceMessage && firstUnreadMessageId === currentMessage.messageId;

  return {
    chainTop,
    chainBottom,
    hasSeparator,
    hasNewMessageSeparator,
  };
};
