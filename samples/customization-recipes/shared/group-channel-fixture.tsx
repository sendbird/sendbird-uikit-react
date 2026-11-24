// Local fixture only: synthetic Chat SDK responses, registered emoji and send/reaction callbacks.
// The SendbirdProvider, group-channel stores and UI are the installed package.
import { useState, type PropsWithChildren } from 'react';
import { CollectionEventSource, SessionHandler } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { type UserMessageCreateParams } from '@sendbird/chat/message';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { configureFixtureSession } from './configure-fixture-session';

export type ScreenId = 'A' | 'B';
export type Operation = {
  screen: ScreenId;
  operation: 'addReaction' | 'deleteReaction' | 'sendUserMessage';
  messageId?: number;
  emoji?: string;
  text?: string;
  replyTo?: number;
};
export type RecordOperation = (event: Operation) => void;

export const categories = [
  { id: 1, name: 'Gesture', key: 'like', emoji: '👍' },
  { id: 2, name: 'Heart', key: 'love', emoji: '❤️' },
  { id: 3, name: 'Celebrate', key: 'celebrate', emoji: '🎉' },
] as const;

const self = { userId: 'self', nickname: 'Self', profileUrl: '', isActive: true };
const other = { userId: 'other', nickname: 'Alex', profileUrl: '', isActive: true };
const fixtureTime = Date.parse('2026-11-18T12:00:00Z');
const appId = '00000000-0000-4000-8000-000000000009';

function makeMessage(id: number, text: string, url: string, sender = other, status = 'succeeded', parentMessage?: FixtureMessage) {
  const message = {
    messageId: id, reqId: `req-${id}`, channelUrl: url, channelType: 'group', messageType: 'user',
    message: text, createdAt: fixtureTime + id * 1000, updatedAt: 0, customType: '', data: '',
    extendedMessagePayload: {}, sendingStatus: status, parentMessageId: parentMessage?.messageId ?? 0, parentMessage,
    sender, reactions: [] as { key: string; userIds: string[] }[], mentionedUsers: [], mentionType: 'users',
    threadInfo: { replyCount: 0 }, metaArrays: [],
    isAdminMessage: () => false, isUserMessage: () => true, isFileMessage: () => false,
    isMultipleFilesMessage: () => false, isResendable: () => false, getMetaArraysByKeys: () => [],
    applyParentMessage: (parent: FixtureMessage) => { message.parentMessage = parent; },
    serialize: () => JSON.stringify([id, text, status, message.reactions]),
  };
  return message;
}
interface FixtureMessage { messageId: number }
interface CollectionHandler {
  onMessagesUpdated?: (context: { source: CollectionEventSource }, channel: GroupChannel, messages: FixtureMessage[]) => void;
}

function createChannel(screen: ScreenId, record: RecordOperation, historySize: number) {
  const url = `fixture-${screen}`;
  const first = makeMessage(screen === 'A' ? 101 : 201, `Original message ${screen}`, url);
  const loaded = [first, ...Array.from({ length: historySize - 1 }, (_, offset) =>
    makeMessage(first.messageId + offset + 1, `History ${offset + 2}`, url))];
  let active: CollectionHandler | undefined;
  const channel = {
    url, name: `Conversation ${screen}`, channelType: 'group', coverUrl: '', createdAt: fixtureTime,
    serialize: () => JSON.stringify({ url }),
    isEphemeral: false, isBroadcast: false, isSuper: false, isFrozen: false,
    isGroupChannel: () => true, isOpenChannel: () => false,
    members: [self, other], memberCount: 2, joinedMemberCount: 2, myMemberState: 'joined', myRole: 'none',
    unreadMessageCount: 0, getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
    getTypingUsers: () => [], startTyping: async () => undefined, endTyping: async () => undefined,
    markAsRead: async () => undefined,
    createMessageCollection() {
      const result = {
        hasPrevious: false, hasNext: false, succeededMessages: loaded, pendingMessages: [], failedMessages: [],
        setMessageCollectionHandler: (handler: CollectionHandler) => { active = handler; },
        loadPrevious: async () => [], loadNext: async () => [],
        dispose: () => { active = undefined; },
        initialize: () => result,
        onCacheResult: (callback: (error: null, messages: unknown[]) => void) => {
          queueMicrotask(() => callback(null, []));
          return result;
        },
        onApiResult: (callback: (error: null, messages: unknown[]) => void) => {
          queueMicrotask(() => callback(null, loaded));
          return result;
        },
      };
      return result;
    },
    async addReaction(message: FixtureMessage, key: string) {
      record({ screen, operation: 'addReaction', messageId: message.messageId, emoji: key });
      first.reactions = [{ key, userIds: [self.userId] }];
      active?.onMessagesUpdated?.({ source: CollectionEventSource.EVENT_MESSAGE_UPDATED }, channel, [first]);
    },
    async deleteReaction(message: FixtureMessage, key: string) {
      record({ screen, operation: 'deleteReaction', messageId: message.messageId, emoji: key });
      first.reactions = [];
      active?.onMessagesUpdated?.({ source: CollectionEventSource.EVENT_MESSAGE_UPDATED }, channel, [first]);
    },
    sendUserMessage(params: UserMessageCreateParams) {
      record({ screen, operation: 'sendUserMessage', text: params.message,
        replyTo: params.parentMessageId });
      const id = first.messageId + loaded.length;
      const parent = params.parentMessageId ? first : undefined;
      const finalMessage = makeMessage(id, params.message, url, self, 'succeeded', parent);
      const result = {
        onPending(callback: (message: unknown) => void) {
          callback(makeMessage(id, params.message, url, self, 'pending', parent));
          return result;
        },
        onSucceeded(callback: (message: unknown) => void) {
          queueMicrotask(() => { loaded.push(finalMessage); callback(finalMessage); });
          return result;
        },
        onFailed: () => result,
      };
      return result;
    },
  } as unknown as GroupChannel;
  return channel;
}

function configureBoundary(record: RecordOperation, historySize: number): NonNullable<React.ComponentProps<typeof SendbirdProvider>['configureSession']> {
  const channels = new Map((['A', 'B'] as const).map(screen => [`fixture-${screen}`, createChannel(screen, record, historySize)]));
  return sdk => {
    Object.defineProperty(sdk, 'appInfo', { configurable: true, get: () => ({
      applicationAttributes: ['reactions'], messageTemplateInfo: { token: '' }, uikitConfigInfo: { lastUpdatedAt: 0 },
    }) });
    sdk.getAllEmoji = async () => ({
      emojiHash: 'fixed-fixture',
      emojiCategories: categories.map(category => {
        const url = 'data:image/svg+xml,' + encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text x="1" y="25" font-size="24">${category.emoji}</text></svg>`,
        );
        return { id: category.id, name: category.name, url, emojis: [{ key: category.key, url }] };
      }),
    });
    configureFixtureSession(sdk, self, async url => {
      const channel = channels.get(url);
      if (!channel) throw new Error('Unknown synthetic channel');
      return channel;
    });
    return new SessionHandler();
  };
}

export function GroupChannelFixture({ record, children, uikitOptions, historySize = 1 }: PropsWithChildren<{
  record: RecordOperation;
  historySize?: number;
  uikitOptions?: React.ComponentProps<typeof SendbirdProvider>['uikitOptions'];
}>) {
  const [configureSession] = useState(() => configureBoundary(record, historySize));
  return <SendbirdProvider appId={appId} userId="self" configureSession={configureSession}
    sdkInitParams={{ localCacheEnabled: false }}
    uikitOptions={uikitOptions}>
    {children}
  </SendbirdProvider>;
}
