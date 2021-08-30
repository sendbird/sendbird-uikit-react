import format from 'date-fns/format';
import { getOutgoingMessageStates } from '../../../utils';

const MessageStatusType = getOutgoingMessageStates();

export const copyToClipboard = (text) => {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData('Text', text);
  }
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand('copy'); // Security exception may be thrown by some browsers.
    } catch (ex) {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
  return false;
};

export const getMessageCreatedAt = (message) => format(message.createdAt || 0, 'p');

export const getSenderName = (message) => (
  message.sender && (
    message.sender.friendName
    || message.sender.nickname
    || message.sender.userId
  )
);

export const getSenderProfileUrl = (message) => message.sender && message.sender.profileUrl;

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

export const createUrlTester = (regexp) => (text) => regexp.test(text);

export default {
  copyToClipboard,
  getMessageCreatedAt,
  getSenderName,
  getSenderProfileUrl,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
  createUrlTester,
};
