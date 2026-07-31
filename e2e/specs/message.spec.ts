import { test, expect } from '../fixtures';
import { hasCreds } from '../utils/env';
import { openFirstGroupChannel, sendText, openMessageMenu } from '../utils/actions';

/**
 * Group channel — message actions (Tier 0, single user). Each test sends its own marked message
 * first, then acts on it. Sends real messages to the test App ID's backend. Skips without creds.
 */
test.describe('group channel — message actions', () => {
  test.beforeEach(() => {
    test.skip(!hasCreds, 'Set E2E_APP_ID and E2E_PLATFORM_API_TOKEN to run E2E tests.');
  });

  test('edits an own message', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const original = `[e2e-edit] ${Date.now()}`;
    const edited = `${original} EDITED`;
    await sendText(page, original);

    await openMessageMenu(page, original);
    await page.getByRole('menuitem', { name: 'Edit' }).click();

    const editInput = page.locator('.sendbird-message-input__edit [role="textbox"]');
    await editInput.click();
    await editInput.fill(edited);
    await page.locator('.sendbird-message-input--edit-action__save').click();

    await expect(page.locator('.sendbird-conversation__messages').getByText(edited)).toBeVisible({ timeout: 15_000 });
  });

  test('deletes an own message', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const text = `[e2e-delete] ${Date.now()}`;
    await sendText(page, text);

    await openMessageMenu(page, text);
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    // Confirm in the remove-message modal (danger button, exact text to avoid the menu item).
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect(page.locator('.sendbird-conversation__messages').getByText(text)).toHaveCount(0, { timeout: 15_000 });
  });
});
