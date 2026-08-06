import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';

test.describe('connection & user profile — extended', () => {
  // A4
  test('updates header avatar after editing profile image', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().waitFor({ timeout: 30_000 });
    await page.locator('.sendbird-channel-list__header .sendbird-channel-header__title').click();
    await expect(page.locator('.sendbird-edit-user-profile')).toBeVisible({ timeout: 10_000 });
    // Upload a file via the avatar input
    const avatarInput = page.locator('input[type="file"]').first();
    await avatarInput.setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
    await page.getByRole('button', { name: /save/i }).click();
    // Avatar src should change from the default (empty or previous URL)
    const avatar = page.locator('.sendbird-channel-list__header .sendbird-avatar img').first();
    await expect(avatar).toHaveAttribute('src', /sendbird\.com|blob:/, { timeout: 15_000 });
  });

  // A7
  test('header swaps from user A to user B when userId is changed', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(
      page.locator('.sendbird-channel-header__title__right__user-id').filter({ hasText: workerUser.userId }),
    ).toBeVisible({ timeout: 30_000 });
    // Re-navigate as secondUser
    await page.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await expect(
      page.locator('.sendbird-channel-header__title__right__user-id').filter({ hasText: secondUser.userId }),
    ).toBeVisible({ timeout: 30_000 });
  });

  // A8
  test('toggles sendbird__offline class on body when going offline then online', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().waitFor({ timeout: 30_000 });
    // Simulate offline
    await page.context().setOffline(true);
    await expect(page.locator('body.sendbird__offline')).toBeVisible({ timeout: 15_000 });
    // Restore online
    await page.context().setOffline(false);
    await expect(page.locator('body.sendbird__offline')).not.toBeVisible({ timeout: 15_000 });
  });
});
