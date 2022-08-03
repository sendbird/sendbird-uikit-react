import { AdminMessage, FileMessage, UserMessage } from '@sendbird/chat/message';
import { isImage, isVideo } from '../../../../ui/FileViewer/types';

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

export const getMessageType = (message: UserMessage | FileMessage | AdminMessage): string => {
  if ((message?.isUserMessage?.()) || message?.messageType === 'user') {
    return (message?.ogMetaData)
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
