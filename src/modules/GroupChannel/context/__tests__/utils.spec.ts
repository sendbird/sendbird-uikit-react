import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { Role } from '@sendbird/chat';
import {
  getComponentKeyFromMessage,
  isContextMenuClosed,
  getMessageTopOffset,
  isDisabledBecauseFrozen,
  isDisabledBecauseMuted,
  isDisabledBecauseSuggestedReplies,
  isFormVersionCompatible,
  isDisabledBecauseMessageForm,
} from '../utils';
import { UIKIT_COMPATIBLE_FORM_VERSION } from '../const';

describe('GroupChannel utils', () => {
  describe('getComponentKeyFromMessage', () => {
    it('should return messageId if sendingStatus is succeeded', () => {
      const message = {
        messageId: 12345,
        sendingStatus: 'succeeded',
      };
      expect(getComponentKeyFromMessage(message)).toBe('12345');
    });

    it('should return reqId if sendingStatus is pending', () => {
      const message = {
        messageId: 12345,
        reqId: 'temp-id-123',
        sendingStatus: 'pending',
      };
      expect(getComponentKeyFromMessage(message)).toBe('temp-id-123');
    });
  });

  describe('isContextMenuClosed', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return true if dropdown and emoji portal are empty', () => {
      document.body.innerHTML = `
        <div id="sendbird-dropdown-portal"></div>
        <div id="sendbird-emoji-list-portal"></div>
      `;
      expect(isContextMenuClosed()).toBe(true);
    });

    it('should return false if dropdown or emoji portal has content', () => {
      document.body.innerHTML = `
        <div id="sendbird-dropdown-portal"><div>content</div></div>
        <div id="sendbird-emoji-list-portal"></div>
      `;
      expect(isContextMenuClosed()).toBe(false);
    });
  });

  describe('getMessageTopOffset', () => {
    const mockCreatedAt = 1234567890;

    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should return offsetTop if message element exists', () => {
      document.body.innerHTML = `
        <div data-sb-created-at="1234567890" style="position: absolute; top: 100px;"></div>
      `;
      const element = document.querySelector('[data-sb-created-at="1234567890"]');
      Object.defineProperty(element, 'offsetTop', {
        configurable: true,
        value: 100,
      });
      expect(getMessageTopOffset(mockCreatedAt)).toBe(100);
    });

    it('should return null if message element does not exist', () => {
      expect(getMessageTopOffset(mockCreatedAt)).toBe(null);
    });
  });

  describe('isDisabledBecauseFrozen', () => {
    it('should return true if channel is frozen and user is not operator', () => {
      const channel = {
        isFrozen: true,
        myRole: Role.NONE,
      } as GroupChannel;
      expect(isDisabledBecauseFrozen(channel)).toBe(true);
    });

    it('should return false if channel is not frozen or user is operator', () => {
      expect(isDisabledBecauseFrozen({ isFrozen: false, myRole: Role.NONE } as GroupChannel)).toBe(false);
      expect(isDisabledBecauseFrozen({ isFrozen: true, myRole: Role.OPERATOR } as GroupChannel)).toBe(false);
    });
  });

  describe('isDisabledBecauseMuted', () => {
    it('should return true if user is muted', () => {
      const channel = { myMutedState: 'muted' } as GroupChannel;
      expect(isDisabledBecauseMuted(channel)).toBe(true);
    });

    it('should return false if user is not muted', () => {
      const channel = { myMutedState: 'unmuted' } as GroupChannel;
      expect(isDisabledBecauseMuted(channel)).toBe(false);
    });
  });

  describe('isDisabledBecauseSuggestedReplies', () => {
    it('should return true if suggested replies are enabled and chat input is disabled', () => {
      const channel = {
        lastMessage: {
          extendedMessagePayload: {
            suggested_replies: ['reply1', 'reply2'],
            disable_chat_input: true,
          },
        },
      };
      expect(isDisabledBecauseSuggestedReplies(channel as any, true)).toBe(true);
    });
  });

  describe('isFormVersionCompatible', () => {
    it('should return true if version is compatible', () => {
      expect(isFormVersionCompatible(UIKIT_COMPATIBLE_FORM_VERSION)).toBe(true);
      expect(isFormVersionCompatible(UIKIT_COMPATIBLE_FORM_VERSION - 1)).toBe(true);
    });

    it('should return false if version is not compatible', () => {
      expect(isFormVersionCompatible(UIKIT_COMPATIBLE_FORM_VERSION + 1)).toBe(false);
    });
  });

  describe('isDisabledBecauseMessageForm', () => {
    it('should return true if there is an unsent form and chat input is disabled', () => {
      const messages = [{
        messageForm: {
          isSubmitted: false,
          version: UIKIT_COMPATIBLE_FORM_VERSION,
        },
        extendedMessagePayload: {
          disable_chat_input: true,
        },
      }];
      expect(isDisabledBecauseMessageForm(messages as any, true)).toBe(true);
    });

    it('should return false if there is no form or it is already submitted', () => {
      const messages = [{
        messageForm: {
          isSubmitted: true,
          version: UIKIT_COMPATIBLE_FORM_VERSION,
        },
        extendedMessagePayload: {
          disable_chat_input: true,
        },
      }];
      expect(isDisabledBecauseMessageForm(messages as any, true)).toBe(false);
    });
  });
});
