import { Word } from './types';
import { sanitizeString } from '../../utils';
import renderMentionLabelToString from '../../../MentionUserLabel/renderToString';

export function inserTemplateToDOM(templateList: Word[]): void {
  const nodes = templateList.map((template) => {
    const { text, userId } = template;
    if (userId) {
      return renderMentionLabelToString({ userId, nickname: text });
    }
    return sanitizeString(text);
  })
    .join(' ')
  // add a space at the end of the mention, else cursor/caret wont work
    .concat(' ');
  document.execCommand('insertHTML', false, nodes);
}
