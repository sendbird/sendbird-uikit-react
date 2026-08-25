import SendbirdChat from '@sendbird/chat';

import { initSDK } from '../utils';

/**
 * Runs against the real @sendbird/chat, so it covers what unit tests with a mocked SDK
 * cannot: that initSDK's parameters actually produce the intended instance lifecycle.
 *
 * `init()` is synchronous and does not connect, so no network is involved.
 */
const APP_A = 'AAAAAAAA-0000-0000-0000-00000000000A';
const APP_B = 'BBBBBBBB-0000-0000-0000-00000000000B';

// Reading appId goes through the vault, which is gone once the instance is released.
const isReleased = (instance: { appId: string }) => {
  try {
    return typeof instance.appId !== 'string';
  } catch {
    return true;
  }
};

describe('initSDK against the real SDK', () => {
  it('reuses the cached instance while the appId stays the same', () => {
    const first = initSDK({ appId: APP_A });

    expect(first.appId).toBe(APP_A);
    expect(SendbirdChat.instance).toBe(first);
    // a remount, and then a second provider on the same appId
    expect(initSDK({ appId: APP_A })).toBe(first);
    expect(initSDK({ appId: APP_A })).toBe(first);
  });

  it('builds an instance bound to the new appId when the appId changes', () => {
    const previous = initSDK({ appId: APP_A });
    const next = initSDK({ appId: APP_B });

    expect(next).not.toBe(previous);
    expect(next.appId).toBe(APP_B);
    expect(SendbirdChat.instance).toBe(next);
    // the replaced instance is released, not merely dereferenced
    expect(isReleased(previous)).toBe(true);
  });

  it('honors an explicit newInstance and leaves the cached instance alone', () => {
    const cached = initSDK({ appId: APP_B });
    const forced = initSDK({ appId: APP_B, sdkInitParams: { newInstance: true } });

    expect(forced).not.toBe(cached);
    expect(isReleased(cached)).toBe(false);
  });
});
