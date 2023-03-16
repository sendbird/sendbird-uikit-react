import { useCallback } from 'react';
import DOMPurify from 'dompurify';

import { inserTemplateToDOM } from './insertTemplate';
import { sanitizeString } from '../../utils';
import { DynamicProps } from './types';
import { TEXT_MESSAGE_CLASS } from './consts';
import {
  createPasteNode,
  hasMention,
  domToMessageTemplate,
  getUsersFromWords,
} from './utils';

export default function usePaste({
  ref,
  setIsInput,
  setHeight,
  channel,
  setMentionedUsers,
}: DynamicProps) {
  return useCallback((e) => {
    e.preventDefault();
    // getCaretPosition(e.target);
    const html = e?.clipboardData.getData('text/html');
    // simple text, continue as normal
    if (!html) {
      const text = e?.clipboardData.getData('text');
      document.execCommand('insertHTML', false, sanitizeString(text));
      setIsInput(true);
      setHeight();
      return;
    }

    // has html, check if there are mentions, sanitize and insert
    const purifier = DOMPurify(window);
    const clean = purifier.sanitize(html);
    const pasteNode = createPasteNode();
    pasteNode.innerHTML = clean;

    // does not have mention, continue as normal
    if (!hasMention(pasteNode)) {
      const text = e?.clipboardData.getData('text');
      document.execCommand('insertHTML', false, sanitizeString(text));
      pasteNode.remove();
      setIsInput(true);
      setHeight();
      return;
    }

    // has nickname, sanitize and insert
    const childNodes = pasteNode.querySelectorAll(`.${TEXT_MESSAGE_CLASS}`) as NodeListOf<HTMLSpanElement>;
    const nodeArray = Array.from(childNodes);
    const words = domToMessageTemplate(nodeArray);

    const mentionedUsers = getUsersFromWords(words, channel);
    setMentionedUsers(mentionedUsers);
    inserTemplateToDOM(words, ref.current);
    pasteNode.remove();
    setIsInput(true);
    setHeight();
    return;

  }, [ref, setIsInput, setHeight, channel, setMentionedUsers]);
}
