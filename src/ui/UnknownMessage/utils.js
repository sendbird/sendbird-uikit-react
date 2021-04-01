import format from 'date-fns/format';

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export default {
  getMessageCreatedAt,
};
