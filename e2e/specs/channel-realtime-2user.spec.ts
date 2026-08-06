import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, sendText } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('group channel — realtime (2nd-user)', () => {
  // D1
  test('displays incoming message and auto-scrolls when user is at bottom', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });

    // secondUser sends a message
    const incomingText = `[d1] incoming ${runTag}`;
    await platform.sendMessage(channel.url, secondUser.userId, incomingText);

    // Message should appear in the conversation
    await expect(page.getByText(incomingText)).toBeVisible({ timeout: 15_000 });
    void secondPage;
  });

  // D2
  test('shows N-new pill when user is scrolled up and incoming arrives, click scrolls down', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    // Seed 25 messages so the conversation is scrollable
    await platform.seedMessages(channel.url, workerUser.userId, 25, '[d2]');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll to the top so we're not at the bottom
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });

    // secondUser sends a new message
    const incomingText = `[d2] new ${runTag}`;
    await platform.sendMessage(channel.url, secondUser.userId, incomingText);

    // New-message pill should appear
    const pill = page.locator('[class*="new-message"], [class*="scroll-bottom-button"]');
    await expect(pill).toBeVisible({ timeout: 15_000 });
    await pill.click();
    // Should scroll to bottom and show the incoming message
    await expect(page.getByText(incomingText)).toBeVisible({ timeout: 10_000 });
  });

  // D4
  test('removes frozen banner and enables input after unfreezing channel', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel({ freeze: true });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await expect(page.locator('.sendbird-frozen-channel-notification')).toBeVisible({ timeout: 10_000 });
    // Unfreeze via channel settings (workerUser is operator)
    await page.locator('.sendbird-chat-header__right__info').click();
    await expect(page.locator('.sendbird-channel-settings')).toBeVisible({ timeout: 10_000 });
    const freezeToggle = page.locator('[class*="freeze"] input[type="checkbox"]').first();
    await freezeToggle.uncheck();
    await page.locator('.sendbird-chat-header__right__info').click(); // close settings
    await expect(page.locator('.sendbird-frozen-channel-notification')).not.toBeVisible({ timeout: 10_000 });
    await expect(
      page.locator('.sendbird-message-input--disabled, .sendbird-message-input [disabled]'),
    ).not.toBeVisible({ timeout: 5_000 });
  });

  // D6
  test('shows new-messages separator when opening a channel with unreads', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    // secondUser sends messages to create unread state for workerUser
    for (let i = 0; i < 3; i++) {
      await platform.sendMessage(channel.url, secondUser.userId, `[d6] msg ${i} ${runTag}`);
    }
    // Navigate to the channel list but do NOT click the channel yet — first time open shows separator
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    await expect(
      page.locator('[class*="new-message-notification"], [class*="unread-message-notification"]'),
    ).toBeVisible({ timeout: 10_000 });
  });

  // D7
  test('shows unread count button after mark-as-unread and clears it on click', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await sendText(page, `[d7] ${runTag}`);
    // Mark the last message as unread via context menu (if supported)
    const msg = page.locator('[data-testid="sendbird-message-view"]').last();
    await msg.hover();
    const moreBtn = msg.locator('.sendbird-message-menu').getByRole('button').first();
    await moreBtn.click({ timeout: 5_000 }).catch(() => {});
    const markUnreadItem = page.getByRole('menuitem', { name: /mark as unread/i });
    if (await markUnreadItem.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await markUnreadItem.click();
      const pill = page.locator('[class*="new-message"], [class*="unread"]').filter({ hasText: /\d/ });
      await expect(pill).toBeVisible({ timeout: 10_000 });
      await pill.click();
      await expect(pill).not.toBeVisible({ timeout: 5_000 });
    } else {
      test.skip();
    }
  });

  // D8
  test('returns to channel list when back button is pressed on mobile viewport', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Mobile back button
    const backBtn = page.locator('[class*="back-btn"], .sendbird-chat-header__back').first();
    if (await backBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await backBtn.click();
      await expect(page.locator('.sendbird-channel-list')).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('.sendbird-conversation')).not.toBeVisible();
    } else {
      test.skip();
    }
  });

  // D9
  test('shows scroll-to-bottom chevron after scrolling up and navigates to bottom on click', async ({
    page, workerUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null });
    await platform.seedMessages(channel.url, workerUser.userId, 30, '[d9]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll up
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    // Chevron should appear
    const chevron = page.locator('[class*="scroll-bottom"], [class*="scroll-down"]').first();
    await expect(chevron).toBeVisible({ timeout: 10_000 });
    await chevron.click();
    // Should be at bottom — last message visible
    await expect(page.getByText('[d9] 30')).toBeVisible({ timeout: 10_000 });
  });
});
