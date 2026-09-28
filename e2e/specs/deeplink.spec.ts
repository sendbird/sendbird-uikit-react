import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';

test.describe('deep-link', () => {
  // H5
  test('opens the specified channel directly when channelUrl param is provided', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ name: '[e2e] deeplink' });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, channelUrl: channel.url }));
    // The channel should open without manual selection
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.sendbird-channel-preview--active')).toBeVisible();
  });
});
