import { test, expect } from './fixtures';
import { appPath, hasCreds } from './utils/env';

/**
 * Smoke — the essential chat journey: open a channel, send a text, and see it appear.
 * Requires the test user to be in at least one channel, and sends a real (marked) message to the
 * test App ID's backend. Skips without credentials (see e2e/README.md).
 */
test.describe('smoke: send a message', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
  });

  test('opens a channel and sends a text message', async ({ page }) => {
    await page.goto(appPath('/group_channel'));

    // Open the first channel in the list.
    await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });

    // Type a unique message into the contenteditable input and send it with Enter.
    const text = `[e2e-smoke] ${Date.now()}`;
    const input = page.locator('.sendbird-message-input [role="textbox"]').first();
    await input.click();
    await input.pressSequentially(text);
    await input.press('Enter');

    // The sent message renders in the conversation.
    await expect(page.locator('.sendbird-conversation__messages').getByText(text)).toBeVisible({ timeout: 15_000 });
  });
});
