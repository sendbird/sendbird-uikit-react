// import Sendbird from 'sendbird';
import Sendbird from '../../sendbird.min.js';

export const URL_REG = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
export const createUrlTester = (regexp: RegExp) => (text: string): boolean => regexp.test(text);
export const checkOGIsEnalbed = (message: Sendbird.UserMessage): boolean => {
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
