import { act, renderHook } from '@testing-library/react';
import { ConnectionState } from '@sendbird/chat';
import { useConnectionState } from '../useConnectionState';

let capturedHandler: any;
const addConnectionHandler = jest.fn((_: string, handler: any) => {
  capturedHandler = handler;
});
const removeConnectionHandler = jest.fn();
const mockSdk = {
  connectionState: ConnectionState.CLOSED,
  addConnectionHandler,
  removeConnectionHandler,
};

jest.mock('../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: () => ({
    state: {
      stores: {
        sdkStore: {
          sdk: mockSdk,
        },
      },
    },
  }),
}));

jest.mock('../../utils/uuid', () => ({
  __esModule: true,
  default: () => 'connection-handler-id',
}));

describe('useConnectionState', () => {
  beforeEach(() => {
    capturedHandler = undefined;
    mockSdk.connectionState = ConnectionState.CLOSED;
    addConnectionHandler.mockClear();
    removeConnectionHandler.mockClear();
  });

  it('registers a connection handler and mirrors SDK connection events', () => {
    const { result, unmount } = renderHook(() => useConnectionState());

    expect(result.current).toBe(ConnectionState.CLOSED);
    expect(addConnectionHandler).toHaveBeenCalledWith('connection-handler-id', expect.any(Object));

    act(() => {
      capturedHandler.onConnected();
    });
    expect(result.current).toBe(ConnectionState.OPEN);

    act(() => {
      capturedHandler.onReconnectStarted();
    });
    expect(result.current).toBe(ConnectionState.CONNECTING);

    act(() => {
      capturedHandler.onReconnectSucceeded();
    });
    expect(result.current).toBe(ConnectionState.OPEN);

    act(() => {
      capturedHandler.onReconnectFailed();
    });
    expect(result.current).toBe(ConnectionState.CLOSED);

    act(() => {
      capturedHandler.onDisconnected();
    });
    expect(result.current).toBe(ConnectionState.CLOSED);

    unmount();

    expect(removeConnectionHandler).toHaveBeenCalledWith('connection-handler-id');
  });
});
