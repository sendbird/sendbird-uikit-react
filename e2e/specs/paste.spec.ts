import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { messageByText, openFirstGroupChannel, openMessageMenu, sendText } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import * as platform from '../utils/platform';

const composer = (page: Page) => page.locator('.sendbird-message-input [role="textbox"]').first();

async function paste(input: Locator, data: { text: string; html?: string }) {
  await input.click();
  await input.evaluate((el, { text, html }) => {
    const caret = document.createRange();
    caret.selectNodeContents(el);
    caret.collapse(false);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(caret);
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', text);
    if (html) clipboardData.setData('text/html', html);
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
  }, data);
}

const shownText = (input: Locator) => input.evaluate((el) => (el.textContent ?? '').replace(/\u200B/g, ''));

test.describe('group channel — paste', () => {
  test('sends pasted Japanese and Korean text unchanged (CLNP-5419)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const text = `こんにちは 世界 漢字 안녕하세요 ㄱㄴㄷ ${Date.now()}`;

    const input = composer(page);
    await paste(input, { text });
    await expect.poll(() => shownText(input)).toBe(text);
    await input.press('Enter');

    await expect(messageByText(page, text)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    expect(await platform.getLatestMessageText(channel.url)).toBe(text);
  });

  test('pastes formatted text as its plain text, keeping line breaks (CLNP-6276)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const lines = [`First line ${Date.now()}`, 'Second line'];
    const html = '<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-e2e">'
      + `<p dir="ltr"><span style="font-weight:700;">${lines[0]}</span></p>`
      + `<p dir="ltr"><span style="font-style:italic;">${lines[1]}</span></p></b>`;
    const text = lines.join('\n');

    const input = composer(page);
    await paste(input, { text, html });
    await expect.poll(() => shownText(input)).toBe(text);
    await expect(input.locator('b, i, p, span[style]')).toHaveCount(0);
    await input.press('Enter');

    await expect(messageByText(page, lines[0])).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    expect(await platform.getLatestMessageText(channel.url)).toBe(text);
  });

  test('leaves no zero-width space in a message sent after pasting (CLNP-8323)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const url = `https://sendbird.com/docs?e2e=${Date.now()}`;

    const input = composer(page);
    await paste(input, { text: url });
    await input.press('Enter');

    await expect(messageByText(page, url)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    expect(await platform.getLatestMessageText(channel.url)).toBe(url);
  });

  test('leaves no zero-width space in a message edited by pasting (CLNP-8323)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const original = `[e2e-paste-edit] ${Date.now()}`;
    const appended = ' EDITED';
    const edited = `${original}${appended}`;
    await sendText(page, original);
    await expect(messageByText(page, original)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await openMessageMenu(page, original);
    await page.getByRole('menuitem', { name: /edit/i }).first().click();
    const editInput = page.locator('.sendbird-message-input__edit [role="textbox"]');
    await paste(editInput, { text: appended });
    await page.locator('.sendbird-message-input--edit-action__save').click();

    await expect(page.locator('.sendbird-conversation__messages').getByText(edited)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect.poll(() => platform.getLatestMessageText(channel.url), { timeout: SERVER_RESPONSE_TIMEOUT }).toBe(edited);
  });
});
