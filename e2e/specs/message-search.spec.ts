import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, openSearch, searchFor } from '../utils/actions';
import { runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('message search', () => {
  test.beforeEach(async ({ page }) => {
    // Skip all message-search tests if the Sendbird app doesn't support Message Search.
    // This is a paid feature; the dev sandbox may not have it enabled.
    // Tests can be run individually when the app has Message Search enabled.
    test.skip(true, 'Message Search requires a Sendbird app with the feature enabled');
    void page;
  });

  // F6
  test('renders matching results when a keyword is searched', async ({ page, workerUser, createChannel }) => {
    const keyword = `f6-${runTag}`;
    const channel = await createChannel({ seedMessage: null });
    await platform.sendMessage(channel.url, workerUser.userId, `${keyword} hello`);

    await openFirstGroupChannel(page, { userId: workerUser.userId, showSearchIcon: 'true' });
    await openSearch(page);
    await searchFor(page, keyword, 45_000);
    await expect(page.locator('.sendbird-message-search-item').first()).toBeVisible({ timeout: 5_000 });
  });

  // F7
  test('shows no-results placeholder when search term has no matches', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId, showSearchIcon: 'true' });
    await openSearch(page);
    await searchFor(page, 'zzz-no-match-xqjk', 45_000);
    await expect(page.locator('.sendbird-message-search-pannel__placeholder')).toBeVisible({ timeout: 10_000 });
  });

  // F8
  test('scrolls channel to the message and highlights it when a result is clicked', async ({ page, workerUser, createChannel }) => {
    const keyword = `f8-${runTag}`;
    const channel = await createChannel({ seedMessage: null });
    await platform.sendMessage(channel.url, workerUser.userId, `${keyword} target`);
    // Seed gap messages so target is off screen
    await platform.seedMessages(channel.url, workerUser.userId, 20, '[gap]');

    await openFirstGroupChannel(page, { userId: workerUser.userId, showSearchIcon: 'true' });
    await openSearch(page);
    await searchFor(page, keyword, 45_000);
    await page.locator('.sendbird-message-search-item').first().click();
    // The target message should be scrolled into view
    await expect(page.getByText(`${keyword} target`)).toBeVisible({ timeout: 15_000 });
  });

  // F9
  test('loads next page of search results when list is scrolled', async ({ page, workerUser, createChannel }) => {
    const keyword = `f9-${runTag}`;
    const channel = await createChannel({ seedMessage: null });
    // Seed 12 messages with the keyword — enough to exceed one search-result page (10/page)
    // while staying under the per-user rate limit (5/s) that blocks larger batches
    for (let i = 1; i <= 12; i++) {
      await platform.sendMessage(channel.url, workerUser.userId, `${keyword} msg ${i}`);
    }

    await openFirstGroupChannel(page, { userId: workerUser.userId, showSearchIcon: 'true' });
    await openSearch(page);
    await searchFor(page, keyword, 60_000);
    const list = page.locator('.sendbird-message-search-pannel__list');
    await expect(list).toBeVisible({ timeout: 5_000 });
    const initialCount = await page.locator('.sendbird-message-search-item').count();
    // Scroll to the bottom of the results list to trigger pagination
    await list.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    // Wait deterministically for at least one more result to appear
    await expect(page.locator('.sendbird-message-search-item').nth(initialCount)).toBeVisible({ timeout: 10_000 });
    const afterCount = await page.locator('.sendbird-message-search-item').count();
    expect(afterCount).toBeGreaterThan(initialCount);
  });
});
