// Sanitize that special characters of HTML tags cause XSS issue
import { BaseChannel } from '@sendbird/chat';

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
