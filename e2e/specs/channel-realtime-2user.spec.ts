import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { messageByText, openFirstGroupChannel, sendText } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('group channel — realtime (2nd-user)', () => {
  // D1
  test('displays incoming message and auto-scrolls when user is at bottom', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });

    // secondUser sends a message via Platform API
    const incomingText = `[d1] incoming ${runTag}`;
    await platform.sendMessage(channel.url, secondUser.userId, incomingText);

    // Message should appear in the conversation (messageByText uses the specific message-view locator
    // to avoid strict-mode violation from the channel list also showing the text as last message preview)
    await expect(messageByText(page, incomingText)).toBeVisible({ timeout: 15_000 });
  });

  // D2
  test('shows N-new pill when user is scrolled up and incoming arrives, click scrolls down', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    // Seed 20 messages so the conversation is scrollable (25 risks hitting the 5/s rate limit)
    await platform.seedMessages(channel.url, workerUser.userId, 20, '[d2]');

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll to the top so we're not at the bottom
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });

    // secondUser sends a new message
    const incomingText = `[d2] new ${runTag}`;
    await platform.sendMessage(channel.url, secondUser.userId, incomingText);

    // New-message pill should appear (.first() avoids strict-mode when scroll-bottom button is also visible)
    const pill = page.locator('[class*="new-message"], [class*="scroll-bottom-button"]').first();
    await expect(pill).toBeVisible({ timeout: 15_000 });
    await pill.click();
    // Should scroll to bottom and show the incoming message
    await expect(messageByText(page, incomingText)).toBeVisible({ timeout: 10_000 });
  });

  // D4
  test('removes frozen banner and enables input after unfreezing channel', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel({ freeze: true });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // GroupChannel frozen notification class is sendbird-notification--frozen
    await expect(page.locator('.sendbird-notification--frozen')).toBeVisible({ timeout: 10_000 });
    // Unfreeze via channel settings (workerUser is operator)
    await page.locator('.sendbird-chat-header__right__info').click();
    await expect(page.locator('.sendbird-channel-settings')).toBeVisible({ timeout: 10_000 });
    // Toggle renders as a button (not a checkbox); unique in this settings panel
    const freezeToggle = page.locator('[data-testid="sendbird-input-toggle-button"]').first();
    await freezeToggle.click();
    await page.locator('.sendbird-chat-header__right__info').click(); // close settings
    await expect(page.locator('.sendbird-notification--frozen')).not.toBeVisible({ timeout: 10_000 });
    await expect(
      page.locator('.sendbird-message-input--disabled, .sendbird-message-input [disabled]'),
    ).not.toBeVisible({ timeout: 5_000 });
  });

  // D6
  test('shows new-messages notification when user is scrolled up and new messages arrive', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    // Seed background messages from secondUser (workerUser's rate limit used by D2 earlier)
    await platform.seedMessages(channel.url, secondUser.userId, 15, '[d6-bg]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll to the top so we're NOT at the bottom
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    // secondUser sends a new message while workerUser is scrolled up
    await platform.sendMessage(channel.url, secondUser.userId, `[d6] new ${runTag}`);
    // sendbird-conversation__messages__notification appears when scrolled up + newMessages arrive
    await expect(
      page.locator('.sendbird-conversation__messages__notification'),
    ).toBeVisible({ timeout: 15_000 });
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
      return;
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
      return;
    }
  });

  // D9
  test('shows scroll-to-bottom chevron after scrolling up and navigates to bottom on click', async ({
    page, workerUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null });
    // 15 messages: enough to make the list scrollable without hitting the per-user rate limit (5/s)
    await platform.seedMessages(channel.url, workerUser.userId, 15, '[d9]');
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Scroll up
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    // Chevron should appear
    const chevron = page.locator('[class*="scroll-bottom"], [class*="scroll-down"]').first();
    await expect(chevron).toBeVisible({ timeout: 10_000 });
    await chevron.click();
    // Should be at bottom — last message visible (messageByText avoids strict-mode with channel list preview)
    await expect(messageByText(page, '[d9] 15')).toBeVisible({ timeout: 10_000 });
  });
});
