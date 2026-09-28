import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('group channel — message pagination', () => {
  // C14
  test('loads older messages when scrolled to top', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    // Seed 20 messages so the initial view loads at the bottom and the first messages are off-screen
    await platform.seedMessages(channel.url, workerUser.userId, 20, '[page]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll to the very top of the message list
    const list = page.locator('.sendbird-conversation__messages-padding');
    await list.evaluate((el) => { el.scrollTop = 0; });
    // Older messages should paginate in — exact match avoids strict-mode violation from
    // getByText('[page] 1') also matching '[page] 10', '[page] 11', etc. as substrings
    await expect(page.getByText('[page] 1', { exact: true })).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
