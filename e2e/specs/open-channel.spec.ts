import { test, expect } from '../fixtures';
import { appPath, runTag } from '../utils/env';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

/**
 * Open channel — navigation (Tier 0, single user). Loads /open_channel, which renders the open
 * channel list beside the conversation, then enters this run's own channel (found by its unique name).
 */
test.describe('open channel — navigation', () => {
  // Open channels share one global list, so each case works on THIS run's channel, found by its
  // unique name rather than by position.
  const uniqueName = (tag: string) => `[e2e] open ${tag} ${runTag} ${Date.now()}`;

  // G1
  test('renders open channel previews in the list', async ({ page, workerUser, createOpenChannel }) => {
    const name = uniqueName('g1');
    await createOpenChannel({ name });
    await page.goto(appPath('/open_channel', { userId: workerUser.userId }));

    await expect(
      page.locator('.sendbird-open-channel-preview').filter({ hasText: name }).first(),
    ).toBeVisible({ timeout: 30_000 });
  });

  // G2
  test('renders the conversation after entering an open channel', async ({ page, workerUser, createOpenChannel }) => {
    const name = uniqueName('g2');
    await createOpenChannel({ name });
    await page.goto(appPath('/open_channel', { userId: workerUser.userId }));

    await page.locator('.sendbird-open-channel-preview').filter({ hasText: name }).first().click({ timeout: 30_000 });

    // Both halves of the conversation: the header names the channel, and the composer is there to
    // send into it.
    const header = page.locator('.sendbird-openchannel-conversation-header');
    await expect(header).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    await expect(header).toContainText(name);
    await expect(page.locator('.sendbird-message-input [role="textbox"]').first())
      .toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
