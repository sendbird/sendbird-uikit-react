import format from 'date-fns/format';

export const noop = () => {};

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const getSenderName = (message) => (
  message.sender && (
    message.sender.friendName
    || message.sender.nickname
    || message.sender.userId
  )
);

export const getSenderProfileUrl = (message) => message.sender && message.sender.profileUrl;

export default {
  getMessageCreatedAt,
  getSenderName,
  getSenderProfileUrl,
};
