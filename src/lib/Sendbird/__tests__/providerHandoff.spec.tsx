import React, { act } from 'react';
import { render } from '@testing-library/react';

import SendbirdProvider from '../index';

/**
 * Reproduction probe for the provider handoff that happens on route navigation:
 * the outgoing provider's unmount starts disconnectWebSocket(), React cannot await that
 * cleanup, and the incoming provider connects. Now that both providers share one cached
 * SendbirdChat instance, the question is whether connect() can start while the previous
 * disconnect is still in flight on that same instance.
 */
const timeline: string[] = [];
let settlePendingDisconnect: (() => void) | null = null;

vi.mock('@sendbird/chat', () => {
  const mockSdk = {
    // one cached instance shared by every init(), as the SDK does for the same appId
    init: vi.fn(() => mockSdk),
    connect: vi.fn(async () => {
      timeline.push('connect:start');
      return { userId: 'test-user-id', nickname: '', profileUrl: '' };
    }),
    disconnectWebSocket: vi.fn(() => {
      timeline.push('disconnect:start');
      return new Promise<void>((resolve) => {
        settlePendingDisconnect = () => {
          timeline.push('disconnect:end');
          resolve();
        };
      });
    }),
    updateCurrentUserInfo: vi.fn().mockResolvedValue(null),
    addExtension: vi.fn().mockReturnThis(),
    addSendbirdExtensions: vi.fn().mockReturnThis(),
    message: { getMessageTemplatesByToken: vi.fn().mockResolvedValue({ hasMore: false, token: null, templates: [] }) },
    appId: 'test-app-id',
    appInfo: {
      uploadSizeLimit: 1024,
      multipleFilesMessageFileCountLimit: 10,
      messageTemplateInfo: { token: null },
      uikitConfigInfo: { lastUpdatedAt: 0 },
    },
  };

  return {
    __esModule: true,
    default: mockSdk,
    SendbirdProduct: { UIKIT_CHAT: 'UIKIT_CHAT' },
    SendbirdPlatform: { JS: 'JS' },
    DeviceOsPlatform: { WEB: 'WEB', MOBILE_WEB: 'MOBILE_WEB' },
  };
});

describe('provider handoff on route navigation', () => {
  beforeEach(() => {
    timeline.length = 0;
    settlePendingDisconnect = null;
    global.MediaRecorder = {
      isTypeSupported: vi.fn(() => true),
    } as unknown as typeof MediaRecorder;
  });

  it('does not connect the shared instance while the previous disconnect is still pending', async () => {
    const tree = (
      <SendbirdProvider
        appId="test-app-id"
        userId="test-user-id"
        eventHandlers={{
          connection: {
            onConnected: () => timeline.push('onConnected'),
            onFailed: (e) => timeline.push(`onFailed:${e?.message ?? e}`),
          },
        }}
      >
        <div data-testid="child" />
      </SendbirdProvider>
    );

    const first = render(tree);
    // connect() awaits several times before it puts the instance into the store, and only
    // an instance that reached the store can be disconnected on unmount
    for (let i = 0; i < 10; i += 1) {
      await act(async () => { await new Promise((resolve) => { setTimeout(resolve, 0); }); });
    }
    timeline.length = 0; // ignore the initial connect

    // route navigation: the outgoing provider unmounts, the incoming one mounts before the
    // pending disconnectWebSocket() has settled
    await act(async () => {
      first.unmount();
      render(tree);
      await Promise.resolve();
    });

    // the outgoing provider's teardown has started and is deliberately left unsettled
    expect(timeline).toEqual(['disconnect:start']);

    // the incoming provider must not touch the shared instance until that teardown lands
    await act(async () => {
      settlePendingDisconnect?.();
      await new Promise((resolve) => { setTimeout(resolve, 0); });
    });

    expect(timeline.indexOf('connect:start')).toBeGreaterThan(timeline.indexOf('disconnect:end'));
    expect(timeline).toContain('onConnected');
  });
});
