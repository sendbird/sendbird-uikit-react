import { test, expect } from '../fixtures';
import { messageByText, openFirstGroupChannel, sendText } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import * as platform from '../utils/platform';

test.describe('group channel — legacy modules', () => {
  test('loads older messages and sends one in the legacy Channel (CLNP-6835)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    await platform.seedMessages(channel.url, workerUser.userId, 40, '[legacy]');
    await openFirstGroupChannel(page, { userId: workerUser.userId, enableLegacyChannelModules: 'true' });
    const list = page.locator('.sendbird-conversation__messages-padding');
    await expect(list.getByText('[legacy] 40', { exact: true })).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });

    await expect(async () => {
      await list.evaluate((el) => { el.scrollTop = 0; });
      await expect(list.getByText('[legacy] 1', { exact: true })).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: SERVER_RESPONSE_TIMEOUT });

    const text = `[legacy] sent ${Date.now()}`;
    await sendText(page, text);
    await expect(messageByText(page, text)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
