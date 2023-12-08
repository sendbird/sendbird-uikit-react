import type { User } from '@sendbird/chat';
import type { UserMessage } from '@sendbird/chat/message';
import { SendableMessageType } from './index';

const OpenChannelMessageStatusTypes = {
  NONE: 'none',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded',
};

export const getSenderFromMessage = (message: SendableMessageType): User => {
  // @ts-ignore
  return message.sender || message._sender;
};

export const checkIsSent = (status: string): boolean => (status === OpenChannelMessageStatusTypes.SUCCEEDED);
export const checkIsPending = (status: string): boolean => (status === OpenChannelMessageStatusTypes.PENDING);
export const checkIsFailed = (status: string): boolean => (status === OpenChannelMessageStatusTypes.FAILED);

export const checkIsByMe = (message: SendableMessageType, userId: string): boolean => (getSenderFromMessage(message).userId === userId);

interface isFineCopyParams {
  message: UserMessage;
  status: string;
  userId: string;
}
export const isFineCopy = ({ message }: isFineCopyParams): boolean => {
  return (message?.messageType === 'user' && message?.message?.length > 0);
};

interface isFineResendParams {
  message: SendableMessageType;
  status: string;
  userId: string;
}
export const isFineResend = ({ message, status, userId }: isFineResendParams): boolean => {
  return checkIsByMe(message, userId)
    && checkIsFailed(status)
    // @ts-ignore
    && message?.isResendable;
};

interface isFineEditParams {
  message: SendableMessageType;
  status: string;
  userId: string;
}
export const isFineEdit = ({ message, status, userId }: isFineEditParams): boolean => {
  return checkIsByMe(message, userId) && checkIsSent(status) && message?.isUserMessage?.();
};

interface isFineDeleteParams {
  message: SendableMessageType;
  status: string;
  userId: string;
}
export const isFineDelete = ({ message, userId }: isFineDeleteParams): boolean => {
  return checkIsByMe(message, userId);
};

interface IsFineDownloadParams {
  message: SendableMessageType;
  status: string;
}

export const isFineDownload = ({ message, status }: IsFineDownloadParams): boolean => {
  if (message?.isFileMessage?.() && checkIsSent(status)) {
    return true;
  }
  return false;
};

interface showMenuTriggerParams {
  message: SendableMessageType;
  status: string;
  userId: string;
}
export const showMenuTrigger = (props: showMenuTriggerParams): boolean => {
  const { message, status, userId } = props;
  // @ts-ignore
  if (message.messageType === 'user') {
    return (
      isFineDelete({ message, status, userId })
      || isFineEdit({ message, status, userId })
      // @ts-ignore
      || isFineCopy({ message, status, userId })
      || isFineResend({ message, status, userId })
    );
  } else {
    return (
      isFineDelete({ message, status, userId })
      || isFineResend({ message, status, userId })
    );
  }
};
