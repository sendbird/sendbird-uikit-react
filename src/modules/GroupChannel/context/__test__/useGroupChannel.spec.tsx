import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { GroupChannelProvider } from '../GroupChannelProvider';
import { useGroupChannel } from '../hooks/useGroupChannel';
import { SendableMessageType } from '../../../../utils';

const mockLogger = { warning: jest.fn() };
const mockChannel = {
  url: 'test-channel',
  members: [{ userId: '1', nickname: 'user1' }],
};

const mockGetChannel = jest.fn().mockResolvedValue(mockChannel);
const mockMessageCollection = {
  dispose: jest.fn(),
  setMessageCollectionHandler: jest.fn(),
  initialize: jest.fn().mockResolvedValue(null),
  loadPrevious: jest.fn(),
  loadNext: jest.fn(),
};
jest.mock('../../../../hooks/useSendbirdStateContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
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
      markAsReadScheduler: {
        push: jest.fn(),
      },
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
  })),
}));

describe('useGroupChannel', () => {
  const wrapper = ({ children }) => (
    <GroupChannelProvider channelUrl={mockChannel.url}>
      {children}
    </GroupChannelProvider>
  );

  describe('State management', () => {
    it('provides initial state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      expect(result.current.state).toEqual(expect.objectContaining({
        currentChannel: null,
        channelUrl: mockChannel.url,
        fetchChannelError: null,
        quoteMessage: null,
        animatedMessageId: null,
        isScrollBottomReached: true,
      }));
    });

    it('updates channel state', () => {
      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(() => {
        result.current.actions.setCurrentChannel(mockChannel as GroupChannel);
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
        result.current.actions.handleChannelError(error);
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
      const mockChannelWithReactions = {
        ...mockChannel,
        deleteReaction: jest.fn().mockRejectedValue(mockError),
      };

      const { result } = renderHook(() => useGroupChannel(), { wrapper });

      act(async () => {
        result.current.actions.setCurrentChannel(mockChannelWithReactions as any);
      });

      act(async () => {
        await result.current.actions.toggleReaction(
          { messageId: 1 } as SendableMessageType,
          'thumbs_up',
          true,
        );
        await waitFor(() => {
          expect(mockLogger.warning).toHaveBeenCalledWith(
            'Failed to delete reaction:',
            mockError,
          );
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

      act(async () => {
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
