import { test, expect } from '@playwright/test';
import { appPath, hasCreds } from './utils/env';

/**
 * User profile — edit (Tier 0, single user). Opens "My profile" from the channel-list header and
 * changes the current user's nickname, asserting the header reflects the new value.
 */
test.describe('user profile — edit', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
  });

  test('edits the current user nickname', async ({ page }) => {
    await page.goto(appPath('/group_channel'));
    // Wait for a channel preview so the SDK is connected and the user store is populated.
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });

    // Open "My profile" from the channel-list header.
    await page.locator('.sendbird-channel-list__header .sendbird-channel-header__title').click();
    await expect(page.locator('.sendbird-edit-user-profile')).toBeVisible({ timeout: 10_000 });

    const nickname = `tyler ${Date.now()}`;
    await page.locator('input[name="sendbird-edit-user-profile__name__input"]').fill(nickname);
    await page.getByRole('button', { name: 'Save' }).click();

    // The list header reflects the new nickname.
    await expect(page.locator('.sendbird-channel-header__title__right__name')).toHaveText(nickname, { timeout: 15_000 });
  });
});
