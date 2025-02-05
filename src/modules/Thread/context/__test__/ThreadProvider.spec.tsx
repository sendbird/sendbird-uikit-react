import React from 'react';
import { act, waitFor, renderHook } from '@testing-library/react';
import { ThreadProvider, ThreadState } from '../ThreadProvider';
import useThread from '../useThread';
import { SendableMessageType } from '../../../../utils';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { EmojiContainer } from '@sendbird/chat';

class MockMessageMethod {
  _onPending: (message: SendableMessageType) => void;

  _onFailed: (message: SendableMessageType) => void;

  _onSucceeded: (message: SendableMessageType) => void;

  constructor(message, willSucceed = true) {
    this._onPending = undefined;
    this._onFailed = undefined;
    this._onSucceeded = undefined;

    this.init(message, willSucceed);
  }

  init(message, willSucceed) {
    setTimeout(() => this._onPending?.(message), 0);
    setTimeout(() => {
      if (willSucceed) {
        this._onSucceeded?.(message);
      } else {
        this._onFailed?.(message);
      }
    }, 300);
  }

  onPending(func) {
    this._onPending = func;
    return this;
  }

  onFailed(func) {
    this._onFailed = func;
    return this;
  }

  onSucceeded(func) {
    this._onSucceeded = func;
    return this;
  }
}

const mockSendUserMessage = jest.fn();

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: jest.fn().mockImplementation(async (message) => mockNewMessage(message)),
  sendUserMessage: mockSendUserMessage,
};

const mockNewMessage = (message) => ({
  messageId: 42,
  message: message ?? 'new message',
});

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);

const mockState = {
  stores: {
    sdkStore: {
      sdk: {
        groupChannel: {
          getChannel: mockGetChannel,
        },
      },
      initialized: true,
    },
    userStore: { user: { userId: 'test-user-id' } },
  },
  config: {
    logger: console,
    pubSub: {
      publish: jest.fn(),
    },
    groupChannel: {
      enableMention: true,
      enableReactions: true,
    },
  },
};
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({ state: mockState })),
}));

describe('ThreadProvider', () => {
  const initialState: ThreadState = {
    channelUrl: '',
    message: null,
    onHeaderActionClick: undefined,
    onMoveToParentMessage: undefined,
    onBeforeSendUserMessage: undefined,
    onBeforeSendFileMessage: undefined,
    onBeforeSendVoiceMessage: undefined,
    onBeforeSendMultipleFilesMessage: undefined,
    onBeforeDownloadFileMessage: undefined,
    isMultipleFilesMessageEnabled: undefined,
    filterEmojiCategoryIds: undefined,
    currentChannel: null,
    allThreadMessages: [],
    localThreadMessages: [],
    parentMessage: null,
    channelState: ChannelStateTypes.NIL,
    parentMessageState: ParentMessageStateTypes.NIL,
    threadListState: ThreadListStateTypes.NIL,
    hasMorePrev: false,
    hasMoreNext: false,
    emojiContainer: {} as EmojiContainer,
    isMuted: false,
    isChannelFrozen: false,
    currentUserId: '',
    typingMembers: [],
    nicknamesMap: null,
  };

  const initialMockMessage = {
    messageId: 1,
  } as SendableMessageType;

  beforeEach(() => {
    jest.clearAllMocks();
    const stateContextValue = { state: mockState };
    (useSendbird as jest.Mock).mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('provides the correct initial state', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel-url">{children}</ThreadProvider>
    );

    await act(async () => {
      const { result } = renderHook(() => useThread(), { wrapper });
      expect(result.current.state).toEqual(initialState);
    });

  });

  it('provides correct actions through useThread hook', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider message={initialMockMessage} channelUrl="test-channel">{children}</ThreadProvider>
    );

    await act(async () => {
      const { result } = renderHook(() => useThread(), { wrapper });
      await waitFor(() => {
        expect(result.current.actions).toHaveProperty('toggleReaction');
        expect(result.current.actions).toHaveProperty('sendMessage');
        expect(result.current.actions).toHaveProperty('sendFileMessage');
        expect(result.current.actions).toHaveProperty('sendVoiceMessage');
        expect(result.current.actions).toHaveProperty('sendMultipleFilesMessage');
        expect(result.current.actions).toHaveProperty('resendMessage');
        expect(result.current.actions).toHaveProperty('initializeThreadFetcher');
        expect(result.current.actions).toHaveProperty('fetchPrevThreads');
        expect(result.current.actions).toHaveProperty('fetchNextThreads');
        expect(result.current.actions).toHaveProperty('updateMessage');
        expect(result.current.actions).toHaveProperty('deleteMessage');
        expect(result.current.actions).toHaveProperty('setCurrentUserId');
        expect(result.current.actions).toHaveProperty('getChannelStart');
        expect(result.current.actions).toHaveProperty('getChannelSuccess');
        expect(result.current.actions).toHaveProperty('getChannelFailure');
        expect(result.current.actions).toHaveProperty('getParentMessageStart');
        expect(result.current.actions).toHaveProperty('getParentMessageSuccess');
        expect(result.current.actions).toHaveProperty('getParentMessageFailure');
        expect(result.current.actions).toHaveProperty('setEmojiContainer');
        expect(result.current.actions).toHaveProperty('onMessageReceived');
        expect(result.current.actions).toHaveProperty('onMessageUpdated');
        expect(result.current.actions).toHaveProperty('onMessageDeleted');
        expect(result.current.actions).toHaveProperty('onMessageDeletedByReqId');
        expect(result.current.actions).toHaveProperty('onReactionUpdated');
        expect(result.current.actions).toHaveProperty('onUserMuted');
        expect(result.current.actions).toHaveProperty('onUserUnmuted');
        expect(result.current.actions).toHaveProperty('onUserBanned');
        expect(result.current.actions).toHaveProperty('onUserUnbanned');
        expect(result.current.actions).toHaveProperty('onUserLeft');
        expect(result.current.actions).toHaveProperty('onChannelFrozen');
        expect(result.current.actions).toHaveProperty('onChannelUnfrozen');
        expect(result.current.actions).toHaveProperty('onOperatorUpdated');
        expect(result.current.actions).toHaveProperty('onTypingStatusUpdated');
        expect(result.current.actions).toHaveProperty('sendMessageStart');
        expect(result.current.actions).toHaveProperty('sendMessageSuccess');
        expect(result.current.actions).toHaveProperty('sendMessageFailure');
        expect(result.current.actions).toHaveProperty('resendMessageStart');
        expect(result.current.actions).toHaveProperty('onFileInfoUpdated');
        expect(result.current.actions).toHaveProperty('initializeThreadListStart');
        expect(result.current.actions).toHaveProperty('initializeThreadListSuccess');
        expect(result.current.actions).toHaveProperty('initializeThreadListFailure');
        expect(result.current.actions).toHaveProperty('getPrevMessagesStart');
        expect(result.current.actions).toHaveProperty('getPrevMessagesSuccess');
        expect(result.current.actions).toHaveProperty('getPrevMessagesFailure');
        expect(result.current.actions).toHaveProperty('getNextMessagesStart');
        expect(result.current.actions).toHaveProperty('getNextMessagesSuccess');
        expect(result.current.actions).toHaveProperty('getNextMessagesFailure');
      });
    });

  });

  it('updates state when props change', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage} onHeaderActionClick={() => {}}>
        {children}
      </ThreadProvider>
    );

    await act(async () => {
      const { result } = renderHook(() => useThread(), { wrapper });

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });

      result.current.actions.setCurrentUserId('new-user-id');

      await waitFor(() => {
        expect(result.current.state.currentUserId).toEqual('new-user-id');
      });
    });
  });

  it('update state correctly when sendMessage is called', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={initialMockMessage}>
        {children}
      </ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.currentChannel).not.toBe(undefined);
    });

    mockSendUserMessage.mockImplementation((propsMessage) => new MockMessageMethod(mockNewMessage(propsMessage), true));
    result.current.actions.sendMessage({ message: 'Test Message' });

    await waitFor(() => {
      expect(result.current.state.localThreadMessages.at(-1)).toHaveProperty('messageId', 42);
    });
  });

});
