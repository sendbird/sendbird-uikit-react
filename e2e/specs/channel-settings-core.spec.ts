import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openChannelSettings } from '../utils/actions';
import { appPath } from '../utils/env';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('channel settings — core', () => {
  // E3
  test('removes channel from list after leaving via settings', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Leave channel is a MenuItem div, not a native button — use class or text locator
    await page.locator('.sendbird-channel-settings__panel-item__leave-channel').click({ timeout: 15_000 });
    await page.getByRole('button', { name: /leave/i }).last().click();
    // Conversation should close and channel list should show no items
    await expect(page.locator('.sendbird-channel-preview')).toHaveCount(0, { timeout: 10_000 });
  });

  // E5
  test('toggles frozen/unfrozen state via the freeze toggle in settings', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Toggle freeze ON — Toggle renders as a button (not a checkbox); unique in this settings panel
    const freezeToggle = page.locator('[data-testid="sendbird-input-toggle-button"]').first();
    await expect(freezeToggle).toBeVisible({ timeout: 10_000 });
    await freezeToggle.click();
    // GroupChannel frozen notification class is sendbird-notification--frozen
    await expect(page.locator('.sendbird-notification--frozen')).toBeVisible({ timeout: 10_000 });
    // Toggle freeze OFF
    await expect(freezeToggle).toBeVisible({ timeout: 5_000 });
    await freezeToggle.click();
    await expect(page.locator('.sendbird-notification--frozen')).not.toBeVisible({ timeout: 10_000 });
  });

  // E11
  test('loads user rows when the invite picker is opened', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // Open create-channel flow to trigger user picker (invite step)
    // The header has user-profile button (first) and create-channel button (last)
    await page.locator('.sendbird-channel-list__header').getByRole('button').last().click({ timeout: 15_000 });
    await page.locator('.sendbird-add-channel__rectangle').first().click();
    await expect(page.locator('.sendbird-user-list-item').first()).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
