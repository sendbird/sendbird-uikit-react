import type { FileMessage } from '@sendbird/chat/message';
import type { Locale } from 'date-fns';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import isThisYear from 'date-fns/isThisYear';
import isYesterday from 'date-fns/isYesterday';
import { IconTypes } from '../Icon';
import { isVoiceMessage } from '../../utils';
import { getMessageFirstFileUrl } from '../QuoteMessage/utils';
import { MultipleFilesMessage } from '@sendbird/chat/message';

export interface GetCreatedAtProps {
  createdAt: number;
  locale?: Locale;
  stringSet?: Record<string, string>;
}

export function getCreatedAt({ createdAt, locale, stringSet }: GetCreatedAtProps): string {
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return stringSet?.MESSAGE_STATUS__YESTERDAY || 'Yesterday';
  }
  if (isThisYear(createdAt)) {
    return format(createdAt, 'MMM d', optionalParam);
  }
  return format(createdAt, 'yyyy/M/d', optionalParam);
}

export function getIconOfFileType(message: FileMessage | MultipleFilesMessage): string {
  const fileMessageUrl = getMessageFirstFileUrl(message) ?? '';
  const fileExtension = (fileMessageUrl.match(/\.([^.]*?)(?=\?|#|$)/))?.[1] ?? '';

  if (/(jpg|jpeg|png)$/i.test(fileExtension)) {
    return IconTypes.PHOTO;
  } else if (/mp4$/i.test(fileExtension) || isVoiceMessage(message)) {
    return IconTypes.PLAY;
  } else if (/mp3/i.test(fileExtension)) {
    return IconTypes.FILE_AUDIO;
  } else if (/gif/i.test(fileExtension)) {
    return IconTypes.GIF;
  } else {
    return IconTypes.FILE_DOCUMENT;
  }
}

export function truncate(fullText: string, textLimit: number): string {
  if (fullText.length <= textLimit) return fullText;
  const separator = '...';
  const sepLen = separator.length;
  const charsToShow = textLimit - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return fullText.substr(0, frontChars) + separator + fullText.substr(fullText.length - backChars);
}
