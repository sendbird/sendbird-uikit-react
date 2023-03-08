import { AdminMessage, BaseMessage, FileMessage } from '@sendbird/chat/message';
import isSameDay from 'date-fns/isSameDay';

import { compareMessagesForGrouping } from '../../context/utils';

export interface GetMessagePartsInfoProps {
  allMessages: Array<BaseMessage | FileMessage | AdminMessage>,
  isMessageGroupingEnabled,
  currentIndex,
  currentMessage,
  currentChannel,
  replyType,
}

interface OutPuts {
  chainTop: boolean,
  chainBottom: boolean,
  hasSeparator: boolean,
}

export const getMessagePartsInfo = ({
  allMessages,
  isMessageGroupingEnabled,
  currentIndex,
  currentMessage,
  currentChannel,
  replyType,
}: GetMessagePartsInfoProps): OutPuts => {
  const previousMessage = allMessages[currentIndex - 1];
  const nextMessage = allMessages[currentIndex + 1];
  const [chainTop, chainBottom] = isMessageGroupingEnabled
    ? compareMessagesForGrouping(previousMessage, currentMessage, nextMessage, currentChannel, replyType)
    : [false, false];
  const previousMessageCreatedAt = previousMessage?.createdAt;
  const currentCreatedAt = currentMessage.createdAt;
  // https://stackoverflow.com/a/41855608
  const hasSeparator = !(previousMessageCreatedAt && (
    isSameDay(currentCreatedAt, previousMessageCreatedAt)
  ));
  return {
    chainTop,
    chainBottom,
    hasSeparator,
  }
};
