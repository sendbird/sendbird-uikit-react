import React, { act } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import SendbirdChat from '@sendbird/chat';

import SendbirdProvider from '../index';
import type { SendbirdProviderProps } from '../index';
import getStringSet from '../../../ui/Label/stringSet';

vi.mock('@sendbird/chat', async () => (
  await import('../../../utils/testMocks/sendbirdChat')
).createSendbirdChatMock());

const sdk = SendbirdChat as any;
const stringSet = getStringSet('en');

const USER = { userId: 'test-user-id', nickname: 'test-nickname', profileUrl: 'test-profile-url' };

const delayedConnectingError = () => Object.assign(new Error('Connection delayed.'), {
  code: 800221,
  detail: JSON.stringify({ retry_after: 30, reason_code: 0, message: 'Connection delayed.' }),
});

const emit = (event: string, ...args: unknown[]) => {
  [...sdk.connectionHandlers.values()].forEach((handler) => handler[event]?.(...args));
};

const fire = async (event: string, ...args: unknown[]) => {
  await act(async () => { emit(event, ...args); });
};

const advance = (ms: number) => {
  act(() => { vi.advanceTimersByTime(ms); });
};

const modal = () => document.querySelector('.sendbird-connection-delayed-modal');
const waitingTime = () => document.querySelector('.sendbird-connection-delayed-modal__time')?.textContent ?? null;

describe('SendbirdProvider — connection delayed modal (CLNP-8963)', () => {
  const originalConsoleError = globalThis.console.error.bind(globalThis.console);
  const onConnected = vi.fn();
  const onFailed = vi.fn();

  const tree = (props: Partial<SendbirdProviderProps> = {}) => (
    <SendbirdProvider
      appId="test-app-id"
      userId={USER.userId}
      eventHandlers={{ connection: { onConnected, onFailed } }}
      {...props}
    >
      <div />
    </SendbirdProvider>
  );

  const mount = async (props: Partial<SendbirdProviderProps> = {}) => {
    let view: ReturnType<typeof render>;
    await act(async () => { view = render(tree(props)); });
    return view!;
  };

  const mountConnected = async (props: Partial<SendbirdProviderProps> = {}) => {
    const view = await mount(props);
    await waitFor(() => expect(onConnected).toHaveBeenCalledTimes(1));
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    return view;
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

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the estimated waiting time when the connection is delayed and counts it down', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    expect(modal()?.textContent).toContain(stringSet.MODAL__CONNECTION_DELAYED__TITLE);
    expect(modal()?.textContent).toContain(stringSet.MODAL__CONNECTION_DELAYED__ESTIMATED_WAITING_TIME);
    expect(waitingTime()).toBe('00:30');

    advance(1000);
    expect(waitingTime()).toBe('00:29');
  });

  it('formats a delay of a minute or more as minutes and seconds', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 95);
    expect(waitingTime()).toBe('01:35');
  });

  it('hides the waiting time in place once it reaches zero and keeps the modal open', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 2);
    expect(waitingTime()).toBe('00:02');
    expect(modal()).not.toHaveClass('sendbird-connection-delayed-modal--no-waiting-time');

    advance(2000);
    expect(modal()).toHaveClass('sendbird-connection-delayed-modal--no-waiting-time');
    expect(waitingTime()).toBe('00:00');
    expect(modal()?.textContent).toContain(stringSet.MODAL__CONNECTION_DELAYED__TITLE);
  });

  it('restarts the countdown when the SDK reports a new delay, even with the same value', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    advance(5000);
    expect(waitingTime()).toBe('00:25');

    await fire('onConnectionDelayed', 30);
    expect(waitingTime()).toBe('00:30');

    await fire('onConnectionDelayed', 10);
    expect(waitingTime()).toBe('00:10');
  });

  it('closes when the SDK reconnects', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    expect(modal()).not.toBeNull();

    await fire('onReconnectSucceeded');
    expect(modal()).toBeNull();
  });

  it('closes when a fresh connect succeeds', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    expect(modal()).not.toBeNull();

    await fire('onConnected', USER.userId);
    expect(modal()).toBeNull();
  });

  it('stays open when the reconnect fails, because the SDK keeps retrying', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    await fire('onReconnectFailed');
    expect(modal()).not.toBeNull();
    expect(waitingTime()).toBe('00:30');
  });

  it('shows nothing for a delay of zero seconds', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 0);
    expect(modal()).toBeNull();
  });

  it('cannot be dismissed by the user', async () => {
    await mountConnected();

    await fire('onConnectionDelayed', 30);
    expect(modal()?.querySelector('.sendbird-modal__close')).toBeNull();
    expect(modal()?.querySelector('.sendbird-modal__footer')).toBeNull();

    fireEvent.click(document.querySelector('.sendbird-modal__backdrop') as Element);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(modal()).not.toBeNull();
  });

  it('closes when the provider switches to another user', async () => {
    const view = await mountConnected();

    await fire('onConnectionDelayed', 30);
    expect(modal()).not.toBeNull();

    await act(async () => { view.rerender(tree({ userId: 'another-user-id' })); });
    expect(modal()).toBeNull();
  });

  it('shows the modal for a delayed first connect and closes it once the SDK recovers', async () => {
    sdk.connect.mockImplementation(async () => {
      emit('onConnectionDelayed', 30);
      throw delayedConnectingError();
    });
    await mount();
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));
    expect(modal()).not.toBeNull();
    expect(waitingTime()).toBe('00:30');

    sdk.currentUser = USER;
    await fire('onReconnectSucceeded');

    expect(modal()).toBeNull();
    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(USER));
  });

  it('renders the customer modal instead of the default one, with the reported delay', async () => {
    await mountConnected({
      renderConnectionDelayedModal: ({ retryAfter }) => <div data-testid="custom-delayed-modal">{`retry in ${retryAfter}`}</div>,
    });
    const custom = () => document.querySelector('[data-testid="custom-delayed-modal"]');

    await fire('onConnectionDelayed', 30);
    expect(custom()?.textContent).toBe('retry in 30');
    expect(modal()).toBeNull();

    await fire('onConnectionDelayed', 5);
    expect(custom()?.textContent).toBe('retry in 5');

    await fire('onReconnectSucceeded');
    expect(custom()).toBeNull();
  });

  it('restarts a customer countdown when the SDK reports a new delay, even with the same value', async () => {
    const Countdown = ({ retryAfter }: { retryAfter: number }) => {
      const [left, setLeft] = React.useState(retryAfter);
      React.useEffect(() => { setLeft(retryAfter); }, [retryAfter]);
      React.useEffect(() => {
        if (left <= 0) return undefined;
        const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
        return () => clearTimeout(timer);
      }, [left]);
      return <div data-testid="custom-countdown">{left}</div>;
    };
    await mountConnected({ renderConnectionDelayedModal: ({ retryAfter }) => <Countdown retryAfter={retryAfter} /> });
    const shown = () => document.querySelector('[data-testid="custom-countdown"]')?.textContent;

    await fire('onConnectionDelayed', 30);
    for (let i = 0; i < 5; i += 1) advance(1000);
    expect(shown()).toBe('25');

    await fire('onConnectionDelayed', 30);
    expect(shown()).toBe('30');
  });

  it('shows nothing when the customer renderer returns null', async () => {
    await mountConnected({ renderConnectionDelayedModal: () => null });

    await fire('onConnectionDelayed', 30);
    expect(modal()).toBeNull();
  });

  it('uses the texts from the customer stringSet', async () => {
    await mountConnected({
      stringSet: {
        MODAL__CONNECTION_DELAYED__TITLE: 'Custom title',
        MODAL__CONNECTION_DELAYED__ESTIMATED_WAITING_TIME: 'Custom waiting time:',
      },
    });

    await fire('onConnectionDelayed', 30);
    expect(modal()?.textContent).toContain('Custom title');
    expect(modal()?.textContent).toContain('Custom waiting time:');
    expect(modal()?.textContent).not.toContain(stringSet.MODAL__CONNECTION_DELAYED__TITLE);
  });
});
