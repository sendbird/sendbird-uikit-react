import { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import { isImage, isVideo } from '../../../../ui/FileViewer/types';
import { CoreMessageType } from '../../../../utils';

export const MessageTypes = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  FILE: 'FILE',
  THUMBNAIL: 'THUMBNAIL',
  OG: 'OG',
  UNKNOWN: 'UNKNOWN',
};

export const SendingMessageStatus = {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending',
};

type MessageTypeOptions = {
  isOgMessageEnabledInOpenChannel?: boolean;
};

export const getMessageType = (
  message: CoreMessageType,
  options?: MessageTypeOptions,
): string => {
  const isOgMessageEnabledInOpenChannel = options?.isOgMessageEnabledInOpenChannel;
  if ((message?.isUserMessage?.()) || message?.messageType === 'user') {
    return (message?.ogMetaData && isOgMessageEnabledInOpenChannel)
      ? MessageTypes.OG
      : MessageTypes.USER;
  }
  if (message?.isAdminMessage?.()) {
    return MessageTypes.ADMIN;
  }
  if (message?.messageType === 'file') {
    return (isImage((message as FileMessage).type) || isVideo((message as FileMessage).type))
      ? MessageTypes.THUMBNAIL
      : MessageTypes.FILE;
  }
  return MessageTypes.UNKNOWN;
};

export default {
  MessageTypes,
  SendingMessageStatus,
  getMessageType,
};
