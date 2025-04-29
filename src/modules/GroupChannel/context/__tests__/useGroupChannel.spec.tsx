import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelProvider, GroupChannelContext } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';
import { SendableMessageType } from '../../../../utils';

const mockLogger = { warning: jest.fn() };
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
  serialize: () => JSON.stringify(this),
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: jest.fn(),
  setMessageCollectionHandler: jest.fn(),
  initialize: jest.fn().mockResolvedValue(null),
  loadPrevious: jest.fn(),
  loadNext: jest.fn(),
  messages: [],
};
const mockMarkAsReadScheduler = { push: jest.fn() };
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: {
      stores: {
        sdkStore: {
          sdk: {
            groupChannel: {
              getChannel: mockGetChannel,
              addGroupChannelHandler: jest.fn(),
              removeGroupChannelHandler: jest.fn(),
            },
            createMessageCollection: jest.fn().mockReturnValue(mockMessageCollection),
          },
          initialized: true,
        },
      },
      config: {
        logger: mockLogger,
        markAsReadScheduler: mockMarkAsReadScheduler,
        groupChannel: {
          replyType: 'NONE',
          threadReplySelectType: 'PARENT',
        },
        groupChannelSettings: {
          enableMessageSearch: true,
        },
        isOnline: true,
        pubSub: {
          subscribe: () => ({ remove: jest.fn() }),
        },
      },
    },
  })),
}));
jest.mock('../utils', () => ({
  getMessageTopOffset: jest.fn().mockReturnValue(100),
}));

const createMockStore = (initialState = {}) => {
  let state = {
    currentChannel: null,
    fetchChannelError: null,
    quoteMessage: null,
    animatedMessageId: null,
    isScrollBottomReached: true,
    messages: [],
    scrollRef: { current: null },
    hasNext: () => false,
    resetWithStartingPoint: jest.fn(),
    scrollPubSub: {
      publish: jest.fn(),
    },
    resetNewMessages: jest.fn(),
    ...initialState,
  };

  const subscribers = new Set<() => void>();

  return {
    getState: () => state,
    setState: (updater: (prev: typeof state) => typeof state) => {
      state = updater(state);
      subscribers.forEach(subscriber => subscriber());
    },
    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
};

const createWrapper = (mockStore) => {
  return ({ children }) => (
    <GroupChannelContext.Provider value={mockStore}>
      {children}
    </GroupChannelContext.Provider>
  );
};

describe('useGroupChannel', () => {
  const wrapper = ({ children }) => (
    <GroupChannelProvider channelUrl={mockChannel.url}>
      {children}
    </GroupChannelProvider>
  );

  describe('State management', () => {
    it('provides initial state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      expect(result.current.state).toMatchObject({
        currentChannel: null,
        channelUrl: mockChannel.url,
        fetchChannelError: null,
        quoteMessage: null,
        animatedMessageId: null,
        isScrollBottomReached: true,
      });
    });

    it('updates channel state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(() => {
        result.current.actions.setCurrentChannel(mockChannel as unknown as GroupChannel);
      });

      expect(result.current.state.currentChannel).toEqual(mockChannel);
      expect(result.current.state.fetchChannelError).toBeNull();

      // nicknamesMap should be created from channel members
      expect(result.current.state.nicknamesMap.get('1')).toBe('user1');
    });

    it('handles channel error', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });
      const error = new Error('Failed to fetch channel');

      act(() => {
        result.current.actions.handleChannelError(error as any);
      });

      expect(result.current.state.currentChannel).toBeNull();
      expect(result.current.state.fetchChannelError).toBe(error);
      expect(result.current.state.quoteMessage).toBeNull();
      expect(result.current.state.animatedMessageId).toBeNull();
    });

    it('manages quote message state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });
      const mockMessage = { messageId: 1, message: 'test' } as SendableMessageType;

      act(() => {
        result.current.actions.setQuoteMessage(mockMessage);
      });

      expect(result.current.state.quoteMessage).toEqual(mockMessage);

      act(() => {
        result.current.actions.setQuoteMessage(null);
      });

      expect(result.current.state.quoteMessage).toBeNull();
    });

    it('manages animated message state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(() => {
        result.current.actions.setAnimatedMessageId(123);
      });

      expect(result.current.state.animatedMessageId).toBe(123);

      act(() => {
        result.current.actions.setAnimatedMessageId(null);
      });

      expect(result.current.state.animatedMessageId).toBeNull();
    });

    it('manages scroll bottom reached state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      expect(result.current.state.isScrollBottomReached).toBe(true); // initial state

      act(() => {
        result.current.actions.setIsScrollBottomReached(false);
      });

      expect(result.current.state.isScrollBottomReached).toBe(false);

      act(() => {
        result.current.actions.setIsScrollBottomReached(true);
      });

      expect(result.current.state.isScrollBottomReached).toBe(true);
    });
  });

  describe('Channel actions', () => {
    describe('scrollToBottom', () => {
      it('should not scroll if scrollRef is not set', async () => {
        const mockStore = createMockStore({
          scrollRef: { current: null },
          scrollPubSub: { publish: jest.fn() },
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToBottom(true);
          await waitFor(() => {
            expect(result.current.state.scrollPubSub.publish).not.toHaveBeenCalled();
          });
        });
      });
      it('should reset new messages and mark as read if no next messages', async () => {
        const mockStore = createMockStore({
          scrollRef: { current: {} },
          hasNext: () => false,
          currentChannel: mockChannel,
          resetNewMessages: jest.fn(),
          scrollPubSub: { publish: jest.fn() },
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToBottom(true);
          await waitFor(() => {
            expect(result.current.state.resetNewMessages).toHaveBeenCalled();
            expect(mockMarkAsReadScheduler.push).toHaveBeenCalledWith(mockChannel);
          });
        });
      });
      it('should scroll to bottom when online and has next message', async () => {
        const mockScrollRef = { current: {} };
        const mockScrollPubSub = { publish: jest.fn() };
        const mockStore = createMockStore({
          scrollRef: mockScrollRef,
          hasNext: () => true,
          resetWithStartingPoint: jest.fn().mockResolvedValue(undefined),
          scrollPubSub: mockScrollPubSub,
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToBottom(true);
          await waitFor(() => {
            expect(result.current.state.resetWithStartingPoint).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER);
            expect(result.current.state.scrollPubSub.publish).toHaveBeenCalledWith('scrollToBottom', { animated: true });
          });
        });
      });
    });
    describe('scrollToMessage', () => {
      it('should not scroll if element is not found', async () => {
        const mockStore = createMockStore({
          messages: [],
          scrollRef: { current: document.createElement('div') },
          scrollPubSub: { publish: jest.fn() },
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToMessage(9999, 9999, true, true);
          await waitFor(() => {
            expect(result.current.state.scrollPubSub.publish).not.toHaveBeenCalled();
          });
        });
      });
      it('scroll to message when message exists', async () => {
        const mockMessage = { messageId: 123, createdAt: 1000, serialize: () => JSON.stringify(this) };
        const mockStore = createMockStore({
          messages: [mockMessage],
          scrollRef: { current: document.createElement('div') },
          scrollPubSub: { publish: jest.fn() },
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToMessage(mockMessage.createdAt, mockMessage.messageId, true, true);
          await waitFor(() => {
            expect(mockStore.getState().scrollPubSub.publish)
              .toHaveBeenCalledWith('scroll', {
                top: 100,
                animated: true,
              });
            expect(result.current.state.animatedMessageId).toBe(mockMessage.messageId);
          });
        });
      });
      it('loads message and scrolls when message does not exist', async () => {
        const mockScrollPubSub = { publish: jest.fn() };
        const mockResetWithStartingPoint = jest.fn().mockResolvedValue(undefined);
        const mockStore = createMockStore({
          messages: [],
          initialized: true,
          scrollRef: {
            current: document.createElement('div'),
          },
          scrollPubSub: mockScrollPubSub,
          resetWithStartingPoint: mockResetWithStartingPoint,
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        await act(async () => {
          await result.current.actions.scrollToMessage(1000, 123, true, true);
          await waitFor(() => {
            expect(mockResetWithStartingPoint).toHaveBeenCalledWith(1000);
            // mocking setTimeout
            jest.runAllTimers();
            expect(mockStore.getState().scrollPubSub.publish)
              .toHaveBeenCalledWith('scroll', {
                top: 100,
                lazy: false,
                animated: true,
              });
            expect(mockStore.getState().animatedMessageId).toBe(123);
          });
        });
      });
    });
    it('processes reaction toggle', async () => {
      const mockChannelWithReactions = {
        ...mockChannel,
        addReaction: jest.fn().mockResolvedValue({}),
        deleteReaction: jest.fn().mockResolvedValue({}),
      };

      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(() => {
        result.current.actions.setCurrentChannel(mockChannelWithReactions as any);
      });

      const mockMessage = { messageId: 1 };
      const emojiKey = 'thumbs_up';

      act(() => {
        result.current.actions.toggleReaction(
          mockMessage as SendableMessageType,
          emojiKey,
          false,
        );
      });

      expect(mockChannelWithReactions.addReaction)
        .toHaveBeenCalledWith(mockMessage, emojiKey);

      // Test removing reaction
      act(() => {
        result.current.actions.toggleReaction(
          mockMessage as SendableMessageType,
          emojiKey,
          true,
        );
      });

      expect(mockChannelWithReactions.deleteReaction)
        .toHaveBeenCalledWith(mockMessage, emojiKey);
    });

    it('logs errors for reaction deletion failure', async () => {
      const mockError = new Error('Failed to delete reaction');
      const deleteReaction = jest.fn().mockRejectedValue(mockError);
      const mockChannelWithReactions = {
        ...mockChannel,
        deleteReaction,
      };

      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(() => {
        result.current.actions.setCurrentChannel(mockChannelWithReactions as any);
      });

      act(() => {
        result.current.actions.toggleReaction(
          { messageId: 1 } as SendableMessageType,
          'thumbs_up',
          true,
        );
      });

      waitFor(() => {
        expect(mockChannelWithReactions.deleteReaction).toHaveBeenCalled();
        expect(mockLogger.warning).toHaveBeenCalledWith(
          'Failed to delete reaction:',
          mockError,
        );
      });

    });

    describe('toggleReaction', () => {
      it('should be able to add and delete reactions', async () => {
        const mockChannel = {
          addReaction: jest.fn().mockResolvedValue(undefined),
          deleteReaction: jest.fn().mockResolvedValue(undefined),
        };
        const mockStore = createMockStore({
          currentChannel: mockChannel,
        });
        const { result } = renderHook(() => useGroupChannel(), {
          wrapper: createWrapper(mockStore),
        });
        const mockMessage = { messageId: 123 } as SendableMessageType;

        await waitFor(() => {
          expect(result.current.actions).toBeDefined();
        });

        await act(async () => {
          result.current.actions.toggleReaction(mockMessage, '👍', false);
          await waitFor(() => {
            expect(mockChannel.addReaction).toHaveBeenCalledWith(mockMessage, '👍');
          });
        });
        await act(async () => {
          result.current.actions.toggleReaction(mockMessage, '👍', true);
          await waitFor(() => {
            expect(mockChannel.deleteReaction).toHaveBeenCalledWith(mockMessage, '👍');
          });
        });
      });
      it('processes successful reaction toggles without logging errors', async () => {
        const mockChannelWithReactions = {
          ...mockChannel,
          addReaction: jest.fn().mockResolvedValue({}),
          deleteReaction: jest.fn().mockResolvedValue({}),
        };

        const { result } = renderHook(() => useGroupChannel(), { wrapper });

        act(() => {
          result.current.actions.setCurrentChannel(mockChannelWithReactions as any);
        });

        act(async () => {
          result.current.actions.toggleReaction(
            { messageId: 1 } as SendableMessageType,
            'thumbs_up',
            false,
          );
          await waitFor(() => {
            expect(mockChannelWithReactions.addReaction).toHaveBeenCalled();
            expect(mockLogger.warning).not.toHaveBeenCalled();
          });
        });

        act(async () => {
          result.current.actions.toggleReaction(
            { messageId: 1 } as SendableMessageType,
            'thumbs_up',
            true,
          );
          await waitFor(() => {
            expect(mockChannelWithReactions.deleteReaction).toHaveBeenCalled();
            expect(mockLogger.warning).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
