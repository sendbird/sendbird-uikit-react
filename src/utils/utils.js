export const noop = () => {};

export const getSenderName = (message) => (
  message.sender && (
    message.sender.friendName
    || message.sender.nickname
    || message.sender.userId
  )
);

export const getSenderProfileUrl = (message) => message.sender && message.sender.profileUrl;

export default {
  getSenderName,
  getSenderProfileUrl,
};
