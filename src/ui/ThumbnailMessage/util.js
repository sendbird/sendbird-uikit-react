import format from 'date-fns/format';
import MessageStatusType from '../MessageStatus/type';

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const getIsSentFromStatus = (status) => (
  status === MessageStatusType.SENT
  || status === MessageStatusType.DELIVERED
  || status === MessageStatusType.READ
);

export default {
  getMessageCreatedAt,
  getIsSentFromStatus,
};
