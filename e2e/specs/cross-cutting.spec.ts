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
    // breakpoint=true forces mobile layout (UA-based detection doesn't work in Playwright Chromium)
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, breakpoint: 'true' }));
    // Mobile layout uses sb_mobile class (not sendbird-app__wrap)
    await expect(page.locator('.sb_mobile, .sendbird-app__wrap').first()).toBeVisible({ timeout: 30_000 });
    const listVisible = await page.locator('.sendbird-channel-list').isVisible();
    const convVisible = await page.locator('.sendbird-conversation').isVisible();
    // In mobile layout only one panel is visible at a time
    expect(listVisible && convVisible).toBe(false);
  });

  // H3
  test('applies RTL layout when htmlTextDirection=rtl is passed', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId, htmlTextDirection: 'rtl' }));
    await expect(page.locator('.sendbird-app__wrap, .sb_mobile').first()).toBeVisible({ timeout: 30_000 });
    // useHTMLTextDirection sets dir on the parentElement of the voice-player-root div
    // (the App.tsx wrapper div, not #root itself)
    const dir = await page.evaluate(() => {
      const el = document.getElementById('sendbird-voice-player-provider-root');
      return el?.parentElement?.getAttribute('dir') ?? null;
    });
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
