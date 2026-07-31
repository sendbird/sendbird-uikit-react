import { test, expect } from '../fixtures';
import { appPath, hasCreds } from '../utils/env';

/**
 * Smoke — the essential chat journey: create an isolated channel, open it, send a text, and see it
 * appear. Uses a per-worker user + a channel created via the Platform API, so it is safe to run in
 * parallel and concurrently with other developers. Skips without credentials.
 */
test.describe('smoke: send a message', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
  });

  test('opens a channel and sends a text message', async ({ page, workerUser, createChannel }) => {
    await createChannel({ name: '[e2e] smoke' });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));

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
