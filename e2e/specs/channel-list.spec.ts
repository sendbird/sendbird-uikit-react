import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';

test.describe('group channel list', () => {
  // B1
  test('renders channel previews on load and shows no loading placeholder', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.sendbird-place-holder--loading')).not.toBeVisible();
  });

  // B2
  test('opens conversation and marks item active when channel is clicked', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.sendbird-channel-preview--active')).toBeVisible();
  });

  // B3
  test('shows no-channels placeholder when user has no channels', async ({ page, workerUser }) => {
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(
      page.locator('.sendbird-place-holder').filter({ hasText: /no channel/i }),
    ).toBeVisible({ timeout: 15_000 });
  });

  // B4
  test('auto-selects first channel and opens conversation on load', async ({ page, workerUser, createChannel }) => {
    await createChannel({ name: '[e2e] ch-a' });
    await createChannel({ name: '[e2e] ch-b' });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.sendbird-channel-preview--active')).toBeVisible();
  });

  // B9
  test('removes channel row after leaving from list context menu', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    const preview = page.locator('.sendbird-channel-preview').first();
    await expect(preview).toBeVisible({ timeout: 30_000 });
    await preview.hover();
    // Click the ⋮ MORE button in the channel preview action area
    await preview.locator('.sendbird-channel-preview__action [role="button"], .sendbird-channel-preview__action button').first().click({ timeout: 5_000 });
    // Click "Leave channel" from the dropdown
    await page.getByRole('menuitem', { name: /leave channel/i }).click({ timeout: 5_000 });
    // Confirm leave in the modal
    await page.getByRole('button', { name: /^leave$/i }).last().click({ timeout: 5_000 });
    await expect(page.locator('.sendbird-channel-preview')).toHaveCount(0, { timeout: 10_000 });
  });
});
