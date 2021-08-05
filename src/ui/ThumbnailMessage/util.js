import format from 'date-fns/format';
import { getOutgoingMessageStates } from '../../utils';

const MessageStatusType = getOutgoingMessageStates();

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const getIsSentFromStatus = (status) => (
  status === MessageStatusType.SENT
  || status === MessageStatusType.DELIVERED
  || status === MessageStatusType.READ
);

export const getIsSentFromSendingStatus = (message = {}) => {
  if (message.sendingStatus && typeof message.sendingStatus === 'string') {
    return message.sendingStatus === 'none' || message.sendingStatus === 'succeeded';
  }
  return false;
};

export default {
  getMessageCreatedAt,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
};
