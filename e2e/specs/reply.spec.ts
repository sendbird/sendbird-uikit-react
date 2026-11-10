import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { openFirstGroupChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import { appPath } from '../utils/env';
import * as platform from '../utils/platform';

async function startQuoteReply(page: Page, text: string) {
  await expect(messageByText(page, text)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  await openMessageMenu(page, text);
  await page.getByRole('menuitem', { name: /^reply$/i }).first().click();
  await expect(page.locator('.sendbird-quote_message_input')).toContainText(text, { timeout: 10_000 });
}

async function expectSentReplyQuotes(page: Page, original: string) {
  const reply = `[quote-keep] reply ${Date.now()}`;
  await sendText(page, reply);
  await expect(messageByText(page, reply).locator('.sendbird-quote-message')).toContainText(original, { timeout: SERVER_RESPONSE_TIMEOUT });
}

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

  test('keeps the quote reply when a message arrives while composing it (CLNP-8097)', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    const original = `[quote-keep] ${Date.now()}`;
    await platform.sendMessage(channel.url, workerUser.userId, original);
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    await startQuoteReply(page, original);

    const incoming = `[quote-keep] incoming ${Date.now()}`;
    await platform.sendMessage(channel.url, secondUser.userId, incoming);
    await expect(messageByText(page, incoming)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(page.locator('.sendbird-quote_message_input')).toContainText(original);

    await expectSentReplyQuotes(page, original);
  });

  test('keeps the quote reply when the other member starts typing (CLNP-8097)', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    const original = `[quote-keep] ${Date.now()}`;
    await platform.sendMessage(channel.url, workerUser.userId, original);
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    await startQuoteReply(page, original);

    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await secondPage.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    const otherInput = secondPage.locator('.sendbird-message-input [role="textbox"]').first();
    await otherInput.click();
    const typing = otherInput.pressSequentially('typing while the other side replies', { delay: 100 });
    await expect(page.getByText(/is typing/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.sendbird-quote_message_input')).toContainText(original);
    await typing;

    await expectSentReplyQuotes(page, original);
  });
});
