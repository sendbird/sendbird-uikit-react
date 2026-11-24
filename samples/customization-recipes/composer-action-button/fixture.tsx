// Local fixture only: synthetic group channel state and in-memory send callbacks for the installed composer.
import { useState, type PropsWithChildren } from 'react';
import type { FileMessageCreateParams, UserMessageCreateParams } from '@sendbird/chat/message';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannelContext } from '@sendbird/uikit-react/GroupChannel/context';

export type ComposerEvent = { kind: 'text'; text: string } | { kind: 'file'; filename: string };

const channelUrl = 'synthetic-channel';
const member = { userId: 'other', nickname: 'Alex', profileUrl: '', isActive: true };
const inert = () => {};

function createCollection(record: (event: ComposerEvent) => void) {
  const channel = {
    url: channelUrl,
    channelType: 'group',
    members: [member],
    myRole: 'none',
    isBroadcast: false,
    isSuper: false,
    isFrozen: false,
    isEphemeral: false,
    isGroupChannel: () => true,
    isOpenChannel: () => false,
    startTyping: inert,
    endTyping: inert,
  };
  const syntheticMessage = {
    messageId: 101, messageType: 'user', channelUrl, createdAt: Date.parse('2026-11-24T12:00:00Z'),
    sender: { userId: 'self', nickname: 'Self', profileUrl: '' },
  };
  let state: Record<string, unknown> = {
    currentChannel: channel, channelUrl, loading: false, initialized: true,
    messages: [], quoteMessage: null, replyType: 'NONE',
    messageInputRef: { current: null }, scrollRef: { current: null },
    scrollDistanceFromBottomRef: { current: 0 }, scrollPositionRef: { current: 0 },
    scrollPubSub: { publish: inert },
    sendUserMessage: async (params: UserMessageCreateParams) => {
      record({ kind: 'text', text: params.message });
      return syntheticMessage;
    },
    sendFileMessage: async (params: FileMessageCreateParams) => {
      const file = params.file;
      record({ kind: 'file', filename: file instanceof File ? file.name : '' });
      return { ...syntheticMessage, messageType: 'file' };
    },
    sendMultipleFilesMessage: inert, updateUserMessage: inert, updateFileMessage: inert,
    resendMessage: inert, deleteMessage: inert, resetNewMessages: inert,
    hasNext: () => false, nicknamesMap: new Map(),
  };
  const subscribers = new Set<() => void>();
  return {
    getState: () => state,
    setState: (patch: Record<string, unknown> | ((previous: Record<string, unknown>) => Record<string, unknown>)) => {
      const next = typeof patch === 'function' ? patch(state) : patch;
      if (Object.keys(next).every(key => Object.is(state[key], next[key]))) return;
      state = { ...state, ...next };
      subscribers.forEach(notify => notify());
    },
    subscribe: (subscriber: () => void) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    },
  } as unknown as NonNullable<React.ContextType<typeof GroupChannelContext>>;
}

/** Supplies local synthetic channel data to the real UIKit composer. */
export function ComposerFixture({ record, children }: PropsWithChildren<{
  record: (event: ComposerEvent) => void;
}>) {
  const [collection] = useState(() => createCollection(record));
  return (
    <SendbirdProvider appId="" userId="self" breakpoint="600px" uikitOptions={{
      groupChannel: { enableVoiceMessage: false, input: { enableDocument: true } },
    }}>
      <GroupChannelContext.Provider value={collection}>{children}</GroupChannelContext.Provider>
    </SendbirdProvider>
  );
}
