import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import useThread from '../useThread';
import { act, waitFor } from '@testing-library/react';
import { ThreadProvider } from '../ThreadProvider';
import { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes } from '../../types';
import { PREV_THREADS_FETCH_SIZE } from '../../consts';

const mockApplyReactionEvent = jest.fn();

const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
};

const mockNewMessage = {
  messageId: 42,
  message: 'new message',
};

const mockParentMessage = {
  messageId: 100,
  parentMessageId: 0,
  parentMessage: null,
  message: 'parent message',
  reqId: 100,
  applyReactionEvent: mockApplyReactionEvent,
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockGetMessage = jest.fn().mockResolvedValue(mockParentMessage);
const mockPubSub = { publish: jest.fn(), subscribe: jest.fn() };

jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {
            message: {
              getMessage: mockGetMessage,
            },
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
        pubSub: mockPubSub,
        groupChannel: {
          enableMention: true,
          enableReactions: true,
        },
      },
    },
  })),
}));

describe('useThread', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if used outside of ThreadProvider', () => {
    const { result } = renderHook(() => useThread());
    expect(result.error).toEqual(new Error('useThread must be used within a ThreadProvider'));
  });

  it('handles sendMessageStart action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { sendMessageStart } = result.current.actions;

    const mockMessage = { messageId: 2, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
    });

    await waitFor(() => {
      expect(result.current.state.localThreadMessages).toContain(mockMessage);
    });
  });

  it('handles sendMessageSuccess action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { sendMessageStart, sendMessageSuccess } = result.current.actions;

    const mockMessage = { messageId: 2, message: 'Test message', reqId: 2 };
    const mockMessage2 = { messageId: 3, message: 'Test message', reqId: 3 };

    await act(() => {
      sendMessageStart(mockMessage);
      sendMessageSuccess(mockMessage);
      sendMessageStart(mockMessage2);
      sendMessageSuccess(mockMessage2);
    });

    await waitFor(() => {
      expect(result.current.state.allThreadMessages).toContain(mockMessage);
      expect(result.current.state.allThreadMessages).toContain(mockMessage2);
    });
  });

  it('handles sendMessageFailure action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { sendMessageStart, sendMessageFailure } = result.current.actions;

    const mockMessage = { messageId: 2, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
      sendMessageFailure(mockMessage);
    });

    await waitFor(() => {
      expect(result.current.state.localThreadMessages).toContain(mockMessage);
    });
  });

  it('handles resendMessageStart action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { sendMessageStart, resendMessageStart } = result.current.actions;

    const mockMessage = { messageId: 2, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
      resendMessageStart(mockMessage);
    });

    await waitFor(() => {
      expect(result.current.state.localThreadMessages).toContain(mockMessage);
    });
  });

  it('handles onMessageUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel">{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { sendMessageStart, sendMessageSuccess, onMessageUpdated } = result.current.actions;

    const otherChannel = {
      url: 'test-channel2',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const channel = {
      url: 'test-channel',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const mockMessage = { messageId: 1, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
      sendMessageSuccess(mockMessage);
      onMessageUpdated(otherChannel, mockMessage);
      onMessageUpdated(channel, mockMessage);
    });

    await waitFor(() => {
      expect(result.current.state.allThreadMessages).toContain(mockMessage);
    });
  });

  it('handles onMessageDeleted action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { sendMessageStart, sendMessageSuccess, onMessageDeleted } = result.current.actions;

    const otherChannel = {
      url: 'test-channel2',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const channel = {
      url: 'test-channel',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const mockMessage = { messageId: 1, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
      sendMessageSuccess(mockMessage);
      onMessageDeleted(otherChannel, mockMessage.messageId);
      onMessageDeleted(channel, mockMessage.messageId);
      onMessageDeleted(channel, 100);
    });

    await waitFor(() => {
      expect(result.current.state.parentMessage).toBe(null);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
      expect(result.current.state.allThreadMessages).toBeEmpty();
    });
  });

  it('handles onMessageDeletedByReqId action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { sendMessageStart, onMessageDeletedByReqId } = result.current.actions;

    const mockMessage = { messageId: 1, message: 'Test message', reqId: 2 };

    await act(() => {
      sendMessageStart(mockMessage);
      onMessageDeletedByReqId(mockMessage.reqId);
    });

    await waitFor(() => {
      expect(result.current.state.localThreadMessages).toBeEmpty();
    });
  });

  it('handles initializeThreadListStart action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { initializeThreadListStart } = result.current.actions;

    await act(() => {
      initializeThreadListStart();
    });

    await waitFor(() => {
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.LOADING);
    });
  });

  it('handles initializeThreadListSuccess action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { initializeThreadListStart, initializeThreadListSuccess } = result.current.actions;

    await act(() => {
      initializeThreadListStart();
      initializeThreadListSuccess(mockParentMessage, mockParentMessage, []);
    });

    await waitFor(() => {
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.INITIALIZED);
    });
  });

  it('handles initializeThreadListFailure action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { initializeThreadListStart, initializeThreadListFailure } = result.current.actions;

    await act(() => {
      initializeThreadListStart();
      initializeThreadListFailure();
    });

    await waitFor(() => {
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.LOADING);
      expect(result.current.state.allThreadMessages).toBeEmpty();
    });
  });

  it('handles getPrevMessagesSuccess action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { getPrevMessagesStart, getPrevMessagesSuccess } = result.current.actions;

    await act(() => {
      getPrevMessagesStart();
      getPrevMessagesSuccess(Array(PREV_THREADS_FETCH_SIZE).map((e, i) => {
        return { messageId: i + 10, message: `meesage Id: ${i + 10}`, reqId: i + 10 };
      }));
    });

    await waitFor(() => {
      expect(result.current.state.hasMorePrev).toBe(true);
      expect(result.current.state.allThreadMessages).toHaveLength(30);
    });
  });

  it('handles getPrevMessagesFailure action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { getPrevMessagesStart, getPrevMessagesFailure } = result.current.actions;

    await act(() => {
      getPrevMessagesStart();
      getPrevMessagesFailure();
    });

    await waitFor(() => {
      expect(result.current.state.hasMorePrev).toBe(false);
    });
  });

  it('handles getNextMessagesSuccess action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { getNextMessagesStart, getNextMessagesSuccess } = result.current.actions;

    await act(() => {
      getNextMessagesStart();
      getNextMessagesSuccess(Array(PREV_THREADS_FETCH_SIZE).map((e, i) => {
        return { messageId: i + 10, message: `meesage Id: ${i + 10}`, reqId: i + 10 };
      }));
    });

    await waitFor(() => {
      expect(result.current.state.hasMoreNext).toBe(true);
      expect(result.current.state.allThreadMessages).toHaveLength(30);
    });
  });

  it('handles getNextMessagesFailure action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { getNextMessagesStart, getNextMessagesFailure } = result.current.actions;

    await act(() => {
      getNextMessagesStart();
      getNextMessagesFailure();
    });

    await waitFor(() => {
      expect(result.current.state.hasMoreNext).toBe(false);
    });
  });

  it('handles setEmojiContainer action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    const { result } = renderHook(() => useThread(), { wrapper });
    const { setEmojiContainer } = result.current.actions;

    const emojiContainer = {
      emojiHash: 'test-hash',
      emojiCategories: [{
        id: 'test-category-id',
        name: 'test-category',
        url: 'test-category-url',
        emojis: [],
      }],
    };

    await act(() => {
      setEmojiContainer(emojiContainer);
    });

    await waitFor(() => {
      expect(result.current.state.emojiContainer).toBe(emojiContainer);
    });
  });

  it('handles onMessageReceived action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onMessageReceived } = result.current.actions;

    const otherChannel = {
      url: 'test-channel2',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const channel = {
      url: 'test-channel',
      members: [{ userId: '1', nickname: 'user1' }],
      updateUserMessage: jest.fn().mockImplementation(async () => mockNewMessage),
    };
    const mockMessage = { messageId: 1, message: 'Test message', reqId: 2, parentMessage: mockParentMessage };

    await act(() => {
      onMessageReceived(otherChannel, mockMessage);
      onMessageReceived(channel, mockMessage);
      onMessageReceived(channel, mockMessage);
    });

    await waitFor(() => {
      expect(result.current.state.allThreadMessages).toContain(mockMessage);
    });
  });

  it('handles onReactionUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { sendMessageStart, sendMessageSuccess, onReactionUpdated } = result.current.actions;

    const mockMessage = { messageId: 1, message: 'Test message', reqId: 2, parentMessage: mockParentMessage };

    await act(() => {
      sendMessageStart(mockMessage);
      sendMessageSuccess(mockMessage);
      onReactionUpdated({
        messageId: mockParentMessage.messageId,
        userId: 'test-user-id',
        key: '1',
        operation: 'ADD',
        updatedAt: 0,
      });
    });

    await waitFor(() => {
      expect(mockApplyReactionEvent).toHaveBeenCalled();
    });
  });

  it('handles onUserMuted action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserMuted } = result.current.actions;

    await act(() => {
      onUserMuted(mockChannel, { userId: 'other-user-id' });
      onUserMuted(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.isMuted).toBe(true);
    });
  });

  it('handles onUserUnmuted action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserUnmuted } = result.current.actions;

    await act(() => {
      onUserUnmuted(mockChannel, { userId: 'other-user-id' });
      onUserUnmuted(mockChannel, { userId: 'test-user-id' });
    });

    await waitFor(() => {
      expect(result.current.state.isMuted).toBe(false);
    });
  });

  it('handles onUserBanned action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserBanned } = result.current.actions;

    await act(() => {
      onUserBanned();
    });

    await waitFor(() => {
      expect(result.current.state.channelState).toBe(ChannelStateTypes.NIL);
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.NIL);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
    });
  });

  it('handles onUserUnbanned action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserUnbanned } = result.current.actions;

    await act(() => {
      onUserUnbanned();
    });
  });

  it('handles onUserLeft action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onUserLeft } = result.current.actions;

    await act(() => {
      onUserLeft();
    });

    await waitFor(() => {
      expect(result.current.state.channelState).toBe(ChannelStateTypes.NIL);
      expect(result.current.state.threadListState).toBe(ThreadListStateTypes.NIL);
      expect(result.current.state.parentMessageState).toBe(ParentMessageStateTypes.NIL);
    });
  });

  it('handles onChannelFrozen action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onChannelFrozen } = result.current.actions;

    await act(() => {
      onChannelFrozen();
    });

    await waitFor(() => {
      expect(result.current.state.isChannelFrozen).toBe(true);
    });
  });

  it('handles onChannelFrozen action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onChannelFrozen, onChannelUnfrozen } = result.current.actions;

    await act(() => {
      onChannelFrozen();
      onChannelUnfrozen();
    });

    await waitFor(() => {
      expect(result.current.state.isChannelFrozen).toBe(false);
    });
  });

  it('handles onOperatorUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onOperatorUpdated } = result.current.actions;

    const newMockChannel = {
      url: 'test-channel',
    };
    await act(() => {
      onOperatorUpdated(newMockChannel);
    });

    await waitFor(() => {
      expect(result.current.state.currentChannel).toBe(newMockChannel);
    });
  });

  it('handles onTypingStatusUpdated action correctly', async () => {
    const wrapper = ({ children }) => (
      <ThreadProvider channelUrl="test-channel" message={mockParentMessage}>{children}</ThreadProvider>
    );

    let result;
    await act(async () => {
      result = renderHook(() => useThread(), { wrapper }).result;

      await waitFor(() => {
        expect(result.current.state.currentChannel).not.toBe(undefined);
      });
    });
    const { onTypingStatusUpdated } = result.current.actions;
    const mockMember = { userId: '1', nickname: 'user1' };

    await act(() => {
      onTypingStatusUpdated(mockChannel, [mockMember]);
    });

    await waitFor(() => {
      expect(result.current.state.typingMembers).toContain(mockMember);
    });
  });

});
