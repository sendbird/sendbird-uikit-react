// Local fixture only: synthetic channel state and local reaction/send callbacks.
import { useMemo, useState } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannelContext, useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import { GroupChannelListProvider } from '@sendbird/uikit-react/GroupChannelList/context';
import { GroupChannelListItem } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListItem';
import { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import MessageInput from '@sendbird/uikit-react/ui/MessageInput';
import { ChatMessage } from './integration';
import { channelTitle, messageText, senderId, timestamp, userId, type Observation } from './scenario';

type FixtureMessage = MessageContentProps['message'];
type FixtureChannel = NonNullable<MessageContentProps['channel']>;
type FixtureStore = NonNullable<React.ContextType<typeof GroupChannelContext>>;
const sender = { userId: senderId, nickname: 'Alex', profileUrl: '' };
const emojiUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><text y="17" font-size="18">♥</text></svg>');
const emojiContainer = {
  emojiHash: 'fixture', emojiCategories: [{ id: 1, name: 'Fixture', emojis: [{ key: 'like', url: emojiUrl }] }],
} as MessageContentProps['emojiContainer'];

function fixtureMessage(selected: boolean): FixtureMessage {
  return {
    messageId: 101,
    messageType: 'user',
    message: messageText,
    createdAt: timestamp,
    updatedAt: 0,
    customType: '',
    data: '',
    extendedMessagePayload: {},
    sendingStatus: 'succeeded',
    parentMessageId: 0,
    sender,
    reactions: [{ key: 'like', userIds: selected ? [senderId, 'third', userId] : [senderId, 'third'] }],
    mentionedUsers: [],
    threadInfo: { replyCount: 0 },
    isAdminMessage: () => false,
    isUserMessage: () => true,
    isFileMessage: () => false,
    isMultipleFilesMessage: () => false,
    isResendable: () => false,
  } as unknown as FixtureMessage;
}

function createFixture(record: (event: Observation) => void, onSelected: (selected: boolean) => void) {
  const channel = {
    url: 'upgrade-fixture',
    name: channelTitle,
    coverUrl: '',
    channelType: 'group',
    isEphemeral: false,
    isBroadcast: false,
    isSuper: false,
    members: [sender],
    memberCount: 2,
    unreadMessageCount: 1,
    unreadMentionCount: 0,
    lastMessage: fixtureMessage(false),
    isDistinct: false,
    isGroupChannel: () => true,
    isOpenChannel: () => false,
    getUnreadMemberCount: () => 0,
    getUndeliveredMemberCount: () => 0,
    addReaction: async (message: FixtureMessage, key: string) => {
      record({ action: 'reaction-added', messageId: message.messageId, key });
      onSelected(true);
    },
    deleteReaction: async (message: FixtureMessage, key: string) => {
      record({ action: 'reaction-removed', messageId: message.messageId, key });
      onSelected(false);
    },
  } as unknown as FixtureChannel;

  let state: Record<string, unknown> = {
    currentChannel: channel, channelUrl: channel.url, initialized: true, loading: false,
    messages: [], quoteMessage: null, replyType: 'NONE', nicknamesMap: new Map(),
    messageInputRef: { current: null }, scrollRef: { current: null },
    scrollPositionRef: { current: 0 }, scrollDistanceFromBottomRef: { current: 0 },
    scrollPubSub: { publish: () => undefined }, hasNext: () => false,
  };
  const listeners = new Set<() => void>();
  const store = {
    getState: () => state,
    setState: (patch: Record<string, unknown> | ((current: Record<string, unknown>) => Record<string, unknown>)) => {
      const next = typeof patch === 'function' ? patch(state) : patch;
      if (Object.keys(next).every((key) => Object.is(state[key], next[key]))) return;
      state = { ...state, ...next };
      listeners.forEach((notify) => notify());
    },
    subscribe: (notify: () => void) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
  } as unknown as FixtureStore;
  return { channel, store };
}

function BoundMessage({ channel, selected }: { channel: FixtureChannel; selected: boolean }) {
  const { actions } = useGroupChannel();
  return (
    <ChatMessage
      channel={channel}
      message={fixtureMessage(selected)}
      userId={userId}
      isReactionEnabled
      toggleReaction={actions.toggleReaction}
      emojiContainer={emojiContainer}
    />
  );
}

export function UpgradeFixture({ record }: { record: (event: Observation) => void }) {
  const [reactionSelected, setReactionSelected] = useState(false);
  const [channelSelected, setChannelSelected] = useState(false);
  const { channel, store } = useMemo(() => createFixture(record, setReactionSelected), [record]);
  return (
    <SendbirdProvider appId="" userId={userId} breakpoint="600px">
      <GroupChannelContext.Provider value={store}>
        <section data-testid="preview">
          <GroupChannelListProvider disableAutoSelect onChannelSelect={() => {}} onChannelCreated={() => {}}>
            <GroupChannelListItem
              channel={channel}
              isSelected={channelSelected}
              tabIndex={0}
              renderChannelAction={() => <></>}
              onClick={() => { setChannelSelected(true); record({ action: 'preview-selected' }); }}
            />
          </GroupChannelListProvider>
        </section>
        <section data-testid="message" className="sendbird-conversation__messages" dir="ltr">
          <BoundMessage channel={channel} selected={reactionSelected} />
        </section>
        <section data-testid="composer">
          <MessageInput
            channel={channel}
            channelUrl={channel.url}
            placeholder="Write a message…"
            onSendMessage={({ message }) => record({ action: 'send', text: message })}
          />
        </section>
      </GroupChannelContext.Provider>
    </SendbirdProvider>
  );
}
