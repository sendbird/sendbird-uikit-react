import { test, expect } from '../fixtures';
import { openFirstGroupChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import * as platform from '../utils/platform';

/**
 * Group channel — quote reply (Tier 0, single user). Drives the app with replyType=QUOTE_REPLY so
 * the Reply menu item quotes the original message. Sends real messages to the test App ID.
 */
test.describe('group channel — quote reply', () => {
  test('replies to a message with a quote', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    const original = `[e2e-reply-src] ${Date.now()}`;
    await sendText(page, original);
    await expect(messageByText(page, original)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await openMessageMenu(page, original);
    const replyItem = page.getByRole('menuitem', { name: /^reply$/i }).first();
    await expect(replyItem).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await replyItem.click();

    // The composer shows a quote preview referencing the original message.
    await expect(page.locator('.sendbird-quote_message_input')).toContainText(original, { timeout: 10_000 });

    const reply = `[e2e-reply] ${Date.now()}`;
    await sendText(page, reply);

    // The sent reply renders a quoted parent carrying the original text.
    await expect(messageByText(page, reply).locator('.sendbird-quote-message')).toContainText(original, { timeout: SERVER_RESPONSE_TIMEOUT });
  });

  test('keeps a sent quote reply fully in view (CLNP-6705)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    await platform.seedMessages(channel.url, workerUser.userId, 20, '[quote]');
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    await expect(messageByText(page, '[quote] 20')).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });

    await openMessageMenu(page, '[quote] 20');
    await page.getByRole('menuitem', { name: /^reply$/i }).first().click();
    await expect(page.locator('.sendbird-quote_message_input')).toContainText('[quote] 20', { timeout: 10_000 });

    const reply = `[quote-reply] ${Date.now()}`;
    await sendText(page, reply);

    await expect(messageByText(page, reply)).toBeInViewport({ ratio: 1, timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
