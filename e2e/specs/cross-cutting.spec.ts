import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath } from '../utils/env';

test.describe('cross-cutting — config & responsive', () => {
  // H1
  test('applies dark theme when theme=dark is passed', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, theme: 'dark' }));
    await expect(page.locator('body.sendbird-theme--dark')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('body.sendbird-theme--light')).not.toBeVisible();
  });

  // H2
  test('renders mobile layout on a 375px viewport', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // On mobile the channel list and conversation panels should NOT both be visible simultaneously
    await expect(page.locator('.sendbird-app__wrap')).toBeVisible({ timeout: 30_000 });
    const listVisible = await page.locator('.sendbird-channel-list').isVisible();
    const convVisible = await page.locator('.sendbird-conversation').isVisible();
    // In mobile layout only one panel is visible at a time
    expect(listVisible && convVisible).toBe(false);
  });

  // H3
  test('applies RTL layout when htmlTextDirection=rtl is passed', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, htmlTextDirection: 'rtl' }));
    await expect(page.locator('.sendbird-app__wrap')).toBeVisible({ timeout: 30_000 });
    const dir = await page.locator('.sendbird-app__wrap').getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  // H4
  test('hides reaction UI when enableReactions feature flag is off', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', {
      userId: workerUser.userId,
      'groupChannel_enableReactions': 'false',
    }));
    await page.locator('.sendbird-channel-preview').first().click({ timeout: 30_000 });
    await page.locator('.sendbird-conversation').waitFor({ timeout: 15_000 });
    // Hover a message — reaction trigger should NOT appear
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.hover();
    await expect(page.locator('.sendbird-message-item-reaction-menu__trigger')).not.toBeVisible({ timeout: 3_000 });
  });
});
