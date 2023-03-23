// cretes a sanitized string from a mention user label
import DOMPurify from 'dompurify';

type renderToStringParams = {
  userId: string;
  nickname: string;
};

export default function renderToString({ userId, nickname }: renderToStringParams): string {
  const el = `
    <span
      contenteditable='false'
      data-userid="${userId}"
      data-sendbird-mention="true"
      class="sendbird-mention-user-label"
    >
      ${nickname}
    </span>
  `;
  const purifier = DOMPurify(window);
  const sanitized = purifier.sanitize(el, { ALLOWED_TAGS: ['span'] });
  return sanitized;
}
