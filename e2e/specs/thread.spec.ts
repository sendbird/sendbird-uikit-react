import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openThread, sendText, messageByText } from '../utils/actions';
import * as platform from '../utils/platform';

test.describe('group channel — thread', () => {
  // F1
  test('opens thread panel with parent and existing reply', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F1] parent');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[F1] reply 1');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openThread(page, '[F1] parent');
    await expect(page.locator('.sendbird-thread-ui')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('[F1] parent').first()).toBeVisible();
    await expect(page.getByText('[F1] reply 1').first()).toBeVisible();
  });

  // F2
  test('reply-count label matches rendered replies in thread', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F2] parent');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[F2] reply 1');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[F2] reply 2');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openThread(page, '[F2] parent');
    // Thread panel shows 2 replies
    const replyItems = page.locator('.sendbird-thread-list-item');
    await expect(replyItems).toHaveCount(2, { timeout: 15_000 });
    // The reply-count label on the parent in the channel should read "2 replies"
    await page.locator('.sendbird-thread-ui__header button').first().click(); // close thread
    const replyCountLabel = messageByText(page, '[F2] parent').locator('[class*="reply-count"]');
    await expect(replyCountLabel).toContainText('2', { timeout: 10_000 });
  });

  // F3
  test('appended reply appears in thread and increments count', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F3] parent');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[F3] seed reply');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openThread(page, '[F3] parent');
    // Send a new reply via the thread input
    await sendText(page, '[F3] new reply');
    await expect(page.getByText('[F3] new reply').first()).toBeVisible({ timeout: 15_000 });
    // Reply count should now be 2
    const replyItems = page.locator('.sendbird-thread-list-item');
    await expect(replyItems).toHaveCount(2, { timeout: 10_000 });
  });

  // F4
  test('navigates to parent message when thread header link is clicked', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F4] parent');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[F4] reply');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openThread(page, '[F4] parent');
    // Click the parent-message link in the thread header
    await page.locator('.sendbird-thread-ui__header').getByRole('button', { name: /go to original/i }).click();
    // Thread panel closes and channel scrolls to the parent
    await expect(page.locator('.sendbird-thread-ui')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('[F4] parent').first()).toBeVisible({ timeout: 10_000 });
  });
});
