import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import isToday from 'date-fns/isToday';
import isYesterday from 'date-fns/isYesterday';
import { IconTypes } from '../Icon';

export function getCreatedAt(createdAt: number, locale: Locale): string {
  const optionalParam = locale ? { locale } : null;
  if (!createdAt) {
    return '';
  }
  if (isToday(createdAt)) {
    return format(createdAt, 'p', optionalParam);
  }
  if (isYesterday(createdAt)) {
    return formatRelative(createdAt, new Date(), optionalParam);
  }
  return format(createdAt, 'MMM dd', optionalParam);
}

export function getIconOfFileType(message: SendbirdUIKit.ClientFileMessage): string {
  const { url } = message;
  const fileMessageUrl = url;
  const fileExtension = (fileMessageUrl.match(/\.([^.]*?)(?=\?|#|$)/))[1];

  if (/(jpg|jpeg|png)$/i.test(fileExtension)) {
    return IconTypes.PHOTO;
  } else if (/mp4$/i.test(fileExtension)) {
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
