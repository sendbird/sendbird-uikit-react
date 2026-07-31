import { test, expect } from '../fixtures';
import { appPath, hasCreds } from '../utils/env';

/**
 * Open channel — navigation (Tier 0, single user). Loads /open_channel, which renders the open
 * channel list beside the conversation, then enters the first (seeded) channel.
 */
test.describe('open channel — navigation', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
  });

  test('lists open channels and enters one', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel();
    await page.goto(appPath('/open_channel', { userId: workerUser.userId }));

    // The list renders and shows at least the seeded channel; enter it.
    await page.locator('.sendbird-open-channel-preview').first().click({ timeout: 30_000 });

    // The conversation for the selected channel is shown.
    await expect(page.locator('.sendbird-openchannel-conversation-header')).toBeVisible({ timeout: 15_000 });
  });
});
