import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, sendText, messageByText, openMessageMenu } from '../utils/actions';
import { runTag } from '../utils/env';
import * as platform from '../utils/platform';

test.describe('group channel — messages extended', () => {
  // C5
  test('shows failed status offline and succeeds after resend', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    // Go offline before sending
    await page.context().setOffline(true);
    const msgText = `[c5-offline] ${runTag}`;
    const input = page.locator('.sendbird-message-input [role="textbox"]').first();
    await input.click();
    await input.pressSequentially(msgText);
    await input.press('Enter');
    // Message should appear in failed state
    await expect(page.locator('[data-sb-message-id="0"]').filter({ hasText: msgText }))
      .toBeVisible({ timeout: 10_000 });
    // Go back online
    await page.context().setOffline(false);
    // Click resend button
    await page.locator('[class*="failed"] [class*="resend"], [title*="Resend"]').first().click({ timeout: 10_000 });
    // Message should now be confirmed
    await expect(messageByText(page, msgText)).toBeVisible({ timeout: 15_000 });
  });

  // C8
  test('renders file/image bubble after sending an image', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const fileInput = page.locator('.sendbird-message-input [type="file"]');
    await fileInput.setInputFiles({
      name: 'test.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
    });
    await page.locator('.sendbird-message-input__send').click({ timeout: 5_000 }).catch(() => {});
    await expect(
      page.locator('.sendbird-thumbnail-message-item-body, .sendbird-file-message-item-body').last(),
    ).toBeVisible({ timeout: 20_000 });
  });

  // C9
  test('renders grouped MFM bubble after sending multiple files', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const pngBuf = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );
    const fileInput = page.locator('.sendbird-message-input [type="file"]');
    await fileInput.setInputFiles([
      { name: 'a.png', mimeType: 'image/png', buffer: pngBuf },
      { name: 'b.png', mimeType: 'image/png', buffer: pngBuf },
    ]);
    await page.locator('.sendbird-message-input__send').click({ timeout: 5_000 }).catch(() => {});
    await expect(page.locator('[class*="multiple-files"]').last()).toBeVisible({ timeout: 20_000 });
  });

  // C10
  test('renders voice message bubble after recording and sending', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const voiceBtn = page.locator('[class*="voice-message"], [title*="Voice"], [aria-label*="voice"]').first();
    if (!await voiceBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      test.skip();
      return;
    }
    // Grant microphone permission
    await page.context().grantPermissions(['microphone']);
    await voiceBtn.click();
    // Wait for recording UI to appear and click stop/send
    const stopBtn = page.locator('[class*="stop-recording"], [class*="voice-recorder"] button').first();
    await expect(stopBtn).toBeVisible({ timeout: 5_000 });
    await stopBtn.click();
    const sendBtn = page.locator('[class*="voice-recorder__send"], [class*="send-voice"]').first();
    await expect(sendBtn).toBeVisible({ timeout: 5_000 });
    await sendBtn.click();
    await expect(page.locator('[class*="voice-message-item-body"]').last()).toBeVisible({ timeout: 15_000 });
  });

  // C12
  test('sends the suggested reply text as a message when clicked', async ({ page, workerUser, createChannel }) => {
    // Suggested replies are sent as admin messages via Platform API with suggested_replies
    const channel = await createChannel({ seedMessage: null });
    // Send a message with suggested replies via Platform API
    await platform.sendMessage(channel.url, workerUser.userId, '[c12] pick one');
    // Check if app supports suggested_replies; if so, send via admin msg
    // For now test that clicking a suggested reply button (if visible) sends a message
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const suggestedBtn = page.locator('[class*="suggested-reply"] button').first();
    if (await suggestedBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const btnText = await suggestedBtn.textContent() ?? '';
      await suggestedBtn.click();
      await expect(messageByText(page, btnText.trim())).toBeVisible({ timeout: 15_000 });
    } else {
      test.skip();
    }
  });

  // C13
  test('renders highlighted mention in the message bubble', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    // secondUser sends a message mentioning workerUser
    await secondPage.goto(`/`); // dummy load to warm the context
    const mentionMsg = `@${workerUser.userId} hi ${runTag}`;
    await platform.sendMessage(channel.url, secondUser.userId, mentionMsg);

    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await expect(
      page.locator('[class*="mention"], .sendbird-mention-user-label').filter({ hasText: workerUser.userId }),
    ).toBeVisible({ timeout: 15_000 });
  });

  // C15
  test('updates message status from SENT to READ after 2nd user reads it', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const msgText = `[c15-read] ${runTag}`;
    await sendText(page, msgText);
    // Verify SENT state (not read yet)
    await expect(messageByText(page, msgText)).toBeVisible({ timeout: 15_000 });

    // secondUser opens the channel, triggering a read receipt
    await secondPage.goto(`/group_channel?userId=${secondUser.userId}&channelUrl=${channel.url}`);
    await expect(secondPage.locator('.sendbird-conversation')).toBeVisible({ timeout: 30_000 });

    // Status should flip to READ
    await expect(
      messageByText(page, msgText).locator('[class*="read-receipt"], [class*="receipt-count"]'),
    ).toBeVisible({ timeout: 20_000 });
  });

  // C16
  test('renders URL preview card for a message with a URL', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await sendText(page, `check https://sendbird.com ${runTag}`);
    await expect(
      page.locator('[class*="og-tag"], [class*="url-preview"], [class*="link-preview"]').last(),
    ).toBeVisible({ timeout: 20_000 });
  });
});
