import { GroupChannel } from '@sendbird/chat/groupChannel';
import { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import isSameDay from 'date-fns/isSameDay';

import { compareMessagesForGrouping } from '../../context/utils';

export interface GetMessagePartsInfoProps {
  allMessages: Array<UserMessage | FileMessage | AdminMessage>;
  isMessageGroupingEnabled: boolean;
  currentIndex: number;
  currentMessage: UserMessage | FileMessage | AdminMessage;
  currentChannel: GroupChannel;
  replyType: string;
}

interface OutPuts {
  chainTop: boolean,
  chainBottom: boolean,
  hasSeparator: boolean,
}

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
  };
};
