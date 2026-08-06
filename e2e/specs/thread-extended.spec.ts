import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openThread } from '../utils/actions';
import * as platform from '../utils/platform';

test.describe('thread — extended', () => {
  // F5
  test('paginates older replies when thread panel is scrolled to the top', async ({
    page, workerUser, createChannel,
  }) => {
    const channel = await createChannel({ seedMessage: null });
    const parentId = await platform.sendMessage(channel.url, workerUser.userId, '[F5] parent');
    // Seed 25 replies to trigger pagination
    for (let i = 1; i <= 25; i++) {
      await platform.replyToMessage(channel.url, parentId, workerUser.userId, `[F5] reply ${i}`);
    }
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await openThread(page, '[F5] parent');
    const threadList = page.locator('.sendbird-thread-ui--scroll');
    // Scroll to top
    await threadList.evaluate((el) => { el.scrollTop = 0; });
    // Older replies should load
    await expect(page.getByText('[F5] reply 1')).toBeVisible({ timeout: 20_000 });
  });

  // F10
  test('shows "search in channel" prompt after clearing the search box', async ({
    page, workerUser, createChannel,
  }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await page.locator('.sendbird-chat-header__right__search').click();
    await expect(page.locator('.sendbird-message-search')).toBeVisible({ timeout: 10_000 });
    const input = page.locator('.sendbird-message-search-pannel__input__container input');
    await input.fill('hello');
    await input.fill('');
    await expect(
      page.locator('.sendbird-message-search-pannel__placeholder').filter({ hasText: /search in/i }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
