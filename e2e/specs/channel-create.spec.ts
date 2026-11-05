import type { Locator } from '@playwright/test';
import { test, expect } from '../fixtures';
import { messageByText, startGroupChannelCreation } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import * as platform from '../utils/platform';

const left = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().left);
const right = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().right);

/**
 * Group channel — create (Tier 0). Creates a group channel and invites a per-run throwaway user
 * (secondUser), so the invite list has a known member to select.
 */
test.describe('group channel — create', () => {
  test('creates a group channel with an invited member', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel();
    await startGroupChannelCreation(page, workerUser.userId);

    // The application user-list query returns the most recently created users first, and secondUser
    // is created fresh in this worker's setup, so it is on the first page (no scrolling needed).
    const invitee = page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId });
    await expect(invitee).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await invitee.locator('.sendbird-user-list-item__checkbox').click();
    await page.getByRole('button', { name: 'Create' }).click();

    // The new channel opens and its header shows the invited member.
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(page.locator('.sendbird-chat-header')).toContainText(secondUser.userId, { timeout: 10_000 });
  });

  test('keeps the timestamp beside the first message received in a new channel (CLNP-5549)', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    await createChannel();
    await startGroupChannelCreation(page, workerUser.userId);
    const invitee = page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId });
    await expect(invitee).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await invitee.locator('.sendbird-user-list-item__checkbox').click();
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.locator('.sendbird-conversation__no-messages')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    const channelUrl = await platform.findGroupChannelUrlWithMember(workerUser.userId, secondUser.userId);
    const text = `[e2e-first] ${Date.now()}`;
    await platform.sendMessage(channelUrl, secondUser.userId, text);

    const message = messageByText(page, text);
    await expect(message).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    const timestamp = message.locator('.sendbird-message-content__middle__body-container__created-at');
    expect(await left(timestamp)).toBeGreaterThanOrEqual(await right(message.locator('.sendbird-text-message-item-body')));
  });
});
