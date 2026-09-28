import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openNamedOpenChannel, openOperatorParticipants, sendText, openMessageMenu } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';
import { OPEN_CHANNEL_OPERATOR_UI, SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

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
    await page.locator('.sendbird-message-input--send').click({ timeout: 5_000 }).catch(() => {});
    await expect(
      page.locator('.sendbird-openchannel-thumbnail-message, .sendbird-openchannel-file-message').last(),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
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
    const editMenuItem = page.getByRole('menuitem', { name: /edit/i });
    await expect(editMenuItem).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await editMenuItem.click();
    const editInput = page.locator('.sendbird-message-input--edit [role="textbox"], .sendbird-message-input__edit [role="textbox"]');
    const edited = `${orig} EDITED`;
    await editInput.fill(edited);
    await page.locator('.sendbird-message-input--edit-action__save').click();
    await expect(page.getByText(edited).first()).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // G13
  test('registers and cancels operator in open channel participant list', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    test.skip(true, OPEN_CHANNEL_OPERATOR_UI);
    await createOpenChannel({ name: `[e2e] g13-${runTag}` });
    // secondUser enters the open channel to appear as participant
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g13-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g13-${runTag}`, { userId: workerUser.userId });
    await openOperatorParticipants(page);
    const participantRow = page.locator('.sendbird-participants-accordion__member')
      .filter({ hasText: secondUser.userId }).first();
    await expect(participantRow).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await participantRow.hover();
    await participantRow.locator('.sendbird-openchannel-participant-list__menu').click({ timeout: 5_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /register as operator/i }).first().click();
    await expect(participantRow.locator('.sendbird-participants-accordion__member__title.operator')).toBeVisible({ timeout: 10_000 });
    // Cancel operator
    await participantRow.hover();
    await participantRow.locator('.sendbird-openchannel-participant-list__menu').click({ timeout: 5_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /unregister operator/i }).first().click();
    await expect(participantRow.locator('.sendbird-participants-accordion__member__title.operator')).not.toBeVisible({ timeout: 10_000 });
  });

  // G14
  test('mutes and unmutes a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    test.skip(true, OPEN_CHANNEL_OPERATOR_UI);
    await createOpenChannel({ name: `[e2e] g14-${runTag}` });
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g14-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g14-${runTag}`, { userId: workerUser.userId });
    await openOperatorParticipants(page);
    const row = page.locator('.sendbird-participants-accordion__member')
      .filter({ hasText: secondUser.userId }).first();
    await expect(row).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await row.hover();
    await row.locator('.sendbird-openchannel-participant-list__menu').click({ timeout: 5_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /^mute/i }).first().click();
    // Muted avatar overlay (.sendbird-muted-avatar) appears on the participant's avatar
    await expect(row.locator('.sendbird-muted-avatar')).toBeVisible({ timeout: 10_000 });
    await row.hover();
    await row.locator('.sendbird-openchannel-participant-list__menu').click({ timeout: 5_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /unmute/i }).first().click();
    await expect(row.locator('.sendbird-muted-avatar')).not.toBeVisible({ timeout: 10_000 });
  });

  // G15
  test('bans and unbans a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    test.skip(true, OPEN_CHANNEL_OPERATOR_UI);
    await createOpenChannel({ name: `[e2e] g15-${runTag}` });
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g15-${runTag}`).first().click({ timeout: 30_000 });
    await openNamedOpenChannel(page, `[e2e] g15-${runTag}`, { userId: workerUser.userId });
    await openOperatorParticipants(page);
    const row = page.locator('.sendbird-participants-accordion__member')
      .filter({ hasText: secondUser.userId }).first();
    await expect(row).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await row.hover();
    await row.locator('.sendbird-openchannel-participant-list__menu').click({ timeout: 5_000 }).catch(() => {});
    await page.getByRole('menuitem', { name: /^ban/i }).first().click();
    // Ban confirmation dialog
    await page.getByRole('button', { name: /ban/i }).last().evaluate((el) => (el as HTMLButtonElement).click());
    // secondUser is banned; they should disappear from participant list
    await expect(row).not.toBeVisible({ timeout: 10_000 });
  });

  // G16
  test('shows frozen banner and disables input on a frozen open channel', async ({
    page, workerUser, createOpenChannel,
  }) => {
    const channel = await createOpenChannel({ name: `[e2e] g16-${runTag}` });
    // Freeze via Platform API
    await platform.freezeOpenChannel(channel.url, true);
    await openNamedOpenChannel(page, `[e2e] g16-${runTag}`, { userId: workerUser.userId });
    // Use specific class only — [class*="frozen"] is too broad and matches channel-name elements too
    await expect(page.locator('.sendbird-frozen-channel-notification')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.sendbird-message-input--disabled, .sendbird-message-input [disabled]')).toBeVisible();
  });
});
