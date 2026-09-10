import { GroupChannel } from '@sendbird/chat/groupChannel';
import isSameDay from 'date-fns/isSameDay';

import { compareMessagesForGrouping } from '../../../../utils/messages';
import { ReplyType } from '../../../../types';
import { CoreMessageType, isAdminMessage } from '../../../../utils';
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
  isUnreadMessageExistInChannel?: React.MutableRefObject<boolean>;
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
  isUnreadMessageExistInChannel,
}: GetMessagePartsInfoProps): OutPuts => {
  const previousMessage = allMessages[currentIndex - 1];
  const nextMessage = allMessages[currentIndex + 1];
  const [chainTop, chainBottom] = isMessageGroupingEnabled
    ? compareMessagesForGrouping(previousMessage, currentMessage, nextMessage, stringSet, currentChannel, (replyType as ReplyType))
    : [false, false];
  const currentCreatedAt = currentMessage.createdAt;

  // NOTE: for pending/failed messages
  const isLocalMessage = 'sendingStatus' in currentMessage && (currentMessage.sendingStatus !== 'succeeded');

  // Compute the separator regardless of sending status (a pending message opening a new day must show it
  // immediately, else it appears only on send-success and its height clips the message). Compare against the
  // latest day already shown above (max createdAt so far), not just the immediately-previous message, so a
  // separator marks only a genuinely later day — never a backward-dated or duplicate one. @sendbird/uikit-tools
  // sorts unsent messages to the bottom (createdAt + LARGE_OFFSET); only those can be out of order, so only they
  // need the scan. Non-local messages are already chronological — their previous message is that maximum.
  let maxPrecedingCreatedAt = previousMessage?.createdAt;
  if (isLocalMessage) {
    for (let index = 0; index < currentIndex; index += 1) {
      const precedingCreatedAt = allMessages[index]?.createdAt;
      if (precedingCreatedAt !== undefined && (maxPrecedingCreatedAt === undefined || precedingCreatedAt > maxPrecedingCreatedAt)) {
        maxPrecedingCreatedAt = precedingCreatedAt;
      }
    }
  }
  // https://stackoverflow.com/a/41855608
  const hasSeparator = maxPrecedingCreatedAt === undefined
    || (currentCreatedAt > maxPrecedingCreatedAt && !isSameDay(currentCreatedAt, maxPrecedingCreatedAt));

  const hasNewMessageSeparator = (isLocalMessage || !isUnreadMessageExistInChannel?.current) ? false : (!isAdminMessage(currentMessage) && firstUnreadMessageId === currentMessage.messageId);

  return {
    chainTop,
    chainBottom,
    hasSeparator,
    hasNewMessageSeparator,
  };
};
