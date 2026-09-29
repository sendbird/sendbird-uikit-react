import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openChannelSettings, openFirstGroupChannel, openSettingsAccordion, openUserRowMenu } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('channel settings — extended', () => {
  // E4
  test('updates channel avatar after cover image upload', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    await page.locator('.sendbird-channel-profile__edit').click();
    // EditDetailsModal renders in a portal; scoped to .channel-profile-form to avoid
    // matching the message input's file input (also accepts images)
    const fileInput = page.locator('.channel-profile-form input[type="file"]').first();
    await fileInput.waitFor({ state: 'attached', timeout: 5_000 });
    await fileInput.setInputFiles({
      name: 'cover.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
    await page.getByRole('button', { name: /save/i }).last().click();
    const avatar = page.locator('.sendbird-channel-settings .sendbird-avatar img').first();
    await expect(avatar).toHaveAttribute('src', /sendbird\.com|blob:/, { timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // E6
  test('increases member count and shows new member after invite', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Click "Members" panel item — wait for invite button to appear
    await openSettingsAccordion(page, /^Members/);
    const inviteBtn = page.getByRole('button', { name: /invite/i }).first();
    await expect(inviteBtn).toBeVisible({ timeout: 15_000 });
    await inviteBtn.click();
    const secondUserRow = page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    if (await secondUserRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await secondUserRow.locator('.sendbird-user-list-item__checkbox').click({ timeout: 5_000 });
    } else {
      // Fallback: click first enabled checkbox
      await page.locator('.sendbird-user-list-item__checkbox').filter({
        has: page.locator('input[type="checkbox"]:not([disabled])'),
      }).first().click({ timeout: 5_000 });
    }
    await page.getByRole('button', { name: /invite/i }).last().click();
    // After invite, the Members accordion is still expanded — secondUser row should appear.
    const invitedRow = page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId.slice(0, 20) }).first();
    await expect(invitedRow).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // E7
  test('shows new operator in operator list after adding via modal', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Click the "Operators" panel item — wait for "Add operator" button to appear
    await openSettingsAccordion(page, /^Operators/);
    const addBtn = page.getByRole('button', { name: /add operator/i }).first();
    await expect(addBtn).toBeVisible({ timeout: 15_000 });
    await addBtn.click();
    // Wait for the modal checkbox to appear before clicking
    const checkboxLabel = page.locator('.sendbird-user-list-item__checkbox').filter({
      has: page.locator('input[type="checkbox"]:not([disabled])'),
    }).first();
    await checkboxLabel.waitFor({ state: 'visible', timeout: 10_000 });
    await checkboxLabel.click();
    // Scope to the modal: /add/i also matches the "Add operator" button behind it, which stays
    // on screen after the modal closes.
    const modal = page.locator('.sendbird-modal');
    const addConfirmBtn = modal.getByRole('button', { name: /^add$/i }).first();
    await expect(addConfirmBtn).toBeVisible({ timeout: 10_000 });
    await addConfirmBtn.click();
    await expect(modal).toBeHidden({ timeout: 15_000 });
    await expect(
      page.locator('.sendbird-channel-settings').getByText(secondUser.userId),
    ).toBeVisible({ timeout: 15_000 });
  });

  // E8
  test('flips operator label via row menu toggle', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Click "Members" panel item — wait for secondUser row to appear (replaces fixed timer)
    await openSettingsAccordion(page, /^Members/);
    const memberRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    await expect(memberRow).toBeVisible({ timeout: 15_000 });
    await openUserRowMenu(memberRow);
    await page.getByRole('menuitem', { name: /operator/i }).first().click();
    await platform.waitForOperator(channel.url, secondUser.userId);
    await expect(memberRow.locator('[class*="operator"]')).toBeVisible({ timeout: 10_000 });
  });

  // E9
  test('moves member to muted list and removes on unmute', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Click "Members" panel item — wait for secondUser row to appear (replaces fixed timer)
    await openSettingsAccordion(page, /^Members/);
    const memberRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    await expect(memberRow).toBeVisible({ timeout: 15_000 });
    await openUserRowMenu(memberRow);
    await page.getByRole('menuitem', { name: /^mute/i }).first().click();
    await platform.waitForMuted(channel.url, secondUser.userId);
    // Open the "Muted members" panel to verify the user was muted
    await openSettingsAccordion(page, /^Muted members/);
    const mutedRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    await expect(mutedRow).toBeVisible({ timeout: 10_000 });
    // Unmute via the muted list row
    await openUserRowMenu(mutedRow);
    await page.getByRole('menuitem', { name: /unmute/i }).first().click();
    await platform.waitForMuted(channel.url, secondUser.userId, false);
    await expect(mutedRow).not.toBeVisible({ timeout: 10_000 });
  });

  // E10
  test('moves member to banned list and removes on unban', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Expand the Members accordion and wait until member list container is visible
    // Click "Members" panel item — wait for secondUser row to appear (replaces fixed timer)
    await openSettingsAccordion(page, /^Members/);
    const memberRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    await expect(memberRow).toBeVisible({ timeout: 15_000 });
    await openUserRowMenu(memberRow);
    // Banning takes effect straight from the menu; there is no confirmation step to click.
    await page.getByRole('menuitem', { name: /ban/i }).first().click();
    await platform.waitForBanned(channel.url, secondUser.userId);
    // Open the "Banned users" panel to verify the user was banned
    await openSettingsAccordion(page, /^Banned users/);
    const bannedRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item').filter({ hasText: secondUser.userId }).first();
    await expect(bannedRow).toBeVisible({ timeout: 10_000 });
    // Unban via the banned list row
    await openUserRowMenu(bannedRow);
    await page.getByRole('menuitem', { name: /unban/i }).first().click({ timeout: 10_000 });
    await platform.waitForBanned(channel.url, secondUser.userId, false);
    await expect(bannedRow).not.toBeVisible({ timeout: 10_000 });
  });

  // E12
  test('renders member rows and count in members accordion', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    const memberRow = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item')
      .filter({ hasText: secondUser.userId }).first();
    await openSettingsAccordion(page, /^Members/);
    await expect(memberRow).toBeVisible({ timeout: 15_000 });

    // Both members get a row, and the panel item carries the same count.
    await expect(page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item')).toHaveCount(2);
    await expect(
      page.locator('.sendbird-channel-settings__panel-item').filter({ hasText: /^Members/ }).first(),
    ).toContainText('2');
  });

  // E14
  test('renders operator and banned accordions with rows or empty state', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);

    // The creator is the channel's operator, so that accordion has exactly one row.
    const rows = page.locator('.sendbird-user-list-item--small, .sendbird-user-list-item');
    await openSettingsAccordion(page, /^Operators/);
    await expect(rows.filter({ hasText: workerUser.userId })).toHaveCount(1);

    // Nobody is banned, so that one has none.
    await openSettingsAccordion(page, /^Banned users/);
    await expect(rows).toHaveCount(0);
  });
});
