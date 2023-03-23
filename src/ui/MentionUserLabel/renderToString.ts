// cretes a sanitized string from a mention user label
import DOMPurify from 'dompurify';
import { MENTION_CLASS } from '../MessageInput/hooks/usePaste/consts';
import { MENTION_USER_LABEL_CLASSNAME } from './consts';

type renderToStringParams = {
  userId: string;
  nickname: string;
};

export default function renderToString({ userId, nickname }: renderToStringParams): string {
  // donot change this template, it wont work
  const el = `<span data-userid="${userId}" data-sb-mention="true" class="${MENTION_USER_LABEL_CLASSNAME}">${nickname}</span>`;
  const purifier = DOMPurify(window);
  const sanitized_ = purifier.sanitize(el);
  const token = sanitized_.split(' ');
  const [spanTag, ...rest] = token;
  // we do this because DOMPurify removes the contenteditable attribute
  const sanitized = [spanTag, 'contenteditable="false"', ...rest].join(' ');
  return sanitized;
}
