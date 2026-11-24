// Local fixture only: synthetic Chat SDK responses. The UIKit providers, components and actions are the installed package.
import { useEffect, useState } from 'react';
import { SessionHandler, type ConnectionHandler } from '@sendbird/chat';
import type { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { UserMessageCreateParams } from '@sendbird/chat/message';
import { TypingIndicatorType } from '@sendbird/uikit-react';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannelProvider } from '@sendbird/uikit-react/GroupChannel/context';
import GroupChannelUI from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';
import { configureFixtureSession } from '../shared/configure-fixture-session';
import { ReorderedChannel } from './integration';
import { channelName, history, startTime, type RecordOperation, type Scenario } from './scenarios';

const self = { userId: 'self', nickname: 'Self', profileUrl: '' };
const other = { userId: 'other', nickname: 'Alex', profileUrl: '' };
const appId = '00000000-0000-4000-8000-000000000002';

function makeMessage(index: number, text: string, url: string, sender = other, sendingStatus = 'succeeded') {
  return {
    messageId: index + 1, reqId: `req-${index + 1}`, channelUrl: url, channelType: 'group',
    messageType: 'user', message: text, createdAt: startTime + index * 60000, updatedAt: 0,
    customType: '', data: '', extendedMessagePayload: {}, sendingStatus, parentMessageId: 0,
    sender, reactions: [], mentionedUsers: [], mentionType: 'users', threadInfo: { replyCount: 0 },
    metaArrays: [], isAdminMessage: () => false, isUserMessage: () => true, isFileMessage: () => false,
    isMultipleFilesMessage: () => false, isResendable: () => false, getMetaArraysByKeys: () => [],
    serialize: () => JSON.stringify([index, text, sendingStatus]),
  };
}

function createSendbirdBoundary(record: RecordOperation) {
  const groupHandlers = new Map<string, GroupChannelHandler>();
  const connectionHandlers = new Map<string, ConnectionHandler>();
  let activeChannel: GroupChannel | undefined;
  let scenario: Scenario = 'ready';

  function channelFor(url: string) {
    const loaded = url.endsWith('-empty') ? [] : history.map((label, index) => makeMessage(index, label, url));
    function createMessageCollection() {
      const result = {
        hasPrevious: false, hasNext: false, succeededMessages: loaded, pendingMessages: [], failedMessages: [],
        setMessageCollectionHandler: () => undefined,
        loadPrevious: async () => [],
        loadNext: async () => [],
        dispose: () => undefined,
        initialize: () => result,
        onCacheResult: (callback: (error: null, messages: unknown[]) => void) => {
          if (!url.endsWith('-loading')) queueMicrotask(() => callback(null, []));
          return result;
        },
        onApiResult: (callback: (error: null, messages: unknown[]) => void) => {
          if (!url.endsWith('-loading')) queueMicrotask(() => callback(null, loaded));
          return result;
        },
      };
      return result;
    }
    const channel = {
      url, name: channelName, channelType: 'group', coverUrl: '', createdAt: startTime,
      serialize: () => JSON.stringify({ url, name: channelName }),
      isEphemeral: false, isBroadcast: false, isSuper: false, isFrozen: false,
      isGroupChannel: () => true, isOpenChannel: () => false,
      members: [self, other], memberCount: 2, joinedMemberCount: 2, myMemberState: 'joined',
      myRole: 'none', unreadMessageCount: 0, getUnreadMemberCount: () => 0, getUndeliveredMemberCount: () => 0,
      getTypingUsers: () => scenario === 'typing' ? [other] : [],
      startTyping: async () => undefined, endTyping: async () => undefined, markAsRead: async () => undefined,
      createMessageCollection,
      sendUserMessage(params: UserMessageCreateParams) {
        record({ boundary: 'GroupChannel.sendUserMessage', text: params.message });
        const index = loaded.length;
        const finalMessage = makeMessage(index, params.message, url, self);
        const result = {
          onPending(callback: (message: unknown) => void) {
            callback(makeMessage(index, params.message, url, self, 'pending'));
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

  const configureSession: NonNullable<React.ComponentProps<typeof SendbirdProvider>['configureSession']> = (sdk) => {
    const module = configureFixtureSession(sdk, self, async url => {
      if (url.endsWith('-error')) throw new Error('Synthetic channel lookup failure');
      activeChannel = channelFor(url);
      return activeChannel;
    });
    sdk.addConnectionHandler = (id, handler) => { connectionHandlers.set(id, handler); };
    sdk.removeConnectionHandler = (id) => { connectionHandlers.delete(id); };
    module.addGroupChannelHandler = (id, handler) => { groupHandlers.set(id, handler); };
    module.removeGroupChannelHandler = (id) => { groupHandlers.delete(id); };
    return new SessionHandler();
  };

  return {
    configureSession,
    setScenario(next: Scenario) {
      const wasOffline = scenario === 'offline';
      scenario = next;
      if (wasOffline !== (next === 'offline')) {
        for (const handler of connectionHandlers.values()) {
          if (next === 'offline') handler.onReconnectStarted?.();
          else handler.onReconnectSucceeded?.();
        }
      }
      if (activeChannel) {
        for (const handler of groupHandlers.values()) handler.onTypingStatusUpdated?.(activeChannel);
      }
    },
  };
}

export function SendbirdFixture({ record, scenario, reordered }: {
  record: RecordOperation;
  scenario: Scenario;
  reordered: boolean;
}) {
  const [boundary] = useState(() => createSendbirdBoundary(record));
  useEffect(() => boundary.setScenario(scenario), [boundary, scenario]);
  const channelUrl = ['error', 'loading', 'empty'].includes(scenario) ? `fixture-${scenario}` : 'fixture-ready';
  return <SendbirdProvider appId={appId} userId="self" configureSession={boundary.configureSession}
    sdkInitParams={{ localCacheEnabled: false }}
    uikitOptions={{ groupChannel: { enableTypingIndicator: true, typingIndicatorTypes: new Set([TypingIndicatorType.Text]) } }}>
    {reordered ? <ReorderedChannel channelUrl={channelUrl} /> : (
      <GroupChannelProvider channelUrl={channelUrl} disableMarkAsRead>
        <GroupChannelUI />
      </GroupChannelProvider>
    )}
  </SendbirdProvider>;
}
