// import Sendbird from 'sendbird';
import Sendbird from '../sendbird.min.js';
import { ClientUserMessage, ClientFileMessage } from '../index';

const OpenChannelMessageStatusTypes = {
  NONE: 'none',
  PENDING: 'pending',
  FAILED: 'failed',
  CANCELED: 'canceled',
  SUCCEEDED: 'succeeded'
};

export const getSenderFromMessage = (message: ClientUserMessage | ClientFileMessage): Sendbird.User => {
  return message.sender || message._sender;
};

export const checkIsSent = (status: string): boolean => (status === OpenChannelMessageStatusTypes.SUCCEEDED);
export const checkIsPending = (status: string): boolean => (status === OpenChannelMessageStatusTypes.PENDING);
export const checkIsFailed = (status: string): boolean => (status === OpenChannelMessageStatusTypes.FAILED);

export const checkIsByMe = (message: ClientFileMessage | ClientUserMessage, userId: string): boolean => (getSenderFromMessage(message).userId === userId);

interface isFineCopyParams {
  message: ClientUserMessage;
  status: string;
  userId: string;
}
export const isFineCopy = ({ message }: isFineCopyParams): boolean => {
  return (message.messageType === 'user' && message.message.length > 0);
};

interface isFineResendParams {
  message: ClientFileMessage | ClientUserMessage;
  status: string;
  userId: string;
}
export const isFineResend = ({ message, status, userId }: isFineResendParams): boolean => {
  return checkIsByMe(message, userId)
    && checkIsFailed(status)
    && message.isResendable
    && message.isResendable();
};

interface isFineEditParams {
  message: ClientUserMessage;
  status: string;
  userId: string;
}
export const isFineEdit = ({ message, status, userId }: isFineEditParams): boolean => {
  return checkIsByMe(message, userId) && checkIsSent(status);
};

interface isFineDeleteParams {
  message: ClientFileMessage | ClientUserMessage;
  status: string;
  userId: string;
}
export const isFineDelete = ({ message, userId }: isFineDeleteParams): boolean => {
  return checkIsByMe(message, userId);
};

interface showMenuTriggerParams {
  message: ClientUserMessage | ClientFileMessage;
  status: string;
  userId: string;
}
export const showMenuTrigger = (props: showMenuTriggerParams): boolean => {
  const { message, status, userId } = props;
  if (message.messageType === 'user') {
    return (
      isFineDelete({ message, status, userId })
      || isFineEdit({ message, status, userId })
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
