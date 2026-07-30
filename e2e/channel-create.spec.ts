import { test, expect } from './fixtures';
import { appPath, E2E, hasCreds } from './utils/env';

/**
 * Group channel — create (Tier 0). Creates a group channel and invites the seeded second user
 * (global-setup ensures E2E.userId2 exists so the invite list is non-empty).
 */
test.describe('group channel — create', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
  });

  test('creates a group channel with an invited member', async ({ page }) => {
    await page.goto(appPath('/group_channel'));
    // Wait for a real channel preview: this signals the SDK is connected and settled, so the
    // create modal's user-list query (sdk.createApplicationUserListQuery) has a live SDK instance.
    await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });

    // Open the create-channel flow and choose the Group channel type.
    await page.locator('.sendbird-channel-list__header button:has(.sendbird-icon-create)').click();
    await page.locator('.sendbird-add-channel__rectangle').first().click();

    // Select the seeded second user, then create.
    await page.locator('.sendbird-user-list-item').filter({ hasText: E2E.userId2 })
      .locator('.sendbird-user-list-item__checkbox').click();
    await page.getByRole('button', { name: 'Create' }).click();

    // The new channel opens and its header shows the invited member.
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.sendbird-chat-header')).toContainText(E2E.userId2, { timeout: 10_000 });
  });
});
