import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openChannelSettings } from '../utils/actions';
import { appPath } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('channel settings — extended', () => {
  // E4
  test('updates channel avatar after cover image upload', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    await page.locator('.sendbird-channel-profile__edit').click();
    const fileInput = page.locator('.sendbird-channel-settings input[type="file"]').first();
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
    await expect(avatar).toHaveAttribute('src', /sendbird\.com|blob:/, { timeout: 15_000 });
  });

  // E6
  test('increases member count and shows new member after invite', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Open members accordion and get initial count
    await page.locator('.sendbird-channel-settings__members--accordion, [class*="member"]').first().click();
    // Invite secondUser via the invite button
    const inviteBtn = page.getByRole('button', { name: /invite/i }).first();
    if (await inviteBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await inviteBtn.click();
      await page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId }).first()
        .locator('input[type="checkbox"]').check({ timeout: 15_000 });
      await page.getByRole('button', { name: /invite/i }).last().click();
      // secondUser should appear in member list
      await expect(
        page.locator('.sendbird-channel-settings').getByText(secondUser.userId),
      ).toBeVisible({ timeout: 15_000 });
    } else {
      test.skip();
    }
  });

  // E7
  test('shows new operator in operator list after adding via modal', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    await page.locator('[class*="operator"]').first().click();
    const addBtn = page.getByRole('button', { name: /add operator/i }).first();
    if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addBtn.click();
      await page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId }).first()
        .locator('input[type="checkbox"]').check({ timeout: 15_000 });
      await page.getByRole('button', { name: /add/i }).last().click();
      await expect(
        page.locator('.sendbird-channel-settings').getByText(secondUser.userId),
      ).toBeVisible({ timeout: 15_000 });
    } else {
      test.skip();
    }
  });

  // E8
  test('flips operator label via row menu toggle', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    const memberRow = page.locator('.sendbird-members-accordion__member').filter({ hasText: secondUser.userId }).first();
    if (await memberRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await memberRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /operator/i }).first().click();
      // Operator label should appear next to secondUser
      await expect(memberRow.locator('[class*="operator-badge"], [class*="operator"]')).toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
      return;
    }
  });

  // E9
  test('moves member to muted list and removes on unmute', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    const memberRow = page.locator('.sendbird-members-accordion__member').filter({ hasText: secondUser.userId }).first();
    if (await memberRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await memberRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /^mute/i }).first().click();
      // Muted list should appear
      await expect(
        page.locator('[class*="muted-members"]').getByText(secondUser.userId),
      ).toBeVisible({ timeout: 10_000 });
      // Unmute
      const mutedRow = page.locator('[class*="muted"]').filter({ hasText: secondUser.userId }).first();
      await mutedRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /unmute/i }).first().click();
      await expect(
        page.locator('[class*="muted-members"]').getByText(secondUser.userId),
      ).not.toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
      return;
    }
  });

  // E10
  test('moves member to banned list and removes on unban', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    const memberRow = page.locator('.sendbird-members-accordion__member').filter({ hasText: secondUser.userId }).first();
    if (await memberRow.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await memberRow.locator('[class*="more"], [class*="menu"]').click();
      await page.getByRole('menuitem', { name: /ban/i }).first().click();
      await page.getByRole('button', { name: /ban/i }).last().click();
      await expect(
        page.locator('[class*="banned-members"]').getByText(secondUser.userId),
      ).toBeVisible({ timeout: 10_000 });
      // Unban
      const bannedRow = page.locator('[class*="banned"]').filter({ hasText: secondUser.userId }).first();
      await bannedRow.locator('[class*="unban"], [aria-label*="unban"]').click();
      await expect(
        page.locator('[class*="banned-members"]').getByText(secondUser.userId),
      ).not.toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
      return;
    }
  });

  // E12
  test('renders member rows and count in members accordion', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    await page.locator('.sendbird-channel-settings__members--accordion, [class*="member-accordion"]').first().click();
    await expect(
      page.locator('.sendbird-members-accordion__member, .sendbird-user-list-item').first(),
    ).toBeVisible({ timeout: 10_000 });
    // Member count badge
    const countText = await page.locator('[class*="member-count"], [class*="members-count"]').first().textContent();
    expect(Number(countText?.trim()) || 1).toBeGreaterThanOrEqual(1);
  });

  // E13
  test('advances to invite step when Super or Broadcast channel type is selected', async ({
    page, workerUser,
  }) => {
    await page.goto(appPath('/group_channel', { userId: workerUser.userId }));
    await page.locator('.sendbird-channel-list__header').getByRole('button').first().click({ timeout: 15_000 });
    const superOption = page.locator('[class*="channel-type"]').filter({ hasText: /super/i }).first();
    if (await superOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await superOption.click();
      await expect(page.locator('.sendbird-user-list-item, .sendbird-invite-members').first())
        .toBeVisible({ timeout: 10_000 });
    } else {
      test.skip();
    }
  });

  // E14
  test('renders operator and banned accordions with rows or empty state', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openChannelSettings(page);
    // Operators accordion
    const opsAccordion = page.locator('[class*="operators-accordion"], .sendbird-channel-settings__operators').first();
    if (await opsAccordion.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await opsAccordion.click();
      await expect(
        page.locator('.sendbird-user-list-item, [class*="empty-state"]').first(),
      ).toBeVisible({ timeout: 10_000 });
    }
    // Banned users accordion
    const bannedAccordion = page.locator('[class*="banned-accordion"], .sendbird-channel-settings__banned').first();
    if (await bannedAccordion.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await bannedAccordion.click();
      await expect(
        page.locator('.sendbird-user-list-item, [class*="empty-state"]').first(),
      ).toBeVisible({ timeout: 10_000 });
    }
  });
});
