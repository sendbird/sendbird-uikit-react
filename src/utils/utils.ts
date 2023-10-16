import { SendableMessageType } from './index';

export const noop = () => { /** noop * */ };
export const getSenderProfileUrl = (message: SendableMessageType) => message.sender && message.sender.profileUrl;
export const getSenderName = (message: SendableMessageType) => (
  message.sender && (
    message.sender.friendName
    || message.sender.nickname
    || message.sender.userId
  )
);

export default {
  getSenderName,
  getSenderProfileUrl,
};
