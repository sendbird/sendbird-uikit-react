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
export const isAboutSame = (a: number, b: number, px: number) => Math.abs(a - b) <= px;
export const isMobileIOS = (userAgent: string) => {
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isWebkit = /WebKit/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent);

  return isIOS && (isWebkit || isSafari);
};

export const deleteNullish = <T extends Record<string, any>>(props: T): Partial<T> => {
  const copied = { ...props };
  Object.entries(copied).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      delete copied[key as keyof T];
    }
  });
  return copied;
};

export default {
  getSenderName,
  getSenderProfileUrl,
};
