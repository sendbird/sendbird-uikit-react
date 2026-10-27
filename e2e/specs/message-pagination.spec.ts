import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

const MESSAGE_COUNT = 60;

test.describe('group channel — message pagination', () => {
  // C14
  test('loads older messages when scrolled to top', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    await platform.seedMessages(channel.url, workerUser.userId, MESSAGE_COUNT, '[page]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const list = page.locator('.sendbird-conversation__messages-padding');
    // exact match avoids strict-mode violation from getByText('[page] 1') also matching
    // '[page] 10', '[page] 11', etc. as substrings
    await expect(list.getByText(`[page] ${MESSAGE_COUNT}`, { exact: true })).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(list.getByText('[page] 1', { exact: true })).toHaveCount(0);

    await expect(async () => {
      await list.evaluate((el) => { el.scrollTop = 0; });
      await expect(list.getByText('[page] 1', { exact: true })).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(list.locator('.sendbird-text-message-item-body')).toHaveText(
      Array.from({ length: MESSAGE_COUNT }, (_, i) => `[page] ${i + 1}`),
    );
  });
});
