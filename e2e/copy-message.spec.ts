import { test, expect } from '@playwright/test';
import { hasCreds } from './utils/env';
import { openFirstGroupChannel, sendText, openMessageMenu } from './utils/actions';

/**
 * Group channel — copy message (Tier 1, single user). Copies an own message via the action menu
 * and verifies the clipboard contents. Requires clipboard permissions (granted below).
 */
test.describe('group channel — copy message', () => {
  test.beforeEach(async ({ context }) => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('copies a message to the clipboard', async ({ page }) => {
    await openFirstGroupChannel(page);
    const text = `[e2e-copy] ${Date.now()}`;
    await sendText(page, text);

    await openMessageMenu(page, text);
    await page.getByRole('menuitem', { name: 'Copy' }).click();

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain(text);
  });
});
