import { test, expect } from '@playwright/test';
import { hasCreds } from './utils/env';
import { openFirstGroupChannel, sendText, messageByText } from './utils/actions';

/**
 * Group channel — reactions (Tier 0, single user). Drives the app with enableReactions=true, then
 * reacts to an own message. Requires reactions to be enabled on the test App ID.
 */
test.describe('group channel — reactions', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests (see e2e/README.md).');
  });

  test('adds an emoji reaction to a message', async ({ page }) => {
    await openFirstGroupChannel(page, { groupChannel_enableReactions: 'true' });
    const text = `[e2e-react] ${Date.now()}`;
    await sendText(page, text);

    const msg = messageByText(page, text);
    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();

    // Pick the first emoji from the picker (rendered in a dropdown/portal).
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();

    // A reaction badge appears on the message.
    await expect(msg.locator('.sendbird-emoji-reactions__reaction-badge')).toBeVisible({ timeout: 15_000 });
  });

  test('removes an emoji reaction from a message', async ({ page }) => {
    await openFirstGroupChannel(page, { groupChannel_enableReactions: 'true' });
    const text = `[e2e-unreact] ${Date.now()}`;
    await sendText(page, text);

    const msg = messageByText(page, text);
    const badge = msg.locator('.sendbird-emoji-reactions__reaction-badge');

    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();
    await expect(badge).toBeVisible({ timeout: 15_000 });

    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();
    await expect(badge).toBeHidden({ timeout: 15_000 });
  });
});
