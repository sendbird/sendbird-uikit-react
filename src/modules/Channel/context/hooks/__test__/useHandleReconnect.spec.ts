import { GroupChannel } from '@sendbird/chat/groupChannel';
import { renderHook, act } from '@testing-library/react';
import useReconnectOnIdle from '../useReconnectOnIdle';

describe('useReconnectOnIdle', () => {
  beforeAll(() => {
    // Mock dispatchEvent for the document object
    document.dispatchEvent = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update shouldReconnect on tab visibility change', () => {
    const hook = renderHook(() => useReconnectOnIdle(true, { url: 'url' } as GroupChannel));
    expect(hook.result.current.shouldReconnect).toBe(false);

    act(() => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(hook.result.current.shouldReconnect).toBe(false);
  });

  it('should not update shouldReconnect on isOnline change', () => {
    const { result, rerender } = renderHook(({ isOnline }) => useReconnectOnIdle(isOnline, null), {
      initialProps: { isOnline: false },
    });
    expect(result.current.shouldReconnect).toBe(false);

    rerender({ isOnline: true });
    expect(result.current.shouldReconnect).toBe(false);
  });
});
