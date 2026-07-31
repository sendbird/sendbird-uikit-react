import { test, expect } from './fixtures';
import { hasCreds } from './utils/env';
import { openFirstGroupChannel } from './utils/actions';

/**
 * Group channel — settings (Tier 0, single user). Opens the settings panel from the conversation
 * header and renames the channel. The test user is the channel operator, so editing is allowed.
 */
test.describe('group channel — settings', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests.');
  });

  test('renames the channel from settings', async ({ page }) => {
    await openFirstGroupChannel(page);

    // Open the settings panel from the conversation header.
    await page.locator('.sendbird-chat-header__right__info').click();
    await expect(page.locator('.sendbird-channel-profile')).toBeVisible({ timeout: 10_000 });

    // Open the edit-details modal and set a new name.
    await page.locator('.sendbird-channel-profile__edit').click();
    const newName = `[e2e] renamed ${Date.now()}`;
    await page.locator('input[name="channel-profile-form__name"]').fill(newName);
    await page.getByRole('button', { name: 'Save' }).click();

    // The settings profile title reflects the new name.
    await expect(page.locator('.sendbird-channel-profile__title')).toHaveText(newName, { timeout: 15_000 });
  });
});
