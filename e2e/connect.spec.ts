import { test, expect } from '@playwright/test';
import { appPath, hasCreds, E2E } from './utils/env';

/**
 * Connect: the app authenticates against the real backend AS the configured user and renders.
 * (Merges the former smoke render-check with the connected-identity check.)
 * Skips without credentials (see e2e/README.md).
 */
test.describe('connect', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
  });

  test('connects as the configured user and renders the app', async ({ page }) => {
    await page.goto(appPath('/group_channel'));

    await test.step('app shell + channel list render', async () => {
      await expect(page.locator('.sendbird-app__wrap')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('.sendbird-channel-list')).toBeVisible({ timeout: 30_000 });
    });

    await test.step('connected as the configured user', async () => {
      await expect(page.locator('.sendbird-channel-header__title__right__user-id'))
        .toContainText(E2E.userId, { timeout: 30_000 });
    });
  });
});
