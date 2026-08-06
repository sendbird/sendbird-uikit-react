import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openChannelSettings } from '../utils/actions';
import { appPath } from '../utils/env';

test.describe('channel settings — core', () => {
  // E3
  test('removes channel from list after leaving via settings', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    await page.getByRole('button', { name: /leave channel/i }).click();
    await page.getByRole('button', { name: /leave/i }).last().click();
    // Conversation should close and channel list should show no items
    await expect(page.locator('.sendbird-channel-preview')).toHaveCount(0, { timeout: 10_000 });
  });

  // E5
  test('toggles frozen/unfrozen state via the freeze toggle in settings', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Toggle freeze ON
    const freezeToggle = page.locator('[class*="freeze"] input[type="checkbox"]').first();
    await freezeToggle.check();
    await expect(page.locator('.sendbird-frozen-channel-notification')).toBeVisible({ timeout: 10_000 });
    // Toggle freeze OFF
    await freezeToggle.uncheck();
    await expect(page.locator('.sendbird-frozen-channel-notification')).not.toBeVisible({ timeout: 10_000 });
  });

  // E11
  test('loads user rows when the invite picker is opened', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // Open create-channel flow to trigger user picker (invite step)
    await page.locator('.sendbird-channel-list__header').getByRole('button').first().click({ timeout: 15_000 });
    await page.locator('.sendbird-add-channel__rectangle').first().click();
    await expect(page.locator('.sendbird-user-list-item').first()).toBeVisible({ timeout: 15_000 });
  });
});
