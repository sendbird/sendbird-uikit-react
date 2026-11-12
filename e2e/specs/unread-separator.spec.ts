import { expect, type Page } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

const newMessagesSeparator = (page: Page) => page.locator('.sendbird-separator').filter({ hasText: /new messages/i });

test.describe('group channel — unread separator in mark-as-unread mode (CLNP-9056)', () => {
  test('marks the channel read on open when every member was marked read before its first message', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId], seedMessage: null });
    await platform.markAsReadForAllMembers(channel.url);
    await platform.sendMessage(channel.url, secondUser.userId, '[e2e] first message');
    await platform.waitForMemberReadState(
      channel.url,
      workerUser.userId,
      (state) => state.userLastRead === 0 && state.unreadMessageCount === 1,
      'read position 0 with one unread message',
    );

    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableMarkAsUnread: 'true' });
    await expect(page.locator('.sendbird-conversation').getByText('[e2e] first message')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(newMessagesSeparator(page)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await platform.waitForMemberReadState(
      channel.url,
      workerUser.userId,
      (state) => state.unreadMessageCount === 0 && state.userLastRead > 0,
      'the channel marked read',
    );
    await expect(page.locator('.sendbird-unread-floating-button')).toHaveCount(0, { timeout: SERVER_RESPONSE_TIMEOUT });
  });

  test('marks the channel read on open when its only unread message is an admin message', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId], seedMessage: null });
    await platform.sendMessage(channel.url, secondUser.userId, '[e2e] read message');
    await platform.markAsRead(channel.url, workerUser.userId);
    await platform.sendAdminMessage(channel.url, '[e2e] admin notice');
    await platform.waitForMemberReadState(
      channel.url,
      workerUser.userId,
      (state) => state.userLastRead > 0 && state.unreadMessageCount === 1,
      'one unread admin message after a read position',
    );

    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableMarkAsUnread: 'true' });
    await expect(page.locator('.sendbird-conversation').getByText('[e2e] admin notice')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(newMessagesSeparator(page)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await platform.waitForMemberReadState(
      channel.url,
      workerUser.userId,
      (state) => state.unreadMessageCount === 0,
      'the channel marked read',
    );
    await expect(page.locator('.sendbird-unread-floating-button')).toHaveCount(0, { timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
