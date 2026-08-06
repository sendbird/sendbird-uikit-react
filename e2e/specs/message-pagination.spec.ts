import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';

test.describe('group channel — message pagination', () => {
  // C14
  test('loads older messages when scrolled to top', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    // Seed 30 messages so the initial view loads at the bottom and the first messages are off-screen
    await platform.seedMessages(channel.url, workerUser.userId, 30, '[page]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll to the very top of the message list
    const list = page.locator('.sendbird-conversation__messages-padding');
    await list.evaluate((el) => { el.scrollTop = 0; });
    // Older messages should paginate in — wait for the first seeded message
    await expect(page.getByText('[page] 1')).toBeVisible({ timeout: 20_000 });
  });
});
