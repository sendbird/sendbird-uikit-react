import { SendableMessageType } from './index';

/**
 * @param ms - milliseconds to delay
 * @returns Promise that resolves after the specified time
 */
export const delay = (ms?: number) => new Promise((resolve) => { setTimeout(resolve, ms); });
export const noop = () => {
  /** noop * */
};
export const getSenderProfileUrl = (message: SendableMessageType) => message.sender && message.sender.profileUrl;
export const getSenderName = (message: SendableMessageType) => message.sender && (message.sender.friendName || message.sender.nickname || message.sender.userId);
export const isAboutSame = (a: number, b: number, px: number) => Math.abs(a - b) <= px;

export const deleteNullish = <T>(obj: T): T => {
  const cleaned = {} as T;
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cleaned[key as keyof T] = value as T[keyof T];
    }
  });
  return cleaned;
};

export function openURL(url?: string | null) {
  let safeURL = url;
  if (safeURL) {
    if (!safeURL.startsWith('http://') && !safeURL.startsWith('https://')) {
      safeURL = 'https://' + safeURL;
    }
    window.open(safeURL, '_blank', 'noopener,noreferrer');
  }
}

type Falsy = undefined | null | false | 0 | '';
export function classnames(...args: (string | Falsy)[]) {
  return args.filter(Boolean).join(' ');
}

export default {
  getSenderName,
  getSenderProfileUrl,
};
