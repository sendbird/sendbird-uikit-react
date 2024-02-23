// Sanitize that special characters of HTML tags cause XSS issue
import { BaseChannel } from '@sendbird/chat';
import { NodeNames, NodeTypes } from './const';
import { USER_MENTION_TEMP_CHAR } from '../../modules/GroupChannel/context/const';

export const sanitizeString = (str?: string) => {
  return str?.replace(/[\u00A0-\u9999<>]/gim, (i) => ''.concat('&#', String(i.charCodeAt(0)), ';'));
};

/**
 * NodeList cannot be used with Array methods
 * @param {NodeListOf<ChildNode>} childNodes
 * @returns Array of child nodes
 */
export const nodeListToArray = (childNodes?: Node['childNodes'] | null) => {
  try {
    return Array.from(childNodes);
  } catch (error) {
    return [];
  }
};

export function isChannelTypeSupportsMultipleFilesMessage(channel: BaseChannel) {
  return channel && channel.isGroupChannel?.() && !channel.isBroadcast && !channel.isSuper;
}

// Type guard: This function ensures that the node contains `innerText` and `dataset` properties
function isHTMLElement(node: ChildNode): node is HTMLElement {
  return node.nodeType === NodeTypes.ElementNode;
}

export function extractTextAndMentions(childNodes: NodeListOf<ChildNode>) {
  let messageText = '';
  let mentionTemplate = '';
  childNodes.forEach((node) => {
    if (isHTMLElement(node) && node.nodeName === NodeNames.Span) {
      const { innerText, dataset = {} } = node;
      const { userid = '' } = dataset;
      messageText += innerText;
      mentionTemplate += `${USER_MENTION_TEMP_CHAR}{${userid}}`;
    } else if (isHTMLElement(node) && node.nodeName === NodeNames.Br) {
      messageText += '\n';
      mentionTemplate += '\n';
    } else if (isHTMLElement(node) && node.nodeName === NodeNames.Div) {
      const { textContent = '' } = node;
      messageText += `\n${textContent}`;
      mentionTemplate += `\n${textContent}`;
    } else {
      const { textContent = '' } = node;
      messageText += textContent;
      mentionTemplate += textContent;
    }
  });
  return { messageText, mentionTemplate };
}
