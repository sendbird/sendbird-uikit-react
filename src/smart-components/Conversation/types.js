import { isImage, isVideo } from '../../ui/FileViewer/types';

export const MessageTypes = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  FILE: 'FILE',
  THUMBNAIL: 'THUMBNAIL',
  OG: 'OG',
};

export const SendingMessageStatus = {
  NONE: 'none',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  PENDING: 'pending',
};

export const getMessageType = (message) => {
  if ((message.isUserMessage && message.isUserMessage()) || message.messageType === 'user') {
    return (message.ogMetaData)
      ? MessageTypes.OG
      : MessageTypes.USER;
  }
  if (message.isAdminMessage && message.isAdminMessage()) {
    return MessageTypes.ADMIN;
  }
  if ((message.isFileMessage && message.isFileMessage()) || message.messageType === 'file') {
    return (isImage(message.type) || isVideo(message.type))
      ? MessageTypes.THUMBNAIL
      : MessageTypes.FILE;
  }
  return '';
};

export default {
  MessageTypes,
  SendingMessageStatus,
  getMessageType,
};
