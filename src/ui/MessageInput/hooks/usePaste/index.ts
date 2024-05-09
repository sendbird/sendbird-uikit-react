import React, { useCallback } from 'react';
import DOMPurify from 'dompurify';

import { inserTemplateToDOM } from './insertTemplate';
import { sanitizeString } from '../../utils';
import { DynamicProps } from './types';
import { createPasteNode, domToMessageTemplate, extractTextFromNodes, getLeafNodes, getUsersFromWords, hasMention } from './utils';

// exported, should be backward compatible
// conditions to test:
// 1. paste simple text
// 2. paste text with mention
// 3. paste text with mention and text
// 4. paste text with mention and text and paste again before and after
// 5. copy message with mention(only one mention, no other text) and paste
// 6. copy message with mention from input and paste(before and after)
export function usePaste({
  ref,
  setIsInput,
  setHeight,
  channel,
  setMentionedUsers,
}: DynamicProps): (e: React.ClipboardEvent<HTMLDivElement>) => void {
  return useCallback((e) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    // simple text, continue as normal
    if (!html) {
      const text = e.clipboardData.getData('text') || getURIListText(e);
      document.execCommand('insertHTML', false, sanitizeString(text));
      setIsInput(true);
      setHeight();
      return;
    }

    // has html, check if there are mentions, sanitize and insert
    const purifier = DOMPurify(window);
    const clean = purifier.sanitize(html);
    const pasteNode = createPasteNode();
    if (pasteNode) {
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

      // has mention, collect leaf nodes and parse words
      const leafNodes = getLeafNodes(pasteNode);
      const words = domToMessageTemplate(leafNodes);
      const mentionedUsers = channel.isGroupChannel() ? getUsersFromWords(words, channel) : [];

      // side effects
      setMentionedUsers(mentionedUsers);
      inserTemplateToDOM(words);
      pasteNode.remove();
    }

    setIsInput(true);
    setHeight();
  }, [ref, setIsInput, setHeight, channel, setMentionedUsers]);
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#dragging_links
function getURIListText(e: React.ClipboardEvent<HTMLDivElement>) {
  const pasteData = e.clipboardData.getData('text/uri-list');
  if (pasteData.length === 0) return '';

  return pasteData
    .split('\n')
    .reduce((accumulator, line) => {
      const txt = line.trim();
      if (txt !== '' && !txt.startsWith('#')) {
        accumulator += txt + '\n';
      }
      return accumulator;
    }, '');
}

// to do -> In the future donot export default
export default usePaste;
