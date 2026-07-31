import { test, expect } from '../fixtures';
import { appPath, hasCreds } from '../utils/env';

/**
 * Group channel — create (Tier 0). Creates a group channel and invites a per-run throwaway user
 * (secondUser), so the invite list has a known member to select.
 */
test.describe('group channel — create', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
  });

  test('creates a group channel with an invited member', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel();
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    // Wait for a real channel preview: this signals the SDK is connected and settled, so the
    // create modal's user-list query (sdk.createApplicationUserListQuery) has a live SDK instance.
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });

    // Open the create-channel flow and choose the Group channel type.
    await page.locator('.sendbird-channel-list__header button:has(.sendbird-icon-create)').click();
    await page.locator('.sendbird-add-channel__rectangle').first().click();

    // Select the second user, then create.
    await page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId })
      .locator('.sendbird-user-list-item__checkbox').click();
    await page.getByRole('button', { name: 'Create' }).click();

    // The new channel opens and its header shows the invited member.
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.sendbird-chat-header')).toContainText(secondUser.userId, { timeout: 10_000 });
  });
});
