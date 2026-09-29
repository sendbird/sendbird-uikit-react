import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { attachFiles, createOpenChannelViaUI, openNamedOpenChannel, openOperatorParticipants, openParticipantRow, refreshParticipants, sendText, openMessageMenu } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';
import { OPEN_CHANNEL_PARTICIPANT_LIST_STALE, SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('open channel — extended', () => {
  // G5
  test('renders file bubble after sending a file in open channel', async ({
    page, workerUser, createOpenChannel,
  }) => {
    await createOpenChannel({ name: `[e2e] g5-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g5-${runTag}`, { userId: workerUser.userId });
    await attachFiles(page, [{
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    }]);
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
    await createOpenChannel({ name: `[e2e] g13-seed-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g13-seed-${runTag}`, { userId: workerUser.userId });
    await createOpenChannelViaUI(page, `[e2e] g13-${runTag}`);
    const channel = { url: await platform.findOpenChannelUrl(`[e2e] g13-${runTag}`) };

    // The second user joins so there is somebody to act on.
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g13-${runTag}`).first().click({ timeout: 30_000 });
    await platform.waitForOpenChannelParticipant(channel.url, secondUser.userId);
    await openOperatorParticipants(page);
    const participantRow = page.locator('.sendbird-participants-accordion__member')
      .filter({ hasText: secondUser.userId }).first();
    await expect(participantRow).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await participantRow.hover();
    await expect(participantRow.locator('.sendbird-openchannel-participant-list__menu')).toBeVisible({ timeout: 10_000 });
    await participantRow.locator('.sendbird-openchannel-participant-list__menu').click();
    await page.getByRole('menuitem', { name: /register as operator/i }).first().click();
    await expect(participantRow.locator('.sendbird-participants-accordion__member__title.operator')).toBeVisible({ timeout: 10_000 });
    // Cancel operator
    await participantRow.hover();
    await expect(participantRow.locator('.sendbird-openchannel-participant-list__menu')).toBeVisible({ timeout: 10_000 });
    await participantRow.locator('.sendbird-openchannel-participant-list__menu').click();
    await page.getByRole('menuitem', { name: /unregister operator/i }).first().click();
    await expect(participantRow.locator('.sendbird-participants-accordion__member__title.operator')).not.toBeVisible({ timeout: 10_000 });
  });

  // G14
  test('mutes and unmutes a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    test.skip(true, OPEN_CHANNEL_PARTICIPANT_LIST_STALE);
    await createOpenChannel({ name: `[e2e] g14-seed-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g14-seed-${runTag}`, { userId: workerUser.userId });
    await createOpenChannelViaUI(page, `[e2e] g14-${runTag}`);
    const channel = { url: await platform.findOpenChannelUrl(`[e2e] g14-${runTag}`) };

    // The second user joins so there is somebody to act on.
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g14-${runTag}`).first().click({ timeout: 30_000 });
    await platform.waitForOpenChannelParticipant(channel.url, secondUser.userId);
    const row = await openParticipantRow(page, secondUser.userId);
    await row.hover();
    await expect(row.locator('.sendbird-openchannel-participant-list__menu')).toBeVisible({ timeout: 10_000 });
    await row.locator('.sendbird-openchannel-participant-list__menu').click();
    await page.getByRole('menuitem', { name: /^mute/i }).first().click();
    await platform.waitForOpenChannelMuted(channel.url, secondUser.userId);

    // Muted avatar overlay appears on the participant's avatar once the list is read again.
    const mutedRow = await openParticipantRow(page, secondUser.userId);
    await expect(mutedRow.locator('.sendbird-muted-avatar')).toBeVisible({ timeout: 10_000 });
    await mutedRow.hover();
    await expect(mutedRow.locator('.sendbird-openchannel-participant-list__menu')).toBeVisible({ timeout: 10_000 });
    await mutedRow.locator('.sendbird-openchannel-participant-list__menu').click();
    await page.getByRole('menuitem', { name: /unmute/i }).first().click();
    await platform.waitForOpenChannelMuted(channel.url, secondUser.userId, false);

    const unmutedRow = await openParticipantRow(page, secondUser.userId);
    await expect(unmutedRow.locator('.sendbird-muted-avatar')).toHaveCount(0, { timeout: 10_000 });
  });

  // G15
  test('bans and unbans a participant in open channel', async ({
    page, workerUser, secondUser, secondPage, createOpenChannel,
  }) => {
    test.skip(true, OPEN_CHANNEL_PARTICIPANT_LIST_STALE);
    await createOpenChannel({ name: `[e2e] g15-seed-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g15-seed-${runTag}`, { userId: workerUser.userId });
    await createOpenChannelViaUI(page, `[e2e] g15-${runTag}`);
    const channel = { url: await platform.findOpenChannelUrl(`[e2e] g15-${runTag}`) };

    // The second user joins so there is somebody to act on.
    await secondPage.goto(appPath('/open_channel', { userId: secondUser.userId }));
    await secondPage.getByText(`[e2e] g15-${runTag}`).first().click({ timeout: 30_000 });
    await platform.waitForOpenChannelParticipant(channel.url, secondUser.userId);
    const row = await openParticipantRow(page, secondUser.userId);
    await row.hover();
    await expect(row.locator('.sendbird-openchannel-participant-list__menu')).toBeVisible({ timeout: 10_000 });
    await row.locator('.sendbird-openchannel-participant-list__menu').click();
    // Banning takes effect straight from the menu; there is no confirmation step to click.
    await page.getByRole('menuitem', { name: /^ban/i }).first().click();
    await platform.waitForOpenChannelBanned(channel.url, secondUser.userId);

    // The list is read again, and the banned participant is gone from it.
    await refreshParticipants(page);
    await expect(
      page.locator('.sendbird-participants-accordion__member').filter({ hasText: secondUser.userId }),
    ).toHaveCount(0, { timeout: SERVER_RESPONSE_TIMEOUT });
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
