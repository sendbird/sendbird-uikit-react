import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { BaseMessage } from '@sendbird/chat/message';
import type { SendableMessage } from '@sendbird/chat/lib/__definition';

export const uikitCompatibleFormVersion = 1;

export function getComponentKeyFromMessage(message: BaseMessage | SendableMessage): string {
  if ('sendingStatus' in message) {
    if (message.sendingStatus === 'succeeded') return String(message.messageId);
    return message.reqId;
  }

  return String(message.messageId);
}

export function isContextMenuClosed() {
  return (
    document.getElementById('sendbird-dropdown-portal')?.childElementCount === 0
    && document.getElementById('sendbird-emoji-list-portal')?.childElementCount === 0
  );
}

export function getMessageTopOffset(messageCreatedAt: number): number | null {
  const element = document.querySelectorAll(`[data-sb-created-at="${messageCreatedAt}"]`)?.[0];
  if (element instanceof HTMLElement) {
    return element.offsetTop;
  }
  return null;
}

export const isDisabledBecauseFrozen = (groupChannel?: GroupChannel | null) => {
  if (!groupChannel) return false;
  return groupChannel.isFrozen && groupChannel.myRole !== 'operator';
};

export const isDisabledBecauseMuted = (groupChannel?: GroupChannel | null) => {
  if (!groupChannel) return false;
  return groupChannel.myMutedState === 'muted';
};

export const isDisabledBecauseSuggestedReplies = (
  channel: GroupChannel | null | undefined,
  enableSuggestedReplies: boolean,
) => {
  return enableSuggestedReplies
    && Array.isArray(channel?.lastMessage?.extendedMessagePayload?.suggested_replies)
    && !!channel?.lastMessage?.extendedMessagePayload?.disable_chat_input;
};

export const isFormVersionCompatible = (version: number) => {
  return version === uikitCompatibleFormVersion;
};

export const isDisabledBecauseMessageForm = (
  allMessages: BaseMessage[],
  enableFormTypeMessage: boolean,
) => {
  return enableFormTypeMessage
    && allMessages.some((message) => (
      !!message.messageForm
      && isFormVersionCompatible(message.messageForm.version)
      && !message.messageForm.isSubmitted
      && !!message.extendedMessagePayload?.disable_chat_input
    ));
};
