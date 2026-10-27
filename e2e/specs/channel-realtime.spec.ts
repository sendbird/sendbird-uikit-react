import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openMessageMenu, sendText, messageByText } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('group channel — realtime features', () => {
  // D3
  test('shows frozen banner and disables input on a frozen channel', async ({ secondUser, secondPage, createChannel }) => {
    await createChannel({ freeze: true, memberIds: [secondUser.userId] });
    await openFirstGroupChannel(secondPage, { userId: secondUser.userId });
    await expect(secondPage.locator('.sendbird-notification--frozen')).toBeVisible({ timeout: 10_000 });
    await expect(secondPage.locator('.sendbird-message-input [role="textbox"]').first()).toHaveAttribute('aria-disabled', 'true');
  });

  // D5
  test('scrolls to and highlights the parent when a quoted message is clicked', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    await platform.sendMessage(channel.url, workerUser.userId, '[D5] parent message');
    await platform.seedMessages(channel.url, workerUser.userId, 25, '[D5] gap');

    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    const parent = messageByText(page, '[D5] parent message').first();

    // Scroll to top so the parent message is visible
    await msgList.evaluate((el) => { el.scrollTop = 0; });
    await expect(parent).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });

    // Open message menu on the parent → click Reply
    await openMessageMenu(page, '[D5] parent message');
    const replyItem = page.getByRole('menuitem', { name: /reply/i });
    await expect(replyItem).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await replyItem.click();

    // Send the quote reply via the UI input
    await sendText(page, '[D5] quote reply');

    // Scroll to bottom to see the newly sent quote reply
    await msgList.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect(parent).not.toBeInViewport();

    // Click the quote bubble — should scroll back up and highlight the parent
    const quoteMsg = page.locator('.sendbird-quote-message').last();
    await expect(quoteMsg).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await quoteMsg.click();
    await expect(parent).toHaveClass(/sendbird-msg-hoc__animated/);
    await expect(parent).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
