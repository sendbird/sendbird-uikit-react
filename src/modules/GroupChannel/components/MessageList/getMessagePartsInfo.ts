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
  // Phase 5.1.c — narrowed from `number | string` per audit (R-5 in
  // .agentic/p0-phase-5-1/plan.md): all internal writers pass `number`
  // (or `undefined`); the `string` union was unreachable defensive over-
  // typing. `null` added to align with reducer-side return types ahead
  // of a future consumer migration cycle.
  firstUnreadMessageId?: number | null | undefined;
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

  // https://stackoverflow.com/a/41855608
  const hasSeparator = isLocalMessage ? false : !(previousMessageCreatedAt && (isSameDay(currentCreatedAt, previousMessageCreatedAt)));

  const hasNewMessageSeparator = (isLocalMessage || !isUnreadMessageExistInChannel?.current) ? false : (!isAdminMessage(currentMessage) && firstUnreadMessageId === currentMessage.messageId);

  return {
    chainTop,
    chainBottom,
    hasSeparator,
    hasNewMessageSeparator,
  };
};
