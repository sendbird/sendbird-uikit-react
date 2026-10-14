import { test, expect } from '../fixtures';
import { openFirstGroupChannel, sendText, messageByText } from '../utils/actions';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

/**
 * Group channel — reactions (Tier 0, single user). Drives the app with enableReactions=true, then
 * reacts to an own message. Requires reactions to be enabled on the test App ID.
 */
test.describe('group channel — reactions', () => {
  test('adds an emoji reaction to a message', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableReactions: 'true' });
    const text = `[e2e-react] ${Date.now()}`;
    await sendText(page, text);

    const msg = messageByText(page, text);
    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();

    // Pick the first emoji from the picker (rendered in a dropdown/portal).
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();

    // A reaction badge appears on the message.
    await expect(msg.locator('.sendbird-emoji-reactions__reaction-badge')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  test('removes an emoji reaction from a message', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableReactions: 'true' });
    const text = `[e2e-unreact] ${Date.now()}`;
    await sendText(page, text);

    const msg = messageByText(page, text);
    const badge = msg.locator('.sendbird-emoji-reactions__reaction-badge');

    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();
    await expect(badge).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await msg.hover();
    await msg.locator('.sendbird-message-item-reaction-menu__trigger').click();
    await page.locator('[data-testid^="ui_emoji_reactions_menu_"]').first().click();
    await expect(badge).toBeHidden({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  test('shows no stray text among the actions of the mobile message sheet (CLNP-7430)', async ({ page, workerUser, createChannel }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId, breakpoint: 'true', groupChannel_enableReactions: 'true' });
    const bubble = messageByText(page, '[e2e] channel ready').locator('.sendbird-message-content__middle__body-container');
    await expect(bubble).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    await bubble.hover();
    await page.mouse.down();
    await page.waitForTimeout(1_000);
    await page.mouse.up();
    const actions = page.locator('.sendbird-message__bottomsheet--actions');
    await expect(actions).toBeVisible();
    const strayText = await actions.evaluate((el) => Array.from(el.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent?.trim())
      .filter(Boolean));
    expect(strayText).toEqual([]);
  });
});
