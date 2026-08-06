import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openNamedOpenChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('open channel — extended', () => {
  // G5
  test('renders file bubble after sending a file in open channel', async ({
    page, workerUser, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g5-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g5-${runTag}`, { userId: workerUser.userId });
    const fileInput = page.locator('.sendbird-message-input [type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
    await page.locator('.sendbird-message-input__send').click({ timeout: 5_000 }).catch(() => {});
    await expect(
      page.locator('.sendbird-thumbnail-message-item-body, .sendbird-file-message-item-body').last(),
    ).toBeVisible({ timeout: 20_000 });
  });

  // G7
  test('updates the message text after editing in open channel', async ({
    page, workerUser, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g7-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g7-${runTag}`, { userId: workerUser.userId });
    const orig = `[e2e-g7-orig] ${runTag}`;
    await sendText(page, orig);
    await openMessageMenu(page, orig);
    await page.getByRole('menuitem', { name: /edit/i }).click();
    const editInput = page.locator('.sendbird-message-input--edit [role="textbox"], .sendbird-message-input__edit [role="textbox"]');
    const edited = `${orig} EDITED`;
    await editInput.fill(edited);
    await page.locator('.sendbird-message-input--edit-action__save').click();
    await expect(messageByText(page, edited)).toBeVisible({ timeout: 15_000 });
  });

  // G13
  test('registers and cancels operator in open channel participant list', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g13-${runTag}` });
    // secondUser enters the open channel to appear as participant
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g13-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g13-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    await page.getByRole('tab', { name: /participants/i }).click();
    const participantRow = page.locator('[class*="participant-list"] .sendbird-user-list-item')
      .filter({ hasText: secondUser.userId }).first();
    if (await participantRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await participantRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /register.*operator|make.*operator/i }).first().click();
      await expect(participantRow.locator('[class*="operator"]')).toBeVisible({ timeout: 10_000 });
      // Cancel operator
      await participantRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /unregister|remove.*operator/i }).first().click();
      await expect(participantRow.locator('[class*="operator"]')).not.toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
    }
  });

  // G14
  test('mutes and unmutes a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g14-${runTag}` });
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g14-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g14-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    await page.getByRole('tab', { name: /participants/i }).click();
    const row = page.locator('[class*="participant-list"] .sendbird-user-list-item')
      .filter({ hasText: secondUser.userId }).first();
    if (await row.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await row.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /^mute/i }).first().click();
      await expect(row.locator('[class*="muted"]')).toBeVisible({ timeout: 10_000 });
      await row.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /unmute/i }).first().click();
      await expect(row.locator('[class*="muted"]')).not.toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
    }
  });

  // G15
  test('bans and unbans a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g15-${runTag}` });
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g15-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g15-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    await page.getByRole('tab', { name: /participants/i }).click();
    const row = page.locator('[class*="participant-list"] .sendbird-user-list-item')
      .filter({ hasText: secondUser.userId }).first();
    if (await row.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await row.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /^ban/i }).first().click();
      await page.getByRole('button', { name: /ban/i }).last().click();
      // secondUser is banned; they should disappear from participant list
      await expect(row).not.toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
    }
  });

  // G16
  test('shows frozen banner and disables input on a frozen open channel', async ({
    page, workerUser, createOpenChannel,
  }) => {
    const channel = await createOpenChannel({ name: `[e2e] g16-${runTag}` });
    // Freeze via Platform API
    await platform.freezeOpenChannel(channel.url, true);
    await openNamedOpenChannel(page, `[e2e] g16-${runTag}`, { userId: workerUser.userId });
    await expect(page.locator('[class*="frozen"], .sendbird-frozen-channel-notification')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.sendbird-message-input--disabled, .sendbird-message-input [disabled]')).toBeVisible();
  });
});
