import type { Locator } from '@playwright/test';
import { test, expect } from '../fixtures';
import { startGroupChannelCreation } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

const left = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().left);

test.describe('group channel — create, with scrollbars that take up space', () => {
  test('keeps the invite list in place when a member is selected (CLNP-7040)', async ({ page, workerUser, secondUser, createChannel }) => {
    await createChannel();
    await startGroupChannelCreation(page, workerUser.userId);
    await page.addStyleTag({ content: '::-webkit-scrollbar { width: 15px; height: 15px; }' });

    const member = page.locator('.sendbird-user-list-item').filter({ hasText: secondUser.userId });
    const avatar = member.locator('.sendbird-user-list-item__avatar');
    await expect(avatar).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    const before = await left(avatar);
    await member.locator('.sendbird-user-list-item__checkbox').click();
    await expect(member.locator('input[type="checkbox"]')).toBeChecked();
    expect(await left(avatar)).toBe(before);
  });
});
