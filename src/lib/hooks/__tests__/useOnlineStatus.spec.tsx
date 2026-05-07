import { act, renderHook } from '@testing-library/react';

import useOnlineStatus from '../useOnlineStatus';

let mockConnectionHandler: any;

jest.mock('@sendbird/chat', () => ({
  ConnectionHandler: jest.fn().mockImplementation((handler) => {
    mockConnectionHandler = handler;
    return handler;
  }),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
};

const createSdk = (overrides = {}) => ({
  connectionState: 'CLOSED',
  isCacheEnabled: false,
  addConnectionHandler: jest.fn(),
  removeConnectionHandler: jest.fn(),
  reconnect: jest.fn(),
  ...overrides,
});

describe('useOnlineStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.className = '';
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  it('registers connection handlers and updates online state', () => {
    const sdk = createSdk();
    const { result, unmount } = renderHook(() => useOnlineStatus(sdk as any, logger as any));

    expect(result.current).toBe(true);
    expect(sdk.addConnectionHandler).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Added ConnectionHandler', expect.any(String));

    act(() => {
      mockConnectionHandler.onDisconnected();
    });
    expect(result.current).toBe(false);
    expect(document.body.classList.contains('sendbird__offline')).toBe(true);

    act(() => {
      mockConnectionHandler.onReconnectStarted();
    });
    expect(result.current).toBe(false);

    act(() => {
      mockConnectionHandler.onReconnectSucceeded();
    });
    expect(result.current).toBe(true);
    expect(document.body.classList.contains('sendbird__offline')).toBe(false);

    act(() => {
      mockConnectionHandler.onReconnectFailed();
    });
    expect(sdk.reconnect).toHaveBeenCalledTimes(1);

    unmount();
    expect(sdk.removeConnectionHandler).toHaveBeenCalled();
  });

  it('reconnects on browser online events and skips offline class when cache is enabled', () => {
    const sdk = createSdk({ isCacheEnabled: true, connectionState: 'CLOSED' });
    const { result } = renderHook(() => useOnlineStatus(sdk as any, logger as any));

    act(() => {
      mockConnectionHandler.onDisconnected();
    });
    expect(result.current).toBe(false);
    expect(document.body.classList.contains('sendbird__offline')).toBe(false);

    act(() => {
      window.dispatchEvent(new window.Event('online'));
    });
    expect(sdk.reconnect).toHaveBeenCalled();
  });

  it('guards SDK handler setup and teardown failures', () => {
    const sdk = createSdk({
      addConnectionHandler: jest.fn(() => {
        throw new Error('add failed');
      }),
      removeConnectionHandler: jest.fn(() => {
        throw new Error('remove failed');
      }),
    });

    const { unmount } = renderHook(() => useOnlineStatus(sdk as any, logger as any));

    expect(() => unmount()).not.toThrow();
  });
});
