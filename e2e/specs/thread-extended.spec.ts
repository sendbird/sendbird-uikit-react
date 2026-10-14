import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { messageByText, openFirstGroupChannel } from '../utils/actions';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

const REPLY_COUNT = 60;

const threadPanel = (page: Page) => page.locator('.sendbird-thread-ui');
const threadScroll = (page: Page) => page.locator('.sendbird-thread-ui--scroll');
const threadReply = (page: Page, text: string) => threadPanel(page).getByText(text, { exact: true });
const replyBodies = (page: Page) => threadPanel(page).locator('.sendbird-thread-list-item .sendbird-text-message-item-body');
const replyTexts = (prefix: string) => Array.from({ length: REPLY_COUNT }, (_, i) => `${prefix} reply ${i + 1}`);

async function seedThread(channelUrl: string, senderId: string, prefix: string, firstReplyToChannel = false) {
  const parentId = await platform.sendMessage(channelUrl, senderId, `${prefix} parent`);
  for (let i = 1; i <= REPLY_COUNT; i++) {
    await platform.replyToMessage(channelUrl, parentId, senderId, `${prefix} reply ${i}`, firstReplyToChannel && i === 1);
  }
}

async function scrollThreadUntilVisible(page: Page, edge: 'top' | 'bottom', text: string) {
  await expect(async () => {
    await threadScroll(page).evaluate((el, toTop) => {
      el.scrollTop = toTop ? 0 : el.scrollHeight;
    }, edge === 'top');
    await expect(threadReply(page, text)).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
}

test.describe('thread — extended', () => {
  // F5
  test('loads every earlier reply once when a long thread is scrolled up', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    await seedThread(channel.url, secondUser.userId, '[thread-up]');

    await openFirstGroupChannel(page, { userId: workerUser.userId, replyType: 'THREAD' });
    await page.locator('.sendbird-ui-thread-replies').first().click({ timeout: 15_000 });
    await expect(threadReply(page, `[thread-up] reply ${REPLY_COUNT}`)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(threadReply(page, '[thread-up] reply 1')).toHaveCount(0);

    await threadScroll(page).evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect(threadReply(page, `[thread-up] reply ${REPLY_COUNT}`)).toBeInViewport();
    await scrollThreadUntilVisible(page, 'top', '[thread-up] reply 1');
    await expect(replyBodies(page)).toHaveText(replyTexts('[thread-up]'));
  });

  test('loads every later reply once when a thread opened from its first reply is scrolled down', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null, memberIds: [secondUser.userId] });
    await seedThread(channel.url, secondUser.userId, '[thread-down]', true);

    await openFirstGroupChannel(page, {
      userId: workerUser.userId,
      replyType: 'THREAD',
      groupChannel_threadReplySelectType: 'thread',
    });
    await messageByText(page, '[thread-down] reply 1').locator('.sendbird-quote-message').click({ timeout: 15_000 });
    await expect(threadReply(page, '[thread-down] reply 1')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(threadReply(page, `[thread-down] reply ${REPLY_COUNT}`)).toHaveCount(0);

    await scrollThreadUntilVisible(page, 'bottom', `[thread-down] reply ${REPLY_COUNT}`);
    await expect(replyBodies(page)).toHaveText(replyTexts('[thread-down]'));
  });
});
