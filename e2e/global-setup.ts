import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { E2E, hasCreds } from './utils/env';

/**
 * Ensures the E2E test user has at least one group channel to open (a fresh, dedicated test App ID
 * starts empty). Uses the Chat SDK directly — App ID + userId only, no Platform API token.
 * Idempotent: seeds a channel only when the user currently has none. Best-effort: a failure warns
 * but does not abort the run, so connection-only tests still execute.
 */
export default async function globalSetup() {
  if (!hasCreds) return;

  // The Chat SDK's connect() needs a global WebSocket. Node < 22 has none, so polyfill from `ws`.
  const g = globalThis as { WebSocket?: unknown };
  if (typeof g.WebSocket === 'undefined') {
    const ws = await import('ws');
    g.WebSocket = ws.WebSocket ?? ws.default;
  }

  try {
    const sdk = SendbirdChat.init({ appId: E2E.appId, modules: [new GroupChannelModule(), new OpenChannelModule()], localCacheEnabled: false });
    await sdk.connect(E2E.userId, E2E.accessToken || undefined);

    // Find an existing channel (includeEmpty so we don't recreate on every run); create one if none.
    const existing = await sdk.groupChannel.createMyGroupChannelListQuery({ limit: 1, includeEmpty: true }).next();
    const channel = existing[0] ?? (await sdk.groupChannel.createChannel({ name: '[e2e] seed channel' }));

    // The default UIKit channel list hides empty channels, so ensure the seed channel has a message.
    if (!channel.lastMessage) {
      await new Promise<void>((resolve, reject) => {
        channel
          .sendUserMessage({ message: '[e2e] seed message' })
          .onSucceeded(() => resolve())
          .onFailed((error) => reject(error));
      });
      // eslint-disable-next-line no-console
      console.log('[e2e globalSetup] seeded group channel with a message:', channel.url);
    }

    // Seed an open channel too (needs no invitees and shows in the list even when empty).
    const openChannels = await sdk.openChannel.createOpenChannelListQuery({ limit: 1 }).next();
    if (openChannels.length === 0) {
      const openChannel = await sdk.openChannel.createChannel({ name: '[e2e] seed open channel' });
      // eslint-disable-next-line no-console
      console.log('[e2e globalSetup] seeded an open channel:', openChannel.url);
    }

    await sdk.disconnect();

    // Ensure a second user exists so group-channel creation has someone to invite. Connecting as a
    // user auto-creates them; the Chat SDK cannot create other users from the first user's session.
    if (E2E.userId2 && E2E.userId2 !== E2E.userId) {
      await sdk.connect(E2E.userId2);
      await sdk.updateCurrentUserInfo({ nickname: E2E.userId2 });
      await sdk.disconnect();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[e2e globalSetup] seeding skipped:', error instanceof Error ? error.message : error);
  }
}
