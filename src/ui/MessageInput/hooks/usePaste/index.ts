import { useCallback } from 'react';
import DOMPurify from 'dompurify';

import { inserTemplateToDOM } from './insertTemplate';
import { sanitizeString } from '../../utils';
import { DynamicProps } from './types';
import { MENTION_CLASS_COMBINED_QUERY, MENTION_CLASS_IN_INPUT, TEXT_MESSAGE_CLASS } from './consts';
import {
  createPasteNode,
  hasMention,
  domToMessageTemplate,
  getUsersFromWords,
  extractTextFromNodes,
} from './utils';

// conditions to test:
// 1. paste simple text
// 2. paste text with mention
// 3. paste text with mention and text
// 4. paste text with mention and text and paste again before and after
// 5. copy message with mention(only one mention, no other text) and paste
// 6. copy message with mention from input and paste(before and after)
export default function usePaste({
  ref,
  setIsInput,
  setHeight,
  channel,
  setMentionedUsers,
}: DynamicProps): (e: React.ClipboardEvent<HTMLDivElement>) => void {
  return useCallback((e) => {
    e.preventDefault();
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
      // to preserve space between words
      const text = extractTextFromNodes(Array.from(pasteNode.children) as HTMLSpanElement[]);
      document.execCommand('insertHTML', false, sanitizeString(text));
      pasteNode.remove();
      setIsInput(true);
      setHeight();
      return;
    }

    // has mention, sanitize and insert
    let childNodes = pasteNode.querySelectorAll(`.${TEXT_MESSAGE_CLASS}`) as NodeListOf<HTMLSpanElement>;
    if (pasteNode.querySelectorAll(`.${MENTION_CLASS_IN_INPUT}`).length > 0) {
      // @ts-ignore
      childNodes = pasteNode.children;
    }
    let nodeArray = Array.from(childNodes);
    // handle paste when there is only one child
    if (pasteNode.children.length === 1 && pasteNode.querySelectorAll(MENTION_CLASS_COMBINED_QUERY).length === 1) {
      nodeArray = Array.from(pasteNode.children) as HTMLSpanElement[];
    }
    const words = domToMessageTemplate(nodeArray);

    const mentionedUsers = getUsersFromWords(words, channel);
    setMentionedUsers(mentionedUsers);
    inserTemplateToDOM(words);
    pasteNode.remove();
    setIsInput(true);
    setHeight();
    return;

  }, [ref, setIsInput, setHeight, channel, setMentionedUsers]);
}
