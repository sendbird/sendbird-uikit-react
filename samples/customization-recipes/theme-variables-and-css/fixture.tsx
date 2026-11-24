// Local fixture only: synthetic messages render the installed UIKit components without an account or server.
import { useState, type ComponentProps } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import Icon, { IconColors, IconTypes } from '@sendbird/uikit-react/ui/Icon';
import MessageInputWrapper from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import { GroupChannelContext } from '@sendbird/uikit-react/GroupChannel/context';
import MessageContent from '@sendbird/uikit-react/ui/MessageContent';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
type ThemeMode = 'default' | 'tokens' | 'target';

const conversation = [
  { id: 101, who: 'other', text: 'Could we review the launch checklist today?' },
  { id: 102, who: 'self', text: 'Yes. Typography, colors, spacing, and the composer are ready.' },
  { id: 103, who: 'other', text: 'Great, please check the narrow screen too. This longer message should wrap without clipping, and both the beginning and the end should stay readable.' },
] as const;

const created = new Date('2026-11-19T12:34:00Z');
// One reacted message shows how the bubble meets the stock reaction row.
const reactedMessageId = 103;
const heartUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><text y="17" font-size="18">♥</text></svg>');
const emojiContainer = { emojiHash: 'fixture', emojiCategories: [{ id: 1, name: 'Fixture', emojis: [{ key: 'heart', url: heartUrl }] }] } as unknown as ComponentProps<typeof MessageContent>['emojiContainer'];
const people = { self: 'Sam', other: 'Alex' } as const;
const nicknamesMap = new Map(Object.entries(people));
type FixtureMessage = (typeof conversation)[number];
type ChannelStore = NonNullable<React.ContextType<typeof GroupChannelContext>>;
const inert = () => {};

// The stock MessageInputWrapper stages picked files before sending; this store only records what it sends.
function createChannelStore(record: (sent: string) => void): ChannelStore {
  const sent = { messageId: 201, messageType: 'user', channelUrl: sendbirdChannel.url, createdAt: created.getTime(), sender: { userId: 'self' } };
  let state: Record<string, unknown> = {
    currentChannel: sendbirdChannel, channelUrl: sendbirdChannel.url, loading: false, initialized: true,
    messages: [], quoteMessage: null, replyType: 'NONE',
    messageInputRef: { current: null }, scrollRef: { current: null },
    scrollDistanceFromBottomRef: { current: 0 }, scrollPositionRef: { current: 0 }, scrollPubSub: { publish: inert },
    sendUserMessage: async ({ message }: { message: string }) => { record(message); return sent; },
    sendFileMessage: async ({ file }: { file: unknown }) => { record(`file ${file instanceof File ? file.name : ''}`); return { ...sent, messageType: 'file' }; },
    sendMultipleFilesMessage: inert, updateUserMessage: inert, updateFileMessage: inert,
    resendMessage: inert, deleteMessage: inert, resetNewMessages: inert, hasNext: () => false, nicknamesMap,
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
    subscribe: (subscriber: () => void) => { subscribers.add(subscriber); return () => subscribers.delete(subscriber); },
  } as unknown as ChannelStore;
}

const sendbirdChannel = {
  url: 'synthetic-style',
  channelType: 'group',
  isEphemeral: false,
  members: [],
  isGroupChannel: () => true,
  isOpenChannel: () => false,
  isBroadcast: false,
  isSuper: false,
  isFrozen: false,
  myRole: 'none',
  startTyping: inert,
  endTyping: inert,
} as unknown as GroupChannel;

function toSendbirdMessage(item: FixtureMessage, reactedByMe: boolean) {
  const heartUsers = [
    ...(item.id === reactedMessageId ? ['other'] : []),
    ...(reactedByMe ? ['self'] : []),
  ];
  return {
    messageId: item.id,
    messageType: 'user',
    message: item.text,
    createdAt: created.getTime(),
    updatedAt: 0,
    customType: '',
    data: '',
    extendedMessagePayload: {},
    sendingStatus: 'succeeded',
    parentMessageId: 0,
    sender: { userId: item.who, nickname: people[item.who], profileUrl: '' },
    reactions: heartUsers.length ? [{ key: 'heart', userIds: heartUsers }] : [],
    mentionedUsers: [],
    threadInfo: { replyCount: 0 },
    isAdminMessage: () => false,
    isUserMessage: () => true,
    isFileMessage: () => false,
    isMultipleFilesMessage: () => false,
    isResendable: () => false,
  } as unknown as ComponentProps<typeof MessageContent>['message'];
}

export function ThemeFixture({ mode }: { mode: ThemeMode }) {
  const [sent, recordSend] = useState('');
  const [channelStore] = useState(() => createChannelStore(recordSend));
  const [myHearts, setMyHearts] = useState<Record<number, boolean>>({});
  const toggleHeart = (messageId: number) => {
    setMyHearts(current => ({ ...current, [messageId]: !current[messageId] }));
  };
  const accent = <Icon type={IconTypes.INFO} fillColor={IconColors.PRIMARY} width="20px" height="20px" />;
  return <SendbirdProvider appId="" userId="self" theme="light" breakpoint="600px"
    uikitOptions={{ groupChannel: { enableVoiceMessage: false, input: { enableDocument: true } } }}>
    <div className="theme-example">
      <div className="accent-comparison">
        <span data-testid="outside-accent">{accent} Outside the chat</span>
      </div>
      <section className={`branded-chat ${mode} theme-fixture`} aria-label="Branded chat">
        <div className="scene">
          <div className="chat-heading"><span data-testid="inside-accent">{accent}</span> Launch planning</div>
          <div className="messages sendbird-conversation__messages" dir="ltr">
            {conversation.map(item => <div key={item.id} className="fixture-row" data-who={item.who}
              onKeyDown={event => {
                // The stock reaction badge uses a div with role="button".
                if (!(event.target instanceof HTMLElement)
                  || !event.target.matches('.sendbird-emoji-reactions__reaction-badge [role="button"]')
                  || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                event.stopPropagation();
                if (!event.repeat) toggleHeart(item.id);
              }}>
              <MessageContent message={toSendbirdMessage(item, myHearts[item.id] ?? false)} channel={sendbirdChannel} userId="self"
                isReactionEnabled emojiContainer={emojiContainer} nicknamesMap={nicknamesMap}
                toggleReaction={message => toggleHeart(message.messageId)} />
            </div>)}
          </div>
          <div className="composer-host">
            <GroupChannelContext.Provider value={channelStore}><MessageInputWrapper /></GroupChannelContext.Provider>
            <output aria-live="polite">{sent && `Fixture received: ${sent}`}</output>
          </div>
        </div>
      </section>
    </div>
  </SendbirdProvider>;
}
