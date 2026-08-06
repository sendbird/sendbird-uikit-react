import { expect, Locator, Page } from '@playwright/test';
import { appPath } from './env';

/** Open /group_channel and enter the first channel; resolves once the conversation is visible. */
export async function openFirstGroupChannel(page: Page, params: Record<string, string | undefined> = {}) {
  await page.goto(appPath('/group_channel', params));
  await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
  await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });
}

/**
 * Locate a *confirmed* message bubble by its (unique) text. Pending copies carry
 * data-sb-message-id="0" and have no edit/delete menu, so they are excluded.
 */
export function messageByText(page: Page, text: string): Locator {
  return page
    .locator('[data-testid="sendbird-message-view"][data-sb-message-id]:not([data-sb-message-id="0"])')
    .filter({ hasText: text });
}

/** Type text into the conversation composer, send it, and wait until the server confirms it.
 *  Works for both group channels (uses sendbird-message-view testid) and open channels (fallback). */
export async function sendText(page: Page, text: string) {
  const input = page.locator('.sendbird-message-input [role="textbox"]').first();
  await input.click();
  await input.pressSequentially(text);
  await input.press('Enter');
  const gcMsg = messageByText(page, text);
  if (await gcMsg.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await expect(gcMsg).toBeVisible({ timeout: 15_000 });
  } else {
    // Open channel messages lack data-testid="sendbird-message-view" — use text search
    await expect(page.getByText(text).first()).toBeVisible({ timeout: 15_000 });
  }
}

/** Hover a confirmed message and open its action menu (kebab). Works for both GC and OC. */
export async function openMessageMenu(page: Page, text: string) {
  const gcMsg = messageByText(page, text);
  const isGC = await gcMsg.isVisible({ timeout: 5_000 }).catch(() => false);
  if (isGC) {
    await expect(gcMsg).toBeVisible({ timeout: 15_000 });
    await gcMsg.hover();
    await gcMsg.locator('.sendbird-message-menu').getByRole('button').first().click();
  } else {
    // Open channel: container is sendbird-openchannel-user-message
    const ocMsg = page.locator('.sendbird-openchannel-user-message').filter({ hasText: text }).first();
    await expect(ocMsg).toBeVisible({ timeout: 15_000 });
    await ocMsg.hover();
    await ocMsg.locator('.sendbird-openchannel-user-message__context-menu button, .sendbird-message-menu button').first().click();
  }
}

/** Open the message search panel (click the search icon in the chat header). */
export async function openSearch(page: Page) {
  await page.locator('.sendbird-chat-header__right__search').click();
  await expect(page.locator('.sendbird-message-search')).toBeVisible({ timeout: 10_000 });
}

/** Type a keyword into the search box and wait for results (or empty state). */
export async function searchFor(page: Page, keyword: string, timeoutMs = 30_000) {
  const input = page.locator('.sendbird-message-search-pannel__input__container input');
  await input.fill(keyword);
  await input.press('Enter');
  // wait for either results or the no-result placeholder
  await page.locator('.sendbird-message-search-pannel__list, .sendbird-message-search-pannel__placeholder')
    .first()
    .waitFor({ timeout: timeoutMs });
}

/** Open the thread panel from a confirmed message by clicking the Reply (thread) menu item. */
export async function openThread(page: Page, messageText: string) {
  await openMessageMenu(page, messageText);
  await page.getByRole('menuitem', { name: /reply in thread/i }).click();
  await expect(page.locator('.sendbird-thread-ui')).toBeVisible({ timeout: 10_000 });
}

/** Open the channel settings panel. */
export async function openChannelSettings(page: Page) {
  await page.locator('.sendbird-chat-header__right__info').click();
  await expect(page.locator('.sendbird-channel-settings')).toBeVisible({ timeout: 10_000 });
}

/**
 * Navigate to /open_channel and click the first preview matching `channelName`.
 * Resolves once the open-channel conversation header is visible.
 */
export async function openNamedOpenChannel(page: Page, channelName: string, params: Record<string, string | undefined> = {}) {
  await page.goto(appPath('/open_channel', params));
  await page.getByText(channelName).first().click({ timeout: 30_000 });
  await expect(page.locator('.sendbird-openchannel-conversation-header')).toBeVisible({ timeout: 15_000 });
}
