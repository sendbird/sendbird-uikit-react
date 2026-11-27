// Local fixture only: synthetic Chat SDK responses, registered emoji and send/reaction callbacks.
// The SendbirdProvider, group-channel stores and UI are the installed package.
import { useState, type PropsWithChildren } from 'react';
import { CollectionEventSource, SessionHandler } from '@sendbird/chat';
import type { BaseChannelCollectionEventHandler, GroupChannel } from '@sendbird/chat/groupChannel';
import { type UserMessageCreateParams } from '@sendbird/chat/message';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { configureFixtureSession } from './configure-fixture-session';

export type ScreenId = 'A' | 'B';
export type Operation = {
  screen: ScreenId;
  operation: 'addReaction' | 'deleteReaction' | 'sendUserMessage' | 'leaveChannel';
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
export const fixtureAppId = '00000000-0000-4000-8000-000000000009';

type FixtureReaction = { key: string; userIds: string[]; count: number; hasCurrentUserReacted: boolean };
type ReactionSummary = Pick<FixtureReaction, 'count' | 'hasCurrentUserReacted'>;

function makeMessage(id: number, text: string, url: string, sender = other, status = 'succeeded', parentMessage?: FixtureMessage) {
  const message = {
    messageId: id, reqId: `req-${id}`, channelUrl: url, channelType: 'group', messageType: 'user',
    message: text, createdAt: fixtureTime + id * 1000, updatedAt: 0, customType: '', data: '',
    extendedMessagePayload: {}, sendingStatus: status, parentMessageId: parentMessage?.messageId ?? 0, parentMessage,
    sender, reactions: [] as FixtureReaction[], mentionedUsers: [], mentionType: 'users',
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

type ChannelSeed = {
  text?: string;
  customType?: string;
  data?: string;
  like?: boolean | ReactionSummary;
  admin?: boolean;
  leave?: () => Promise<void>;
};
type ProviderProps = React.ComponentProps<typeof SendbirdProvider>;

function createChannel(screen: ScreenId, record: RecordOperation, historySize: number, onLeave: (url: string) => void, seed?: ChannelSeed) {
  const url = `fixture-${screen}`;
  const first = makeMessage(screen === 'A' ? 101 : 201, seed?.text ?? `Original message ${screen}`, url);
  first.customType = seed?.customType ?? '';
  first.data = seed?.data ?? '';
  if (seed?.like) {
    const summary = seed.like === true ? { count: 1, hasCurrentUserReacted: false } : seed.like;
    first.reactions = [{ key: 'like', userIds: [other.userId], ...summary }];
  }
  if (seed?.admin) {
    first.messageType = 'admin';
    first.isAdminMessage = () => true;
    first.isUserMessage = () => false;
  }
  const loaded = [first, ...Array.from({ length: historySize - 1 }, (_, offset) =>
    makeMessage(first.messageId + offset + 1, `History ${offset + 2}`, url))];
  let active: CollectionHandler | undefined;

  function updateReaction(messageId: number, key: string, operation: 'addReaction' | 'deleteReaction') {
    const target = loaded.find(message => message.messageId === messageId);
    if (!target) return;

    const prior = target.reactions.find(reaction => reaction.key === key);
    const hasCurrentUserReacted = operation === 'addReaction';
    const count = (prior?.count ?? 0) + Number(hasCurrentUserReacted) - Number(prior?.hasCurrentUserReacted ?? false);
    const userIds = (prior?.userIds ?? []).filter(userId => userId !== self.userId);
    if (hasCurrentUserReacted) userIds.push(self.userId);

    target.reactions = target.reactions.filter(reaction => reaction.key !== key);
    if (count > 0) target.reactions.push({ key, userIds, count, hasCurrentUserReacted });

    record({ screen, operation, messageId, emoji: key });
    active?.onMessagesUpdated?.({ source: CollectionEventSource.EVENT_MESSAGE_UPDATED }, channel, [target]);
  }

  const channel = {
    url, name: `Conversation ${screen}`, channelType: 'group', coverUrl: '', createdAt: fixtureTime, lastMessage: first,
    serialize: () => JSON.stringify({ url }),
    isEphemeral: false, isBroadcast: false, isSuper: false, isFrozen: false,
    isGroupChannel: () => true, isOpenChannel: () => false,
    members: [self, other], memberCount: 2, joinedMemberCount: 2, myMemberState: 'joined', myRole: 'none',
    unreadMessageCount: 0, getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
    getTypingUsers: () => [], startTyping: async () => undefined, endTyping: async () => undefined,
    markAsRead: async () => undefined,
    async leave() {
      await seed?.leave?.();
      record({ screen, operation: 'leaveChannel' });
      onLeave(url);
    },
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
      updateReaction(message.messageId, key, 'addReaction');
    },
    async deleteReaction(message: FixtureMessage, key: string) {
      updateReaction(message.messageId, key, 'deleteReaction');
    },
    sendUserMessage(params: UserMessageCreateParams) {
      record({ screen, operation: 'sendUserMessage', text: params.message,
        replyTo: params.parentMessageId });
      const id = first.messageId + loaded.length;
      const parent = loaded.find(message => message.messageId === params.parentMessageId);
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

function configureBoundary(record: RecordOperation, historySize: number, seed?: ChannelSeed): NonNullable<ProviderProps['configureSession']> {
  const collectionRemovers = new Set<(url: string) => void>();
  const onLeave = (url: string) => {
    channels.delete(url);
    for (const remove of collectionRemovers) remove(url);
  };
  const channels = new Map((['A', 'B'] as const).map(screen =>
    [`fixture-${screen}`, createChannel(screen, record, historySize, onLeave, screen === 'A' ? seed : undefined)]));
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
    const groupChannel = configureFixtureSession(sdk, self, async url => {
      const channel = channels.get(url);
      if (!channel) throw new Error('Unknown synthetic channel');
      return channel;
    });
    groupChannel.createGroupChannelCollection = () => {
      let collectionHandler: BaseChannelCollectionEventHandler | undefined;
      const remove = (url: string) => {
        collection.channels = collection.channels.filter(channel => channel.url !== url);
        collectionHandler?.onChannelsDeleted?.({ source: CollectionEventSource.EVENT_CHANNEL_DELETED }, [url]);
      };
      const collection = {
        hasMore: true,
        channels: [] as GroupChannel[],
        async loadMore() {
          collection.hasMore = false;
          collection.channels = [...channels.values()];
          return collection.channels;
        },
        setGroupChannelCollectionHandler: (handler: BaseChannelCollectionEventHandler) => { collectionHandler = handler; },
        dispose: () => { collectionRemovers.delete(remove); },
      };
      collectionRemovers.add(remove);
      return collection as unknown as ReturnType<typeof groupChannel.createGroupChannelCollection>;
    };
    return new SessionHandler();
  };
}

export function useGroupChannelFixtureSession(record: RecordOperation, historySize = 1, seed?: ChannelSeed) {
  const [configureSession] = useState(() => configureBoundary(record, historySize, seed));
  return configureSession;
}

export function GroupChannelFixture({ record, children, uikitOptions, historySize, htmlTextDirection, seed, stringSet, breakpoint, theme }: PropsWithChildren<{
  record: RecordOperation;
  historySize?: number;
  htmlTextDirection?: ProviderProps['htmlTextDirection'];
  uikitOptions?: ProviderProps['uikitOptions'];
  stringSet?: ProviderProps['stringSet'];
  breakpoint?: ProviderProps['breakpoint'];
  theme?: ProviderProps['theme'];
  seed?: ChannelSeed;
}>) {
  const configureSession = useGroupChannelFixtureSession(record, historySize, seed);
  return <SendbirdProvider appId={fixtureAppId} userId="self" configureSession={configureSession}
    sdkInitParams={{ localCacheEnabled: false }}
    uikitOptions={uikitOptions} htmlTextDirection={htmlTextDirection} stringSet={stringSet} breakpoint={breakpoint} theme={theme}>
    {children}
  </SendbirdProvider>;
}
