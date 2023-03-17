import React from 'react';
import { renderToString } from 'react-dom/server';

import { Word } from './types';
import { sanitizeString } from '../../utils';
import MentionUserLabel from '../../../MentionUserLabel';

export function inserTemplateToDOM(templateList: Word[]): void {
  const nodes = templateList.map((template) => {
    const { text, userId } = template;
    if (userId) {
      return (
        renderToString(
          <>
            <MentionUserLabel userId={userId}>
              {text}
            </MentionUserLabel>
          </>
        )
      );
    }
    return sanitizeString(text);
  })
  .join(' ')
  // add a space at the end of the mention, else cursor/caret wont work
  .concat(' ');
  document.execCommand('insertHTML', false, nodes);
}
