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
export const isMobileWKWebviewOrSafari = (userAgent: string) => {
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isChromeIOS = /CriOS/i.test(userAgent);
  const isWKWebview = /WebKit/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent);

  return isIOS && !isChromeIOS && (isWKWebview || isSafari);
};

export default {
  getSenderName,
  getSenderProfileUrl,
};
