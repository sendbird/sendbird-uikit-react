import { test, expect } from '../fixtures';
import { hasCreds } from '../utils/env';
import { openFirstGroupChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';

/**
 * Group channel — copy message (Tier 1, single user). Copies an own message via the action menu
 * and verifies the clipboard contents. Requires clipboard permissions (granted below).
 */
test.describe('group channel — copy message', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('copies a message to the clipboard', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const text = `[e2e-copy] ${Date.now()}`;
    await sendText(page, text);
    // Wait for server confirmation before opening menu to ensure GC path in openMessageMenu
    await expect(messageByText(page, text)).toBeVisible({ timeout: 15_000 });

    await openMessageMenu(page, text);
    await page.getByRole('menuitem', { name: 'Copy' }).click();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain(text);
  });
});
