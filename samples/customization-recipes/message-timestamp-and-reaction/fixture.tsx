// Local fixture only: synthetic channel, message and store state. No credentials or live connection.
// Types are narrowed at the fixture boundary because synthetic SDK model objects omit
// unrelated SDK methods. All rendered components and reaction hooks are real packages.
import { useMemo, useState } from 'react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import MessageContent, { type MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import { GroupChannelContext, useGroupChannel } from '@sendbird/uikit-react/GroupChannel/context';
import { MessageWithLikeButton } from './integration';
import { secondsFormat } from './timestamp-format';

const time = Date.parse('2026-11-18T12:34:56Z');
export const shortText = 'See you at the demo.';
export const longText = 'The message, timestamp, and reaction button should stay readable even when the body wraps. '.repeat(5).trim();
const likeUrl = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><text y="17" font-size="18">♥</text></svg>');
type SBMessage = MessageContentProps['message'];
type SBChannel = NonNullable<MessageContentProps['channel']>;
export type Operation = {
  action: 'addReaction' | 'deleteReaction';
  messageId: string | number;
  key: string;
};
type Props = { custom: boolean; long: boolean; mixed: boolean; onOperation: (operation: Operation) => void };

function BoundSendbirdMessage({ custom, message, channel }: { custom: boolean; message: SBMessage; channel: SBChannel }) {
  const { actions } = useGroupChannel();
  const Component = custom ? MessageWithLikeButton : MessageContent;
  return <Component channel={channel} message={message} userId="self" isReactionEnabled
    toggleReaction={actions.toggleReaction}
    emojiContainer={{ emojiHash: 'fixture', emojiCategories: [{ id: 1, name: 'Fixture', emojis: [{ key: 'like', url: likeUrl }, { key: 'curious', url: likeUrl }] }] } as MessageContentProps['emojiContainer']} />;
}

export function MessageFixture({ custom, long, mixed, onOperation }: Props) {
  const [selected, setSelected] = useState(false);
  const channel = useMemo(() => ({
    url: 'fixture-channel', channelType: 'group', isEphemeral: false, isBroadcast: false, isSuper: false,
    members: [{ userId: 'other', nickname: 'Alex', profileUrl: '' }],
    isGroupChannel: () => true, isOpenChannel: () => false,
    getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
    addReaction: async (message: SBMessage, key: string) => {
      onOperation({ action: 'addReaction', messageId: message.messageId, key });
      setSelected(true);
    },
    deleteReaction: async (message: SBMessage, key: string) => {
      onOperation({ action: 'deleteReaction', messageId: message.messageId, key });
      setSelected(false);
    },
  }) as unknown as SBChannel, [onOperation]);
  const store = useMemo(() => {
    let state: Record<string, unknown> = {
      currentChannel: channel, channelUrl: channel.url, initialized: true, loading: false,
      messages: [], quoteMessage: null, replyType: 'NONE', nicknamesMap: new Map(),
      messageInputRef: { current: null }, scrollRef: { current: null },
      scrollPositionRef: { current: 0 }, scrollDistanceFromBottomRef: { current: 0 },
      scrollPubSub: { publish: () => undefined }, hasNext: () => false,
    };
    const listeners = new Set<() => void>();
    return {
      getState: () => state,
      setState: (patch: Record<string, unknown> | ((s: Record<string, unknown>) => Record<string, unknown>)) => {
        const next = typeof patch === 'function' ? patch(state) : patch;
        if (Object.keys(next).every(key => Object.is(state[key], next[key]))) return;
        state = { ...state, ...next }; listeners.forEach(listener => listener());
      },
      subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    } as unknown as NonNullable<React.ContextType<typeof GroupChannelContext>>;
  }, [channel]);
  const message = {
    messageId: 101, messageType: 'user', message: long ? longText : shortText,
    createdAt: time, updatedAt: 0, customType: '', data: '', extendedMessagePayload: {},
    sendingStatus: 'succeeded', parentMessageId: 0,
    sender: { userId: 'other', nickname: 'Alex', profileUrl: '' },
    reactions: [
      { key: 'like', userIds: selected ? ['other', 'third', 'self'] : ['other', 'third'] },
      ...(mixed ? [{ key: 'curious', userIds: ['other'] }] : []),
    ],
    mentionedUsers: [], threadInfo: { replyCount: 0 },
    isAdminMessage: () => false, isUserMessage: () => true,
    isFileMessage: () => false, isMultipleFilesMessage: () => false, isResendable: () => false,
  } as unknown as SBMessage;
  return <SendbirdProvider appId="" userId="self" breakpoint="600px"
    stringSet={custom ? secondsFormat : { DATE_FORMAT__MESSAGE_CREATED_AT: 'HH:mm' }}>
    <GroupChannelContext.Provider value={store}>
      {/* Published CSS locates the native timestamp using this list direction wrapper. */}
      <div className="sendbird-conversation__messages" dir="ltr">
        <BoundSendbirdMessage custom={custom} message={message} channel={channel} />
      </div>
    </GroupChannelContext.Provider>
  </SendbirdProvider>;
}
