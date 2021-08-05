import { getOutgoingMessageStates } from '../../utils';

const MessageStatusType = getOutgoingMessageStates();

export const truncate = (fullStr, strLen) => {
  if (fullStr === null || fullStr === undefined) return '';
  if (fullStr.length <= strLen) return fullStr;
  const separator = '...';
  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};

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
  truncate,
  getIsSentFromStatus,
  getIsSentFromSendingStatus,
};
