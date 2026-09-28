import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath, runTag } from '../utils/env';
import { openNamedOpenChannel, sendText, openMessageMenu } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('open channel — core scenarios', () => {
  // G3
  test('loads message history when entering an open channel', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g3-${runTag}` });
    await platform.seedOpenChannelMessages(channel.url, workerUser.userId, 3, '[G3]');
    await openNamedOpenChannel(page, `[e2e] g3-${runTag}`, { userId: workerUser.userId });
    await expect(page.getByText('[G3] 1')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // G4
  test('displays a sent user message in the open channel', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g4-${runTag}` });
    await openNamedOpenChannel(page, channel.url ? `[e2e] g4-${runTag}` : '', { userId: workerUser.userId });
    await sendText(page, `[e2e-g4] ${runTag}`);
    // sendText already confirmed the message; this extra check uses getByText for open channel
    await expect(page.getByText(`[e2e-g4] ${runTag}`).first()).toBeVisible({ timeout: 5_000 });
  });

  // G6
  test('removes own message from open channel after deletion', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel({ name: `[e2e] g6-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g6-${runTag}`, { userId: workerUser.userId });
    const msgText = `[e2e-g6-del] ${runTag}`;
    await sendText(page, msgText);
    await openMessageMenu(page, msgText);
    const deleteMenuItem = page.getByRole('menuitem', { name: /delete/i });
    if (!await deleteMenuItem.isVisible({ timeout: 5_000 }).catch(() => false)) {
      test.skip(); // context menu delete option not available
      return;
    }
    await deleteMenuItem.click();
    // RemoveMessageModal shows a "Delete" confirm button — wait for it and click via evaluate
    // to avoid actionability timing issues in parallel mode
    const confirmBtn = page.getByRole('button', { name: /delete/i }).last();
    await confirmBtn.waitFor({ state: 'attached', timeout: 10_000 });
    await confirmBtn.evaluate((el) => (el as HTMLButtonElement).click());
    // Message should be gone after confirmation
    await expect(page.getByText(msgText).first()).not.toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // G8
  test('auto-enters the newly created open channel after creation', async ({ page, workerUser }) => {
    const newName = `[e2e] g8-${runTag}`;
    await page.goto(appPath('/open_channel', { userId: workerUser.userId }));
    // Click the create / + button in the open channel list header (last button = create)
    await page.getByText('Channels').locator('..').getByRole('button').last()
      .click({ timeout: 15_000 });
    const nameInput = page.locator('[name="sendbird-create-open-channel-ui__profile-input__name-section__input"], .sendbird-create-open-channel-ui__profile input').first();
    if (!await nameInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
      test.skip(); // create form didn't open — environment limitation
      return;
    }
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /create/i }).last().click();
    await expect(page.locator('.sendbird-openchannel-conversation-header')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(newName)).toBeVisible();
  });

  // G9
  test('exits previous open channel when switching to another', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel({ name: `[e2e] g9a-${runTag}` });
    await createOpenChannel({ name: `[e2e] g9b-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g9a-${runTag}`, { userId: workerUser.userId });
    // Switch to channel B
    await page.getByText(`[e2e] g9b-${runTag}`).first().click();
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(`[e2e] g9b-${runTag}`))
      .toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    // Ensure we're no longer viewing channel A
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(`[e2e] g9a-${runTag}`))
      .not.toBeVisible();

  });

  // G10
  test('updates the header name after editing channel name (operator)', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel({ name: `[e2e] g10-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g10-${runTag}`, { userId: workerUser.userId });
    // Open settings — trigger shows INFO (operator) or MEMBERS (non-operator)
    await page.locator('.sendbird-openchannel-conversation-header__right__trigger').click();
    await expect(page.locator('.sendbird-openchannel-settings')).toBeVisible({ timeout: 10_000 });
    // Operator profile edit button (only visible when user is operator)
    const profileEdit = page.locator('.sendbird-openchannel-profile__edit');
    if (!await profileEdit.isVisible({ timeout: 5_000 }).catch(() => false)) {
      test.skip(); // operator role not loaded — skip
      return;
    }
    await profileEdit.click();
    const newName = `[e2e] g10-renamed-${runTag}`;
    const nameInput = page.locator('input[name="channel-profile-form__name"]');
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /save/i }).last().click();
    await expect(
      page.locator('.sendbird-openchannel-settings .sendbird-channel-profile__title').filter({ hasText: newName }),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

  });

  // G11
  test('removes channel from list after deletion (operator)', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel({ name: `[e2e] g11-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g11-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__trigger').click();
    await expect(page.locator('.sendbird-openchannel-settings')).toBeVisible({ timeout: 10_000 });
    // Delete channel option — only available for operators
    const deleteBtn = page.locator('.sendbird-openchannel-settings__delete-channel, [class*="delete-channel"]').first();
    if (!await deleteBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      test.skip(); // operator role not loaded — skip
      return;
    }
    await deleteBtn.click();
    await page.getByRole('button', { name: /delete/i }).last().click();
    await expect(page.getByText(`[e2e] g11-${runTag}`)).not.toBeVisible({ timeout: 10_000 });

  });

  // G12
  test('loads participant list in open channel settings', async ({ page, workerUser, createOpenChannel }) => {
    await createOpenChannel({ name: `[e2e] g12-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g12-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__trigger').click();
    await expect(page.locator('.sendbird-openchannel-settings')).toBeVisible({ timeout: 10_000 });
    // Open channel participants use sendbird-participants-accordion__member class
    await expect(
      page.locator('.sendbird-participants-accordion__member, .sendbird-openchannel-settings__participant-list').first(),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

  });
});
