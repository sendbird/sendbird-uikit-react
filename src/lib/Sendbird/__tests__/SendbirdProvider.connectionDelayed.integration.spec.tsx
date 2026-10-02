import React, { act } from 'react';
import { render, waitFor } from '@testing-library/react';
import SendbirdChat from '@sendbird/chat';

import SendbirdProvider from '../index';
import useSendbird from '../context/hooks/useSendbird';

vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

const sdk = SendbirdChat as any;

const USER = { userId: 'test-user-id', nickname: 'test-nickname', profileUrl: 'test-profile-url' };

const delayedConnectingError = () => Object.assign(new Error('Connection delayed.'), {
  code: 800221,
  detail: JSON.stringify({ retry_after: 30, reason_code: 0, message: 'Connection delayed.' }),
});

let state: ReturnType<typeof useSendbird>['state'];
const Probe = () => {
  state = useSendbird().state;
  return null;
};

const flush = async () => {
  for (let i = 0; i < 5; i += 1) {
    await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 0); }); });
  }
};

const fire = async (event: string, ...args: unknown[]) => {
  await act(async () => {
    [...sdk.connectionHandlers.values()].forEach((handler) => handler[event]?.(...args));
  });
};

describe('SendbirdProvider — recovery from a delayed connect (CLNP-8963)', () => {
  const originalConsoleError = globalThis.console.error.bind(globalThis.console);
  const onConnected = vi.fn();
  const onFailed = vi.fn();

  const tree = (userId = USER.userId) => (
    <SendbirdProvider appId="test-app-id" userId={userId} eventHandlers={{ connection: { onConnected, onFailed } }}>
      <Probe />
    </SendbirdProvider>
  );

  const mount = async (userId = USER.userId, strict = false) => {
    let view: ReturnType<typeof render>;
    await act(async () => {
      view = render(strict ? <React.StrictMode>{tree(userId)}</React.StrictMode> : tree(userId));
    });
    return view!;
  };

  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation((...args) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    sdk.connect.mockReset();
    sdk.connect.mockResolvedValue(USER);
    sdk.currentUser = null;
    sdk.connectionHandlers.clear();
  });

  it('reports a delayed connect through onFailed and leaves the stores reset, as before', async () => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    await mount();

    await waitFor(() => expect(onFailed).toHaveBeenCalledWith(expect.objectContaining({ code: 800221 })));
    expect(onConnected).not.toHaveBeenCalled();
    expect(state.stores.sdkStore.initialized).toBe(false);
    expect(state.stores.userStore.initialized).toBe(false);
  });

  it('finishes initializing once the SDK reconnects on its own after the delay', async () => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(USER));
    expect(onConnected).toHaveBeenCalledTimes(1);
    expect(state.stores.sdkStore.initialized).toBe(true);
    expect(state.stores.sdkStore.sdk).toBe(sdk);
    expect(state.stores.userStore.user).toEqual(USER);
  });

  it('keeps waiting when the reconnect is delayed again, then initializes once it lands', async () => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));

    await fire('onConnectionDelayed', 5);
    await fire('onReconnectFailed');
    await flush();
    expect(onConnected).not.toHaveBeenCalled();
    expect(onFailed).toHaveBeenCalledTimes(1);

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');

    await waitFor(() => expect(onConnected).toHaveBeenCalledTimes(1));
    expect(state.stores.sdkStore.initialized).toBe(true);
  });

  it('stops waiting when the provider unmounts during the delay', async () => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    const view = await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));
    expect(sdk.connectionHandlers.size).toBe(1);

    await act(async () => { view.unmount(); });
    expect(sdk.connectionHandlers.size).toBe(0);

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');
    await flush();
    expect(onConnected).not.toHaveBeenCalled();
  });

  it('does not wait for a provider that unmounted before its connect settled', async () => {
    let rejectConnect: (error: Error) => void = () => undefined;
    sdk.connect.mockImplementation(() => new Promise((_, reject) => { rejectConnect = reject; }));
    const MountThenDrop = () => {
      const [shown, setShown] = React.useState(true);
      React.useLayoutEffect(() => { setShown(false); }, []);
      return shown ? tree() : null;
    };

    await act(async () => { render(<MountThenDrop />); });
    await flush();
    await act(async () => { rejectConnect(delayedConnectingError()); });
    await flush();
    expect(sdk.connectionHandlers.size).toBe(0);

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');
    await flush();
    expect(onConnected).not.toHaveBeenCalled();
  });

  it('drops the wait for the previous user when the provider switches users', async () => {
    sdk.connect.mockImplementation(async (userId: string) => {
      if (userId === 'user-a') throw delayedConnectingError();
      return { userId, nickname: '', profileUrl: '' };
    });
    const view = await mount('user-a');
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));

    await act(async () => { view.rerender(tree('user-b')); });
    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-b' })));

    sdk.currentUser = { userId: 'user-a', nickname: '', profileUrl: '' };
    await fire('onReconnectSucceeded');
    await flush();
    expect(onConnected).toHaveBeenCalledTimes(1);
    expect(state.stores.userStore.user).toEqual(expect.objectContaining({ userId: 'user-b' }));
  });

  it('ignores a connection for a different user and keeps waiting for its own', async () => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));

    sdk.currentUser = { userId: 'someone-else', nickname: '', profileUrl: '' };
    await fire('onConnected', 'someone-else');
    await flush();
    expect(onConnected).not.toHaveBeenCalled();

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');
    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(USER));
    expect(onConnected).toHaveBeenCalledTimes(1);
  });

  it('does not wait after a failure other than a delay', async () => {
    sdk.connect.mockRejectedValue(Object.assign(new Error('Invalid token.'), { code: 400302 }));
    await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');
    await flush();
    expect(onConnected).not.toHaveBeenCalled();
    expect(state.stores.sdkStore.initialized).toBe(false);
  });

  it('connects as before and does not initialize again on a later reconnect', async () => {
    await mount();
    await waitFor(() => expect(onConnected).toHaveBeenCalledTimes(1));

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');
    await flush();
    expect(onConnected).toHaveBeenCalledTimes(1);
    expect(onFailed).not.toHaveBeenCalled();
  });

  it.each([
    ['without StrictMode', false],
    ['under StrictMode', true],
  ])('recovers exactly once %s', async (_, strict) => {
    sdk.connect.mockRejectedValue(delayedConnectingError());
    await mount(USER.userId, strict);
    await waitFor(() => expect(sdk.connect).toHaveBeenCalledTimes(strict ? 2 : 1));
    await flush();

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(USER));
    await flush();
    expect(onConnected).toHaveBeenCalledTimes(1);
    expect(state.stores.sdkStore.initialized).toBe(true);
    expect(state.stores.userStore.user).toEqual(USER);
  });
});
