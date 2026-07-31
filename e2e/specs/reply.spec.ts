import { test, expect } from '../fixtures';
import { hasCreds } from '../utils/env';
import { openFirstGroupChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';

/**
 * Group channel — quote reply (Tier 0, single user). Drives the app with replyType=QUOTE_REPLY so
 * the Reply menu item quotes the original message. Sends real messages to the test App ID.
 */
test.describe('group channel — quote reply', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_USER_ID to run E2E tests.');
  });

  test('replies to a message with a quote', async ({ page }) => {
    await openFirstGroupChannel(page, { groupChannel_replyType: 'QUOTE_REPLY' });
    const original = `[e2e-reply-src] ${Date.now()}`;
    await sendText(page, original);

    await openMessageMenu(page, original);
    await page.getByRole('menuitem', { name: 'Reply' }).click();

    // The composer shows a quote preview referencing the original message.
    await expect(page.locator('.sendbird-quote_message_input')).toContainText(original, { timeout: 10_000 });

    const reply = `[e2e-reply] ${Date.now()}`;
    await sendText(page, reply);

    // The sent reply renders a quoted parent carrying the original text.
    await expect(messageByText(page, reply).locator('.sendbird-quote-message')).toContainText(original, { timeout: 15_000 });
  });
});
