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

/** Type text into the conversation composer, send it, and wait until the server confirms it. */
export async function sendText(page: Page, text: string) {
  const input = page.locator('.sendbird-message-input [role="textbox"]').first();
  await input.click();
  await input.pressSequentially(text);
  await input.press('Enter');
  await expect(messageByText(page, text)).toBeVisible({ timeout: 15_000 });
}

/** Hover a confirmed message and open its action menu (kebab). */
export async function openMessageMenu(page: Page, text: string) {
  const msg = messageByText(page, text);
  await expect(msg).toBeVisible({ timeout: 15_000 });
  await msg.hover();
  await msg.locator('.sendbird-message-menu').getByRole('button').first().click();
}
