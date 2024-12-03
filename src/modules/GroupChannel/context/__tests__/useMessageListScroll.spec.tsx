import { renderHook, act, waitFor } from '@testing-library/react';
import { useMessageListScroll } from '../hooks/useMessageListScroll';
import { useGroupChannel } from '../hooks/useGroupChannel';

jest.mock('../hooks/useGroupChannel', () => ({
  useGroupChannel: jest.fn(),
}));

describe('useMessageListScroll', () => {
  const mockSetIsScrollBottomReached = jest.fn();

  beforeEach(() => {
    (useGroupChannel as jest.Mock).mockImplementation(() => ({
      state: { isScrollBottomReached: true },
      actions: { setIsScrollBottomReached: mockSetIsScrollBottomReached },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization and Basic Behavior', () => {
    it('should set the initial state correctly', () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));

      expect(result.current.scrollRef.current).toBe(null);
      expect(result.current.isScrollBottomReached).toBe(true);
      expect(result.current.scrollDistanceFromBottomRef.current).toBe(0);
      expect(result.current.scrollPositionRef.current).toBe(0);
      expect(typeof result.current.scrollPubSub.publish).toBe('function');
      expect(typeof result.current.scrollPubSub.subscribe).toBe('function');
    });
  });

  describe('scrollToBottom', () => {
    it('should call resolve only if scrollRef is null', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));
      const resolveMock = jest.fn();

      await act(async () => {
        result.current.scrollPubSub.publish('scrollToBottom', { resolve: resolveMock });
        await waitFor(() => {
          expect(resolveMock).toHaveBeenCalled();
        });
      });
    });

    it('should use scrollTop if scroll method is not defined', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));

      const mockScrollElement = {
        scrollHeight: 1000,
        scrollTop: 0,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        const promise = new Promise<void>((resolve) => {
          result.current.scrollPubSub.publish('scrollToBottom', { resolve });
        });
        await promise;
      });

      expect(mockScrollElement.scrollTop).toBe(1000);
    });

    it('should use smooth behavior if behavior parameter is smooth', async () => {
      const { result } = renderHook(() => useMessageListScroll('smooth'));

      const mockScroll = jest.fn();
      const mockScrollElement = {
        scroll: mockScroll,
        scrollHeight: 1000,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scrollToBottom', {});
        await waitFor(() => {
          expect(mockScroll).toHaveBeenCalledWith({
            top: 1000,
            behavior: 'smooth',
          });
        });
      });
    });
  });

  describe('scroll', () => {
    it('should do nothing if scrollRef is null', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));
      const resolveMock = jest.fn();

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', { resolve: resolveMock });
      });

      expect(resolveMock).not.toHaveBeenCalled();
    });

    it('should use scrollTop if scroll method is not defined', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));

      const mockScrollElement = {
        scrollHeight: 1000,
        scrollTop: 0,
        clientHeight: 500,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', { top: 300 });
        await waitFor(() => {
          expect(mockScrollElement.scrollTop).toBe(300);
        });
      });
    });

    it('should not change the scroll position if top is not defined', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));

      const mockScroll = jest.fn();
      const mockScrollElement = {
        scroll: mockScroll,
        scrollHeight: 1000,
        scrollTop: 100,
        clientHeight: 500,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', {});
      });

      expect(mockScroll).not.toHaveBeenCalled();
    });

    it('should execute immediately if lazy option is false', async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useMessageListScroll('auto'));

      const mockScroll = jest.fn();
      const mockScrollElement = {
        scroll: mockScroll,
        scrollHeight: 1000,
        scrollTop: 0,
        clientHeight: 500,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', { top: 300, lazy: false });
      });

      expect(mockScroll).toHaveBeenCalledWith({
        top: 300,
        behavior: 'auto',
      });
      jest.useRealTimers();
    });
  });

  describe('deps change', () => {
    it('should reset all states if deps change', () => {
      const mockScrollElement = {
        scrollHeight: 1000,
        scrollTop: 0,
      };

      const { rerender } = renderHook(
        ({ deps }) => useMessageListScroll('auto', deps),
        { initialProps: { deps: ['initial'] } },
      );

      const { result } = renderHook(() => useMessageListScroll('auto'));
      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      rerender({ deps: ['updated'] });

      expect(mockSetIsScrollBottomReached).toHaveBeenCalledWith(true);
      expect(result.current.scrollDistanceFromBottomRef.current).toBe(0);
      expect(result.current.scrollPositionRef.current).toBe(0);
    });
  });

  describe('getScrollBehavior utility', () => {
    it('should return smooth if animated is true', async () => {
      const { result } = renderHook(() => useMessageListScroll('auto'));

      const mockScroll = jest.fn();
      const mockScrollElement = {
        scroll: mockScroll,
        scrollHeight: 1000,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', { top: 300, animated: true });
        await waitFor(() => {
          expect(mockScroll).toHaveBeenCalledWith({
            top: 300,
            behavior: 'smooth',
          });
        });
      });
    });

    it('should return auto if animated is false', async () => {
      const { result } = renderHook(() => useMessageListScroll('smooth'));

      const mockScroll = jest.fn();
      const mockScrollElement = {
        scroll: mockScroll,
        scrollHeight: 1000,
      };

      // @ts-ignore
      result.current.scrollRef.current = mockScrollElement;

      await act(async () => {
        result.current.scrollPubSub.publish('scroll', { top: 300, animated: false });
        await waitFor(() => {
          expect(mockScroll).toHaveBeenCalledWith({
            top: 300,
            behavior: 'auto',
          });
        });
      });
    });
  });
});
