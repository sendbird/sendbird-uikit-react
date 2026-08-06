import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('group channel list — realtime (2nd-user)', () => {
  // B5
  test('reorders channel to top and shows unread badge when 2nd user sends a message', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const ch1 = await createChannel({ name: '[e2e] b5-older', memberIds: [secondUser.userId] });
    await createChannel({ name: '[e2e] b5-newer', memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });

    // secondUser connects and sends a message in the older channel
    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await platform.sendMessage(ch1.url, secondUser.userId, `[b5] ${runTag}`);

    // ch1 should move to top and show unread badge
    await expect(
      page.locator('.sendbird-channel-preview').first().filter({ hasText: '[e2e] b5-older' }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.locator('.sendbird-channel-preview').first().locator('.sendbird-channel-preview__unread-count'),
    ).toBeVisible({ timeout: 10_000 });
  });

  // B6
  test('clears unread badge after opening the unread channel', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    // secondUser sends a message to create unread state
    await platform.sendMessage(channel.url, secondUser.userId, `[b6] ${runTag}`);
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // Verify unread badge is visible
    await expect(
      page.locator('.sendbird-channel-preview').first().locator('.sendbird-channel-preview__unread-count'),
    ).toBeVisible({ timeout: 20_000 });
    // Open the channel → badge should disappear
    await page.locator('.sendbird-channel-preview').first().click();
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 10_000 });
    await expect(
      page.locator('.sendbird-channel-preview--active .sendbird-channel-preview__unread-count'),
    ).not.toBeVisible({ timeout: 10_000 });
  });

  // B7
  test('shows typing indicator in list row while 2nd user is typing', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().waitFor({ timeout: 30_000 });

    // secondUser opens the channel and starts typing
    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await secondPage.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    const input = secondPage.locator('.sendbird-message-input [role="textbox"]').first();
    await input.click();
    await input.type('[b7] typing...', { delay: 100 });

    // Typing indicator should appear in channel-list row
    await expect(
      page.locator('.sendbird-channel-preview').first().locator('[class*="typing"]'),
    ).toBeVisible({ timeout: 15_000 });
  });

  // B8
  test('adds new channel row when user gets invited', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ name: '[e2e] b8-existing' });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // secondUser creates a new channel and invites workerUser
    const newCh = await platform.createGroupChannel({ userIds: [secondUser.userId], name: `[e2e] b8-invite-${runTag}` });
    await platform.inviteUsers(newCh.url, [workerUser.userId]);
    await platform.sendMessage(newCh.url, secondUser.userId, '[b8] invite trigger');
    // The specifically-named invited channel should appear in the list
    await expect(
      page.locator('.sendbird-channel-preview').filter({ hasText: `[e2e] b8-invite-${runTag}` }),
    ).toBeVisible({ timeout: 15_000 });
    await platform.deleteGroupChannel(newCh.url).catch(() => {});
  });

  // B10
  test('removes channel row when channel is deleted remotely', async ({
    page, workerUser, createChannel,
  }) => {
    const ch = await createChannel({ name: '[e2e] b10-del' });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(
      page.locator('.sendbird-channel-preview').filter({ hasText: '[e2e] b10-del' }),
    ).toBeVisible({ timeout: 30_000 });
    // Delete via Platform API (simulates remote deletion)
    await platform.deleteGroupChannel(ch.url);
    // Assert that THIS channel disappears — avoids false failures from other workers' channels.
    await expect(
      page.locator('.sendbird-channel-preview').filter({ hasText: '[e2e] b10-del' }),
    ).not.toBeVisible({ timeout: 15_000 });
  });

  // B11
  test('loads more channels when list is scrolled to the bottom', async ({
    page, workerUser,
  }) => {
    // Seed 22 channels to exceed the default page size (~20)
    const urls: string[] = [];
    try {
      for (let i = 0; i < 22; i++) {
        const ch = await platform.createGroupChannel({ userIds: [workerUser.userId], name: `[e2e] b11-${runTag}-${i}` });
        urls.push(ch.url); // push before sendMessage so the channel is cleaned up even if sendMessage throws
        await platform.sendMessage(ch.url, workerUser.userId, `seed ${i}`);
      }
      await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
      await page.locator('.sendbird-channel-preview').first().waitFor({ timeout: 30_000 });
      const initial = await page.locator('.sendbird-channel-preview').count();
      // Scroll to bottom to trigger pagination
      const list = page.locator('.sendbird-channel-list__body');
      await list.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      // Wait deterministically for at least one more preview to appear
      await expect(page.locator('.sendbird-channel-preview').nth(initial)).toBeVisible({ timeout: 10_000 });
      const after = await page.locator('.sendbird-channel-preview').count();
      expect(after).toBeGreaterThan(initial);
    } finally {
      for (const url of urls) await platform.deleteGroupChannel(url).catch(() => {});
    }
  });

  // B12
  test('shows mention marker on channel row when 2nd user mentions me', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    // secondUser sends a structured mention message (mention_type + mentioned_user_ids required
    // for UIKit to render the mention badge on the channel-list row)
    await platform.sendMentionMessage(channel.url, secondUser.userId, `@${workerUser.userId} hello ${runTag}`, [workerUser.userId]);
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(
      page.locator('.sendbird-channel-preview').first().locator('[class*="mention"], [class*="at-mark"]'),
    ).toBeVisible({ timeout: 20_000 });
  });
});
