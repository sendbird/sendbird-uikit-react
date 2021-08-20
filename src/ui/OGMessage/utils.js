import format from 'date-fns/format';
import MessageStatusType from '../MessageStatus/type';

export const createUrlTester = (regexp) => (text) => regexp.test(text);

export const getIsSentFromStatus = (status) => (
  status === MessageStatusType.SENT
  || status === MessageStatusType.DELIVERED
  || status === MessageStatusType.READ
);

export const copyToClipboard = (text) => {
  try {
    if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path
      // to prevent textarea being shown while dialog is visible.
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
  } catch (err) {
    return err;
  }
};

export const getSenderProfileUrl = (message) => message.sender && message.sender.profileUrl;

export const getSenderName = (message) => (
  message.sender && (
    message.sender.friendName
    || message.sender.nickname
    || message.sender.userId
  )
);

export const getMessageCreatedAt = (message) => format(message.createdAt, 'p');

export const checkOGIsEnalbed = (message) => {
  const { ogMetaData } = message;
  if (!ogMetaData) {
    return false;
  }
  const { url } = ogMetaData;
  if (!url) {
    return false;
  }
  return true;
};

export const getIsSentFromSendingStatus = (message = {}) => {
  if (message.sendingStatus && typeof message.sendingStatus === 'string') {
    return message.sendingStatus === 'none' || message.sendingStatus === 'succeeded';
  }
  return false;
};

export default {
  getSenderName,
  createUrlTester,
  copyToClipboard,
  checkOGIsEnalbed,
  getMessageCreatedAt,
  getIsSentFromStatus,
  getSenderProfileUrl,
  getIsSentFromSendingStatus,
};
