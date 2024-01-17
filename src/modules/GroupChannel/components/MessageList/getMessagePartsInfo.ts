import { GroupChannel } from '@sendbird/chat/groupChannel';
import isSameDay from 'date-fns/isSameDay';

import { compareMessagesForGrouping } from '../../../../utils/messages';
import { ReplyType } from '../../../../types';
import { CoreMessageType } from '../../../../utils';

export interface GetMessagePartsInfoProps {
  allMessages: Array<CoreMessageType>;
  isMessageGroupingEnabled: boolean;
  currentIndex: number;
  currentMessage: CoreMessageType;
  currentChannel: GroupChannel;
  replyType: string;
}

interface OutPuts {
  chainTop: boolean,
  chainBottom: boolean,
  hasSeparator: boolean,
}

/**
 * exported, should be backward compatible
 */
export const getMessagePartsInfo = ({
  allMessages = [],
  isMessageGroupingEnabled = true,
  currentIndex = 0,
  currentMessage = null,
  currentChannel = null,
  replyType = '',
}: GetMessagePartsInfoProps): OutPuts => {
  const previousMessage = allMessages[currentIndex - 1];
  const nextMessage = allMessages[currentIndex + 1];
  const [chainTop, chainBottom] = isMessageGroupingEnabled
    ? compareMessagesForGrouping(previousMessage, currentMessage, nextMessage, currentChannel, (replyType as ReplyType))
    : [false, false];
  const previousMessageCreatedAt = previousMessage?.createdAt;
  const currentCreatedAt = currentMessage.createdAt;

  // NOTE: for pending/failed messages
  const isLocalMessage = 'sendingStatus' in currentMessage && (currentMessage.sendingStatus !== 'succeeded');

  // https://stackoverflow.com/a/41855608
  const hasSeparator = isLocalMessage ? false : !(previousMessageCreatedAt && (isSameDay(currentCreatedAt, previousMessageCreatedAt)));
  return {
    chainTop,
    chainBottom,
    hasSeparator,
  };
};
