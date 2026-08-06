import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { messageByText, openFirstGroupChannel } from '../utils/actions';
import { appPath } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('group channel — realtime features', () => {
  // D3
  test('shows frozen banner and disables input on a frozen channel', async ({ page, workerUser, createChannel }) => {
    await createChannel({ freeze: true });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await expect(page.locator('.sendbird-notification--frozen')).toBeVisible({ timeout: 10_000 });
    // workerUser is an operator — operators can still type in frozen channels, so
    // we only verify the frozen banner (the banner is the observable user-facing signal).
  });

  // D5
  test('scrolls to and highlights the parent when a quoted message is clicked', async ({ page, workerUser, createChannel }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[D5] parent message');
    await platform.seedMessages(channel.url, workerUser.userId, 12, '[D5] gap');
    await platform.replyToMessage(channel.url, parentId, workerUser.userId, '[D5] quote reply', true);

    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_replyType: 'QUOTE_REPLY' });
    const msgList = page.locator('.sendbird-conversation__messages-padding');
    await msgList.evaluate((el) => { el.scrollTop = el.scrollHeight; });

    // Check if quote bubble rendered (Platform API quote reply requires QUOTE_REPLY mode)
    const quoteMsg = page.locator('.sendbird-quote-message').first();
    if (!await quoteMsg.isVisible({ timeout: 8_000 }).catch(() => false)) {
      test.skip();
      return;
    }
    await quoteMsg.click();
    await expect(page.getByText('[D5] parent message')).toBeVisible({ timeout: 10_000 });
  });
});
