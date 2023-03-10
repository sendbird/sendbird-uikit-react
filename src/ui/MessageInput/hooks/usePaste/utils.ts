import { PASTE_NODE, MENTION_CLASS } from './consts';
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
  return parent?.querySelector(`.${MENTION_CLASS}`) ? true : false;
}

export function domToMessageTemplate(nodeArray: HTMLSpanElement[]): Word[] {
  const templates: Word[] = nodeArray?.reduce((accumulator, currentValue) => {
    const mentionNode = currentValue.querySelector(`.${MENTION_CLASS}`) as HTMLSpanElement;
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

export function generateUniqueUserIds(templates: Word[]): string[] {
  const uniqueUserIds = new Set<string>();
  templates.forEach((template) => {
    if (template.userId) {
      uniqueUserIds.add(template.userId);
    }
  });
  return Array.from(uniqueUserIds);
}
