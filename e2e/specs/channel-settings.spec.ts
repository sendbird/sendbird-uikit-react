import { test, expect } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';

/**
 * Group channel — settings (Tier 0, single user). Opens the settings panel from the conversation
 * header and renames the channel. The test user is the channel operator, so editing is allowed.
 */
test.describe('group channel — settings', () => {
  test('renames the channel from settings', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });

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
