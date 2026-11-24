// Local fixture only: a synthetic channel-list store, channel objects and messages.
import { useMemo, useRef } from 'react';
import GroupChannelListUI from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListUI';
import { GroupChannelListContext, type GroupChannelListState } from '@sendbird/uikit-react/GroupChannelList/context';
import type { MessageContentProps } from '@sendbird/uikit-react/ui/MessageContent';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import { ProductMessageContent, renderProductPreview } from './integration';
import { author, channelNames, fileName, fileUrl, generalText, messageData, sentAt, type MessageKind, type SelectedChannel } from './scenario';

type SBMessage = MessageContentProps['message'];
type FixtureProps = {
  kind: MessageKind;
  unread: number;
  selected: SelectedChannel;
  selectChannel: (id: SelectedChannel) => void;
  bodyOnly: boolean;
};

function createMessage(kind: MessageKind, general = false): SBMessage {
  const seed = messageData(kind);
  const file = !general && seed.file === true;
  return {
    messageId: kind === 'new' || kind === 'edited' ? 701 : kind === 'file' ? 702 : 703,
    messageType: file ? 'file' : 'user',
    message: general ? generalText : seed.text,
    sender: { userId: author.id, nickname: author.name, profileUrl: '' },
    customType: general ? '' : seed.category ?? '',
    data: general ? '' : seed.invalidData ?? (seed.payload ? JSON.stringify(seed.payload) : ''),
    createdAt: sentAt, updatedAt: kind === 'edited' ? sentAt + 20 : 0, sendingStatus: 'succeeded',
    reactions: [], parentMessageId: 0, mentionedUsers: [], threadInfo: { replyCount: 0 },
    extendedMessagePayload: {}, name: fileName, url: fileUrl, size: 53, type: file ? 'text/plain' : '',
    isUserMessage: () => !file, isFileMessage: () => file, isAdminMessage: () => false,
    isMultipleFilesMessage: () => false, isResendable: () => false,
  } as unknown as SBMessage;
}

function createChannel(id: SelectedChannel, kind: MessageKind, unread: number) {
  return {
    channelType: 'group', url: id, name: channelNames[id],
    unreadMessageCount: unread, unreadMentionCount: 0, memberCount: 2, coverUrl: '',
    members: [
      { userId: 'self', nickname: 'Current User', profileUrl: '' },
      { userId: author.id, nickname: author.name, profileUrl: '' },
    ],
    lastMessage: createMessage(id === 'general' ? 'text' : kind, id === 'general'),
    isGroupChannel: () => true, isOpenChannel: () => false, isDistinct: false, isPublic: false,
    isEphemeral: false, isBroadcast: false, isSuper: false, isFrozen: false,
    getTypingUsers: () => [], getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
  } as unknown as GroupChannel;
}

function useFixtureStore(state: GroupChannelListState) {
  return useMemo(() => {
    let current = state;
    const listeners = new Set<() => void>();
    return {
      getState: () => current,
      setState: (update: Partial<GroupChannelListState> | ((previous: GroupChannelListState) => Partial<GroupChannelListState>)) => {
        current = { ...current, ...(typeof update === 'function' ? update(current) : update) };
        listeners.forEach(listener => listener());
      },
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => { listeners.delete(listener); };
      },
    };
  }, [state]);
}

export function ChannelPreviewExample({ kind, unread, selected, selectChannel, bodyOnly }: FixtureProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const groupChannels = useMemo(() => [
    createChannel('workshop', kind, unread),
    createChannel('general', 'text', 0),
  ], [kind, unread]);
  const state = useMemo<GroupChannelListState>(() => ({
    groupChannels, selectedChannelUrl: selected, scrollRef: scrollRef as GroupChannelListState['scrollRef'],
    initialized: true, typingChannelUrls: [], allowProfileEdit: false, disableAutoSelect: true,
    className: '', refreshing: false, isTypingIndicatorEnabled: false, isMessageReceiptStatusEnabled: false,
    onChannelCreated: () => undefined, refresh: async () => undefined, loadMore: async () => undefined,
    onChannelSelect: channel => {
      if (channel?.url === 'workshop' || channel?.url === 'general') selectChannel(channel.url);
    },
  }), [groupChannels, selected, selectChannel]);
  const store = useFixtureStore(state);
  const channel = groupChannels.find(candidate => candidate.url === selected)!;
  return <div className="demo-panes">
    <section aria-label="Channel previews" className="channel-list-pane sendbird-channel-list">
      <GroupChannelListContext.Provider value={store}>
        <GroupChannelListUI renderHeader={() => <h3>Channels</h3>}
          renderChannelPreview={bodyOnly ? undefined : renderProductPreview} />
      </GroupChannelListContext.Provider>
    </section>
    <section aria-label="Message body" className="message-pane" data-message-id={channel.lastMessage?.messageId}>
      <h3>{channelNames[selected]}</h3>
      <div className="sendbird-conversation__messages" dir="ltr">
        <ProductMessageContent channel={channel} userId="self" message={channel.lastMessage as SBMessage} />
      </div>
    </section>
  </div>;
}
