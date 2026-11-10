import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { appPath } from '../utils/env';
import { messageByText, openFirstGroupChannel, sendText } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

function countOpenChatSockets(page: Page): () => number {
  const open = new Set<object>();
  page.on('websocket', (socket) => {
    if (!socket.url().includes('sendbird.com')) return;
    open.add(socket);
    socket.on('close', () => open.delete(socket));
  });
  return () => open.size;
}

async function remountThroughOpenChannelPage(page: Page) {
  const query = await page.evaluate(() => window.location.search);
  await page.evaluate((search) => {
    window.history.pushState(null, '', `/open_channel${search}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, query);
  await expect(page.locator('.sendbird-openchannel-app')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  await page.goBack();
  await expect(page.locator('.sendbird-channel-preview').first()).toBeVisible({ timeout: 30_000 });
}

test.describe('group channel — provider remounted by navigation', () => {
  test('keeps one connection and delivers both ways after the provider remounts (CLNP-8809)', async ({
    page, secondPage, workerUser, secondUser, createChannel,
  }) => {
    const openChatSockets = countOpenChatSockets(page);
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await remountThroughOpenChannelPage(page);
    await remountThroughOpenChannelPage(page);
    await page.locator('.sendbird-channel-preview').first().click();
    await expect(page.locator('.sendbird-conversation')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect.poll(openChatSockets, { timeout: SERVER_RESPONSE_TIMEOUT }).toBe(1);

    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await secondPage.locator('.sendbird-channel-preview').filter({ hasText: /\S/ }).first().click({ timeout: 30_000 });
    await expect(secondPage.locator('.sendbird-conversation')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    const sent = `[remount-sent] ${Date.now()}`;
    await sendText(page, sent);
    await expect(messageByText(secondPage, sent)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    const received = `[remount-received] ${Date.now()}`;
    await sendText(secondPage, received);
    await expect(messageByText(page, received)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
