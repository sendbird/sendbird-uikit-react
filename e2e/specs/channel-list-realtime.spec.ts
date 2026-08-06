import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
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
      page.locator('.sendbird-channel-preview').first().locator('[class*="unread-message-count"]'),
    ).toBeVisible({ timeout: 10_000 });
  });

  // B6
  test('clears unread badge after opening the unread channel', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const unreadCh = await createChannel({ name: `[e2e] b6-unread-${runTag}`, memberIds: [secondUser.userId] });
    // secondUser sends a message to create unread state in unreadCh
    await platform.sendMessage(unreadCh.url, secondUser.userId, `[b6] ${runTag}`);
    // Create active channel AFTER so its seed message is newest → app auto-opens it,
    // leaving unreadCh in the list with its badge still visible
    await createChannel({ name: `[e2e] b6-active-${runTag}`, memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // Verify unread badge is visible on unreadCh (not the auto-opened active channel)
    const unreadPreview = page.locator('.sendbird-channel-preview').filter({ hasText: `[e2e] b6-unread-${runTag}` });
    await expect(unreadPreview.locator('[class*="unread-message-count"]')).toBeVisible({ timeout: 20_000 });
    // Open unreadCh → badge should disappear
    await unreadPreview.click();
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 10_000 });
    await expect(
      page.locator('.sendbird-channel-preview--active').locator('[class*="unread-message-count"]'),
    ).not.toBeVisible({ timeout: 10_000 });
  });

  // B7
  test('shows typing indicator in conversation while 2nd user is typing', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    // Both users open the same channel; the conversation footer typing indicator
    // is simpler to test reliably than the channel-list row indicator.
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });

    // secondUser opens the same channel
    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await secondPage.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    await expect(secondPage.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });

    // secondUser types — run concurrently with the assertion so we catch the indicator
    // while typing is still in progress (it disappears ~3s after the last keystroke)
    const input = secondPage.locator('.sendbird-message-input [role="textbox"]').first();
    await input.click();
    // Start typing without awaiting, then check for indicator while typing is in progress
    const typePromise = input.type('[b7] typing indicator test...', { delay: 100 });
    await expect(page.getByText(/is typing/i)).toBeVisible({ timeout: 15_000 });
    await typePromise;
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
    // Give the mention channel a distinct name so we can target it in the list
    const channel = await createChannel({ name: `[e2e] b12-mention-${runTag}`, memberIds: [secondUser.userId] });
    // Send mention before creating the active channel so the active channel's seed message
    // is the newest → app auto-opens active, leaving mention channel in list with badge.
    await platform.sendMentionMessage(channel.url, secondUser.userId, `@${workerUser.userId} hello ${runTag}`, [workerUser.userId]);
    await createChannel({ name: `[e2e] b12-active-${runTag}`, memberIds: [secondUser.userId] });
    // groupChannel_enableMention defaults to false — enable it so the mention badge renders
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, groupChannel_enableMention: 'true' }));
    await expect(
      page.locator('.sendbird-channel-preview').filter({ hasText: `[e2e] b12-mention-${runTag}` }).locator('[class*="mention"]'),
    ).toBeVisible({ timeout: 20_000 });
  });
});
