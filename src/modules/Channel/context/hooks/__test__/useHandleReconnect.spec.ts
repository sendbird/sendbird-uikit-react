import { GroupChannel } from '@sendbird/chat/groupChannel';
import { renderHook, act } from '@testing-library/react';
import useReconnectOnIdle from '../useReconnectOnIdle';

describe('useReconnectOnIdle', () => {
  beforeAll(() => {
    // Mock dispatchEvent for the document object
    document.dispatchEvent = vi.fn();
    vi.spyOn(document, 'addEventListener');
    vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should update shouldReconnect on tab visibility change', () => {
    const hook = renderHook(() => useReconnectOnIdle(true, { url: 'url' } as GroupChannel, true));
    expect(hook.result.current.shouldReconnect).toBe(false);

    act(() => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(hook.result.current.shouldReconnect).toBe(false);
  });

  it('should not update shouldReconnect on isOnline change', () => {
    const { result, rerender } = renderHook(({ isOnline }) => useReconnectOnIdle(isOnline, { url: 'url' } as GroupChannel, true), {
      initialProps: { isOnline: false },
    });
    expect(result.current.shouldReconnect).toBe(true);

    rerender({ isOnline: true });
    expect(result.current.shouldReconnect).toBe(false);
  });

  it('should not update shouldReconnect if reconnectOnIdle is false', async () => {
    const reconnectOnIdle = false;
    const spy = vi.spyOn(document, 'addEventListener');
    renderHook(({ isOnline }) => useReconnectOnIdle(isOnline, { url: 'url' } as GroupChannel, reconnectOnIdle), {
      initialProps: { isOnline: false },
    });

    document.dispatchEvent(new Event('visibilitychange'));

    const lastCall = spy.mock.calls[spy.mock.calls.length - 1];
    expect(lastCall).toEqual(['visibilitychange', expect.any(Function)]);
    spy.mockRestore();
  });
});
