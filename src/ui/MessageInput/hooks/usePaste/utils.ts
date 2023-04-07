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
import { TEXT_MESSAGE_BODY_CLASSNAME } from "../../../TextMessageItemBody/consts";
import { OG_MESSAGE_BODY_CLASSNAME } from '../../../OGMessageItemBody/consts';

export function querySelectorIncludingSelf(
  master: HTMLElement,
  selector: string,
): HTMLElement | null {
  const result = [
    master,
    ...Array.from(master.querySelectorAll(selector))
  ].find((el) => el.matches(selector)) as HTMLElement | null;
  return result;
}

// Pasted dom node can be OG_MESSAGE or partial message or full message
// full messsage would have TEXT_MESSAGE_BODY_CLASSNAME and have childNodes
// partial message would not have TEXT_MESSAGE_BODY_CLASSNAME
export function getLeafNodes(master: HTMLElement): ChildNode[] {
  // og message
  const ogMessage = querySelectorIncludingSelf(master, `.${OG_MESSAGE_BODY_CLASSNAME}`);
  if (ogMessage) {
    return Array.from(ogMessage.childNodes);
  }

  const textMessageBody = querySelectorIncludingSelf(master, `.${TEXT_MESSAGE_BODY_CLASSNAME}`);
  if (textMessageBody) {
    return Array.from(textMessageBody.childNodes);
  }

  return Array.from(master.childNodes);
}

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

export function domToMessageTemplate(nodeArray: ChildNode[]): Word[] {
  const templates: Word[] = nodeArray?.reduce((accumulator, currentValue) => {
    // currentValue can be node(from messageBody or messageInput) or text
    let mentionNode;
    // this looks awkward, but it is a fallback to set default text
    let text = (currentValue as HTMLSpanElement)?.innerText;

    // if text node, set text
    if (currentValue instanceof Text) {
      mentionNode = false;
      text = currentValue.textContent;
    }

    if (currentValue instanceof HTMLElement) {
      mentionNode = (currentValue.classList.contains(MENTION_CLASS) || currentValue.classList.contains(MENTION_CLASS_IN_INPUT))
        ? currentValue
        : currentValue.querySelector(MENTION_CLASS_COMBINED_QUERY);
    }

    // if mentionNode is not null, it is a mention
    if (mentionNode) {
      const text = (currentValue as HTMLSpanElement)?.innerText;
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
      const mentionedMember = users.find((user) => user.userId === template.userId);
      // Object.values would return array-> [undefined] if the user is not in the channel
      if (mentionedMember) {
        userMap[template.userId] = mentionedMember;
      }
    }
  });
  return Object.values(userMap);
}
