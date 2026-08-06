import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';

test.describe('group channel — realtime features', () => {
  // D3
  test('shows frozen banner and disables input on a frozen channel', async ({ page, workerUser, createChannel }) => {
    await createChannel({ freeze: true });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await expect(page.locator('.sendbird-frozen-channel-notification')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.sendbird-message-input--disabled, .sendbird-message-input [disabled]')).toBeVisible();
  });

  // D5
  test('scrolls to and highlights the parent when a quoted message is clicked', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    // Seed parent message first
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[D5] parent message');
    // Seed 25 gap messages so the parent is scrolled off screen
    await platform.seedMessages(channel.url, workerUser.userId, 25, '[D5] gap');
    // Seed a quote reply referencing the parent
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[D5] quote reply');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // The quote reply is at the bottom; parent is scrolled off screen
    await expect(page.getByText('[D5] quote reply')).toBeVisible({ timeout: 15_000 });
    // Click the quoted parent preview inside the reply bubble
    await page.locator('.sendbird-quote-message').click();
    // Parent message should now be visible (scrolled to)
    await expect(page.getByText('[D5] parent message')).toBeVisible({ timeout: 10_000 });
  });
});
