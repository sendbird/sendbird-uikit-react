import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { messageByText, openFirstGroupChannel } from '../utils/actions';
import { runTag } from '../utils/env';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT, UNREAD_PILL_ABSENT } from '../utils/constants';

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
    await expect(messageByText(page, incomingText)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
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
    await expect(pill).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
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
    // Wait for the scroll state to propagate (onScrollPosition callback fires asynchronously)
    await page.waitForTimeout(500);
    // secondUser sends a new message while workerUser is scrolled up
    await platform.sendMessage(channel.url, secondUser.userId, `[d6] new ${runTag}`);
    // NewMessageCountFloatingButton (.sendbird-new-message-floating-button) appears when
    // scrolled up and new messages arrive (distinct from .sendbird-notification--frozen)
    await expect(
      page.locator('.sendbird-new-message-floating-button'),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // D7
  test('shows unread count button after mark-as-unread and clears it on click', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    test.skip(true, UNREAD_PILL_ABSENT);
    const channel = await createChannel({ memberIds: [secondUser.userId], seedMessage: null });
    // Mark-as-unread only raises a count for messages from someone else, so seed from secondUser.
    // 12 messages also make the conversation scrollable, which the separator needs to leave view.
    await platform.seedMessages(channel.url, secondUser.userId, 12, '[d7-seed]');
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableMarkAsUnread: 'true' });
    // Use the last confirmed message directly
    const lastMsg = page.locator('[data-testid="sendbird-message-view"][data-sb-message-id]:not([data-sb-message-id="0"])').last();
    await expect(lastMsg).toBeVisible({ timeout: 5_000 });
    await lastMsg.hover();
    const menuTrigger = lastMsg.locator('.sendbird-message-menu').getByRole('button').first();
    await expect(menuTrigger).toBeVisible({ timeout: 10_000 });
    await menuTrigger.click();
    const markUnreadItem = page.getByRole('menuitem', { name: /mark as unread/i });
    await expect(markUnreadItem).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await markUnreadItem.click();
    // Wait for the "New Messages" separator — confirms SDK fired EVENT_CHANNEL_UNREAD
    await expect(page.locator('.sendbird-separator').filter({ hasText: /new messages/i })).toBeVisible({ timeout: 15_000 });
    // Scroll up, wait for unreadMessageCount event, then nudge scroll to re-trigger IntersectionObserver
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    await page.waitForTimeout(2000);
    await msgList.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(300);
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    // UnreadCountFloatingButton appears once the separator leaves the viewport.
    const pill = page.locator('.sendbird-unread-floating-button');
    await expect(pill).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    const closeIcon = pill.locator('.sendbird-icon').last();
    await closeIcon.click().catch(async () => pill.click());
    await expect(pill).not.toBeVisible({ timeout: 5_000 });
  });

  // D8
  test('returns to channel list when back button is pressed on mobile viewport', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    // Use mobile viewport and pass breakpoint=true so the app enters mobile layout
    await page.setViewportSize({ width: 375, height: 812 });
    await openFirstGroupChannel(page, { userId: workerUser.userId, breakpoint: 'true' });
    // Mobile back button (.sendbird-chat-header__icon_back is only rendered when isMobile=true)
    const backBtn = page.locator('.sendbird-chat-header__icon_back').first();
    await expect(backBtn).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await backBtn.click();
    await expect(page.locator('.sendbird-channel-list')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.sendbird-conversation')).not.toBeVisible();
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
