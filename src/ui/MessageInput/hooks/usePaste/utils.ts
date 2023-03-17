import { GroupChannel } from '@sendbird/chat/groupChannel';
import { User } from '@sendbird/chat';

import {
  PASTE_NODE,
  MENTION_CLASS,
  TEXT_MESSAGE_CLASS,
  MENTION_CLASS_COMBINED_QUERY,
  MENTION_CLASS_IN_INPUT,
} from './consts';
import { Word } from './types';

export function createPasteNode(): HTMLDivElement | null {
  const pasteNode = document.body.querySelector(`#${PASTE_NODE}`);
  // remove existing paste node
  if (pasteNode) {
    pasteNode?.remove();
  }

  // create new paste node and return
  const node = document.createElement('div');
  node.id = PASTE_NODE;
  node.style.display = 'none';
  return node;
}

export function hasMention(parent: HTMLDivElement): boolean {
  return parent?.querySelector(MENTION_CLASS_COMBINED_QUERY) ? true : false;
}

export const extractTextFromNodes = (nodes: HTMLSpanElement[]): string => {
  let text = '';
  nodes.forEach((node) => {
    // to preserve space between words
    const textNodes = node.querySelectorAll(`.${TEXT_MESSAGE_CLASS}`);
    if (textNodes.length > 0) {
      text += ((extractTextFromNodes(Array.from(textNodes) as HTMLSpanElement[])) + ' ');
    }
    text += (node.innerText + ' ');
  });
  return text;
}

export function domToMessageTemplate(nodeArray: HTMLSpanElement[]): Word[] {
  const templates: Word[] = nodeArray?.reduce((accumulator, currentValue) => {
    let mentionNode = currentValue.querySelector(MENTION_CLASS_COMBINED_QUERY) as HTMLSpanElement;
    // sometimes the mention node is the parent node
    // in this case querySelector will return null
    if (!mentionNode) {
      mentionNode = (
        currentValue.classList.contains(MENTION_CLASS)  // for nodes copied from message
        || currentValue.classList.contains(MENTION_CLASS_IN_INPUT) // for nodes copied from input
      ) ? currentValue : null;
    }
    const text = currentValue.innerText;
    if (mentionNode) {
      const userId = mentionNode.dataset?.userid;
      return [
        ...accumulator,
        {
          text,
          userId,
        },
      ];
    }

    return [
      ...accumulator,
      {
        text,
      },
    ];
  }, [] as Word[]);
  return templates;
}

export function getUsersFromWords(templates: Word[], channel: GroupChannel): User[] {
  const userMap = {};
  const users = channel.members;
  templates.forEach((template) => {
    if (template.userId) {
      userMap[template.userId] = users.find((user) => user.userId === template.userId);
    }
  });
  return Object.values(userMap);
}
