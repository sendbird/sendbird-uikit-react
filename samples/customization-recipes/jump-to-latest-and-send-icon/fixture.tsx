// Local fixture only: a synthetic group channel, message collection and Chat SDK send responses.
import { useState, type PropsWithChildren } from 'react';
import { SessionHandler } from '@sendbird/chat';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { configureFixtureSession } from '../shared/configure-fixture-session';

export type SendRecord = { channel: string; text: string; parent?: number; mentions: string[]; file?: string };
type FixtureMessage = { messageId: number };
type SendListener = (record: SendRecord) => void;
const self = { userId: 'self', nickname: 'Sam', profileUrl: '', isActive: true };
const other = { userId: 'other', nickname: 'Alex', profileUrl: '', isActive: true };
const created = Date.parse('2026-11-19T12:00:00Z');
const fixtureAppId = '00000000-0000-4000-8000-000000000004';
// Opening at History 12 mimics a search or quote jump: newer messages load in pages of four.
export const olderStartingPoint = created + 112 * 60_000;

function makeMessage(id: number, text: string, url: string, sender = other, status = 'succeeded', parent?: FixtureMessage, file?: { name: string; url: string; type: string; size: number }) {
  const message = {
    messageId: id, reqId: `req-${id}`, channelUrl: url, channelType: 'group', messageType: file ? 'file' : 'user',
    message: text, createdAt: created + id * 60_000, updatedAt: 0, customType: '', data: '',
    extendedMessagePayload: {}, sendingStatus: status, parentMessageId: parent?.messageId ?? 0, parentMessage: parent,
    sender, reactions: [], mentionedUsers: [], mentionType: 'users',
    threadInfo: { replyCount: 0 }, metaArrays: [],
    isAdminMessage: () => false, isUserMessage: () => !file, isFileMessage: () => !!file,
    isMultipleFilesMessage: () => false, isResendable: () => false, getMetaArraysByKeys: () => [],
    ...(file && { ...file, plainUrl: file.url, thumbnails: [] }),
    applyParentMessage: (value: FixtureMessage) => { message.parentMessage = value; },
    serialize: () => JSON.stringify([id, text, status]),
  };
  return message;
}

function createChannel(onSend: SendListener) {
  const url = 'fixture-channel';
  const baseId = 101;
  const loaded = Array.from({ length: 24 }, (_, index) =>
    makeMessage(baseId + index, `History ${String(index + 1).padStart(2, '0')}`, url));
  function createSendResult(text: string, parentId?: number, file?: { name: string; url: string; type: string; size: number }) {
    const id = baseId + loaded.length;
    const parent = loaded.find(item => item.messageId === parentId);
    const sent = makeMessage(id, text, url, self, 'succeeded', parent, file);
    const result = {
      onPending(callback: (message: unknown) => void) {
        callback(makeMessage(id, text, url, self, 'pending', parent, file));
        return result;
      },
      onSucceeded(callback: (message: unknown) => void) {
        queueMicrotask(() => { loaded.push(sent); callback(sent); });
        return result;
      },
      onFailed: () => result,
    };
    return result;
  }
  const channel = {
    url, name: 'Launch room', channelType: 'group', coverUrl: '', createdAt: created,
    serialize: () => JSON.stringify({ url }), isEphemeral: false, isBroadcast: false,
    isSuper: false, isFrozen: false, isGroupChannel: () => true, isOpenChannel: () => false,
    members: [self, other], memberCount: 2, joinedMemberCount: 2, myMemberState: 'joined',
    myRole: 'none', unreadMessageCount: 0, getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
    getTypingUsers: () => [], startTyping: async () => undefined, endTyping: async () => undefined,
    markAsRead: async () => undefined,
    createMessageCollection({ startingPoint = Number.MAX_SAFE_INTEGER }: { startingPoint?: number } = {}) {
      let end = startingPoint < loaded[loaded.length - 1].createdAt
        ? loaded.filter(item => item.createdAt <= startingPoint).length : Infinity;
      const result = {
        hasPrevious: false, get hasNext() { return end < loaded.length; },
        get succeededMessages() { return loaded.slice(0, end); }, pendingMessages: [], failedMessages: [],
        setMessageCollectionHandler: () => undefined,
        loadPrevious: async () => [], dispose: () => undefined,
        loadNext: async () => {
          const page = loaded.slice(end, end + 4);
          end += page.length;
          // Once caught up, locally sent messages belong to the current page.
          if (end >= loaded.length) end = Infinity;
          return page;
        },
        initialize: () => result,
        onCacheResult: (callback: (error: null, messages: unknown[]) => void) => {
          queueMicrotask(() => callback(null, []));
          return result;
        },
        onApiResult: (callback: (error: null, messages: unknown[]) => void) => {
          queueMicrotask(() => callback(null, result.succeededMessages));
          return result;
        },
      };
      return result;
    },
    sendUserMessage(params: UserMessageCreateParams) {
      onSend({ channel: url, text: params.message, parent: params.parentMessageId,
        mentions: params.mentionedUserIds ?? params.mentionedUsers?.map(user => user.userId) ?? [] });
      return createSendResult(params.message, params.parentMessageId);
    },
    sendFileMessage(params: FileMessageCreateParams) {
      const file = params.file as File;
      const attachment = { name: file.name, url: URL.createObjectURL(file), type: file.type, size: file.size };
      onSend({ channel: url, text: '', file: file.name, parent: params.parentMessageId, mentions: [] });
      return createSendResult('', params.parentMessageId, attachment);
    },
  } as unknown as GroupChannel;
  return channel;
}

function configureBoundary(onSend: SendListener): NonNullable<React.ComponentProps<typeof SendbirdProvider>['configureSession']> {
  const channels = new Map([['fixture-channel', createChannel(onSend)]]);
  return sdk => {
    configureFixtureSession(sdk, self, async url => {
      const channel = channels.get(url);
      if (!channel) throw new Error('Unknown fixture channel');
      return channel;
    });
    return new SessionHandler();
  };
}

export function FixtureProvider({ children, onSend, theme, allowReplies }: PropsWithChildren<{
  onSend: SendListener; theme: 'light' | 'dark'; allowReplies: boolean;
}>) {
  const [configureSession] = useState(() => configureBoundary(onSend));
  return <SendbirdProvider appId={fixtureAppId} userId="self" theme={theme} configureSession={configureSession}
    sdkInitParams={{ localCacheEnabled: false }}
    uikitOptions={{ groupChannel: { replyType: allowReplies ? 'quote_reply' : 'none', enableMention: true, enableVoiceMessage: false, input: { enableDocument: true } } }}>
    {children}
  </SendbirdProvider>;
}
