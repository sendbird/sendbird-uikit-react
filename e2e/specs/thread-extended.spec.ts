import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('thread — extended', () => {
  // F5
  test('paginates older replies when thread panel is scrolled to the top', async ({
    page, workerUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F5] parent');
    // Seed 25 replies to trigger pagination
    for (let i = 1; i <= 25; i++) {
      await platform.replyToMessage(channel.url, parentId, workerUser.userId, `[F5] reply ${i}`);
    }
    await openFirstGroupChannel(page, { userId: workerUser.userId, replyType: 'THREAD' });
    // Open thread via the reply-count button (avoids messageMenu for messages with many replies)
    await page.locator('[class*="thread-replies"], [class*="reply-count"]').first().click({ timeout: 15_000 });
    const threadList = page.locator('.sendbird-thread-ui--scroll');
    // Scroll to top
    await threadList.evaluate((el) => { el.scrollTop = 0; });
    // Older replies should load — exact:true avoids matching [F5] reply 10-19
    await expect(page.getByText('[F5] reply 1', { exact: true })).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
