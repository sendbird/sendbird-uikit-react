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
  const previousMessageCreatedAt = previousMessage?.createdAt;
  const currentCreatedAt = currentMessage.createdAt;

  // NOTE: for pending/failed messages
  const isLocalMessage = 'sendingStatus' in currentMessage && (currentMessage.sendingStatus !== 'succeeded');

  // Show the date separator regardless of sending status so a pending message opening a new day shows it
  // immediately, else it appears only on send-success and its height clips the message. @sendbird/uikit-tools
  // sorts unsent messages to the bottom (createdAt + LARGE_OFFSET), so a pending/failed message can render below
  // newer ones; compare it against the latest day already shown above (max createdAt so far) and only mark a
  // genuinely later day — never a backward-dated or duplicate separator. Non-local messages keep the original
  // immediate-previous comparison, so their behavior (including the deprecated Channel module) is unchanged.
  let hasSeparator: boolean;
  if (isLocalMessage) {
    let maxPrecedingCreatedAt: number | undefined;
    for (let index = 0; index < currentIndex; index += 1) {
      const precedingCreatedAt = allMessages[index]?.createdAt;
      if (precedingCreatedAt !== undefined && (maxPrecedingCreatedAt === undefined || precedingCreatedAt > maxPrecedingCreatedAt)) {
        maxPrecedingCreatedAt = precedingCreatedAt;
      }
    }
    hasSeparator = maxPrecedingCreatedAt === undefined
      || (currentCreatedAt > maxPrecedingCreatedAt && !isSameDay(currentCreatedAt, maxPrecedingCreatedAt));
  } else {
    // https://stackoverflow.com/a/41855608
    hasSeparator = !(previousMessageCreatedAt && (isSameDay(currentCreatedAt, previousMessageCreatedAt)));
  }

  const hasNewMessageSeparator = (isLocalMessage || !isUnreadMessageExistInChannel?.current) ? false : (!isAdminMessage(currentMessage) && firstUnreadMessageId === currentMessage.messageId);

  return {
    chainTop,
    chainBottom,
    hasSeparator,
    hasNewMessageSeparator,
  };
};
