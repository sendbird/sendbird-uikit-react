import { test, expect } from '../fixtures';
import { appPath, hasCreds } from '../utils/env';

/**
 * Connect: the app authenticates against the real backend AS the configured user and renders.
 * (Merges the former smoke render-check with the connected-identity check.)
 * Skips without credentials.
 */
test.describe('connect', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
  });

  test('connects as the configured user and renders the app', async ({ page, workerUser }) => {
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));

    await test.step('app shell + channel list render', async () => {
      await expect(page.locator('.sendbird-app__wrap')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('.sendbird-channel-list')).toBeVisible({ timeout: 30_000 });
    });

    await test.step('connected as the configured user', async () => {
      await expect(page.locator('.sendbird-channel-header__title__right__user-id'))
        .toContainText(workerUser.userId, { timeout: 30_000 });
    });
  });

  test('does not connect with an invalid app id', async ({ page }) => {
    await page.goto(appPath('/group_channel', { appId: '00000000-0000-0000-0000-000000000000', userId: 'e2e-invalid-probe' }));
    await expect(page.locator('.sendbird-channel-header__title__right__user-id')).toBeHidden({ timeout: 20_000 });
  });

  test('shows the nickname passed as a connection param in the header', async ({ page, workerUser }) => {
    const nickname = `E2E Nick ${Date.now()}`;
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, nickname }));
    await expect(page.locator('.sendbird-channel-header__title__right__name')).toHaveText(nickname, { timeout: 30_000 });
  });
});
