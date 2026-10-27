import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures';
import { openFirstGroupChannel, openThread } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';
import * as platform from '../utils/platform';

const messageById = (page: Page, messageId: number) => page.locator(`[data-testid="sendbird-message-view"][data-sb-message-id="${messageId}"]`);
const messageList = (page: Page) => page.locator('.sendbird-conversation__messages-padding');

async function scrollUntilLoaded(page: Page, messageId: number) {
  await expect(async () => {
    await messageList(page).evaluate((el) => { el.scrollTop = 0; });
    await expect(messageById(page, messageId)).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: SERVER_RESPONSE_TIMEOUT });
}

test.describe('group channel — jump to a message off screen', () => {
  test('scrolls the channel to the thread parent from the thread header (CLNP-7835)', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parent = `[sp-thread] parent ${Date.now()}`;
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, parent);
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[sp-thread] reply');
    await platform.seedMessages(channel.url, workerUser.userId, 40, '[sp-thread] gap');

    await openFirstGroupChannel(page, { userId: workerUser.userId, replyType: 'THREAD' });
    await scrollUntilLoaded(page, parentId);
    await openThread(page, parent);
    await expect(page.locator('.sendbird-thread-ui').getByText(parent)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await messageList(page).evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect(page.locator('.sendbird-conversation__scroll-bottom-button')).toHaveCount(0);
    await expect(messageById(page, parentId)).not.toBeInViewport();

    await page.locator('.sendbird-thread-ui .sendbird-ui-header__middle__subtitle__container').click();
    await expect(messageById(page, parentId)).toBeInViewport({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
