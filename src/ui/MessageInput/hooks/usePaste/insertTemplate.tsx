import React from 'react';
import { renderToString } from 'react-dom/server';

import { Word } from './types';
import { sanitizeString } from '../../utils';
import MentionUserLabel from '../../../MentionUserLabel';

export function inserTemplateToDOM(templateList: Word[], parent: HTMLDivElement): string {
  const nodes = templateList.map((template) => {
    const { text, userId } = template;
    if (userId) {
      return (
        renderToString(
          <>
            <MentionUserLabel userId={userId}>
              {text}
            </MentionUserLabel>
            {/* if this is not here, cursor wont work */}
            &nbsp;
          </>
        )
      );
    }
    return sanitizeString(text);
  }).join(' ');
  document.execCommand('insertHTML', false, nodes);
}
