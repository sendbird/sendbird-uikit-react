import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { appPath, runTag } from '../utils/env';
import { openNamedOpenChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';
import * as platform from '../utils/platform';

test.describe('open channel — core scenarios', () => {
  // G3
  test('loads message history when entering an open channel', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g3-${runTag}` });
    await platform.seedOpenChannelMessages(channel.url, workerUser.userId, 3, '[G3]');
    await openNamedOpenChannel(page, `[e2e] g3-${runTag}`, { userId: workerUser.userId });
    await expect(page.getByText('[G3] 1')).toBeVisible({ timeout: 15_000 });
  });

  // G4
  test('displays a sent user message in the open channel', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g4-${runTag}` });
    await openNamedOpenChannel(page, channel.url ? `[e2e] g4-${runTag}` : '', { userId: workerUser.userId });
    await sendText(page, `[e2e-g4] ${runTag}`);
    await expect(messageByText(page, `[e2e-g4] ${runTag}`)).toBeVisible({ timeout: 15_000 });
  });

  // G6
  test('removes own message from open channel after deletion', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g6-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g6-${runTag}`, { userId: workerUser.userId });
    const msgText = `[e2e-g6-del] ${runTag}`;
    await sendText(page, msgText);
    await openMessageMenu(page, msgText);
    await page.getByRole('menuitem', { name: /delete/i }).click();
    await page.getByRole('button', { name: /delete/i }).last().click();
    await expect(messageByText(page, msgText)).toHaveCount(0, { timeout: 10_000 });
  });

  // G8
  test('auto-enters the newly created open channel after creation', async ({ page, workerUser }) => {
    const newName = `[e2e] g8-${runTag}`;
    await page.goto(appPath('/open_channel', { userId: workerUser.userId }));
    // Click the create / + button in the open channel list header
    await page.locator('.sendbird-openchannel-list .sendbird-openchannel-list__header button').first().click({ timeout: 15_000 });
    const nameInput = page.locator('input[name="channel-profile-form__name"], .sendbird-create-open-channel-ui__profile input').first();
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /create/i }).last().click();
    await expect(page.locator('.sendbird-openchannel-conversation-header')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(newName)).toBeVisible();
  });

  // G9
  test('exits previous open channel when switching to another', async ({ page, workerUser, createOpenChannel }) => {
    const chA = await createOpenChannel({ name: `[e2e] g9a-${runTag}` });
    const chB = await createOpenChannel({ name: `[e2e] g9b-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g9a-${runTag}`, { userId: workerUser.userId });
    // Switch to channel B
    await page.getByText(`[e2e] g9b-${runTag}`).first().click();
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(`[e2e] g9b-${runTag}`))
      .toBeVisible({ timeout: 15_000 });
    // Ensure we're no longer viewing channel A
    await expect(page.locator('.sendbird-openchannel-conversation-header').getByText(`[e2e] g9a-${runTag}`))
      .not.toBeVisible();
    void chA; void chB;
  });

  // G10
  test('updates the header name after editing channel name (operator)', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g10-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g10-${runTag}`, { userId: workerUser.userId });
    // Open open-channel settings
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    await expect(page.locator('.sendbird-openchannel-settings')).toBeVisible({ timeout: 10_000 });
    await page.locator('.sendbird-openchannel-settings__profile-edit').click();
    const newName = `[e2e] g10-renamed-${runTag}`;
    const nameInput = page.locator('input[name="channel-profile-form__name"]');
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /save/i }).last().click();
    await expect(
      page.locator('.sendbird-openchannel-settings .sendbird-channel-profile__title').filter({ hasText: newName }),
    ).toBeVisible({ timeout: 15_000 });
    void channel;
  });

  // G11
  test('removes channel from list after deletion (operator)', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g11-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g11-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    await expect(page.locator('.sendbird-openchannel-settings')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: /delete channel/i }).click();
    await page.getByRole('button', { name: /delete/i }).last().click();
    await expect(page.getByText(`[e2e] g11-${runTag}`)).not.toBeVisible({ timeout: 10_000 });
    void channel;
  });

  // G12
  test('loads participant list in open channel settings', async ({ page, workerUser, createOpenChannel }) => {
    const channel = await createOpenChannel({ name: `[e2e] g12-${runTag}` });
    await openNamedOpenChannel(page, `[e2e] g12-${runTag}`, { userId: workerUser.userId });
    await page.locator('.sendbird-openchannel-conversation-header__right__settings').click();
    // Switch to Participants tab
    await page.getByRole('tab', { name: /participants/i }).click();
    await expect(page.locator('.sendbird-openchannel-settings-participant__list .sendbird-user-list-item').first())
      .toBeVisible({ timeout: 15_000 });
    void channel;
  });
});
