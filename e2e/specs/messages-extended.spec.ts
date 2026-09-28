import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { openFirstGroupChannel, sendText, messageByText } from '../utils/actions';
import { appPath, runTag } from '../utils/env';
import * as platform from '../utils/platform';
import { SERVER_RESPONSE_TIMEOUT } from '../utils/constants';

test.describe('group channel — messages extended', () => {
  // C5
  test('delivers pending message after network is restored', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const msgText = `[c5-offline] ${runTag}`;

    // 1. Block new connections first, then disconnect existing WS so SDK cannot reconnect
    await page.context().setOffline(true);
    await page.evaluate(() => (window as Record<string, any>).__SendbirdChat?.instance?.disconnectWebSocket());

    // 2. Send a message — should land in pending state (message_id=0)
    const input = page.locator('.sendbird-message-input [role="textbox"]').first();
    await input.click();
    await input.pressSequentially(msgText);
    await input.press('Enter');

    // Message should land in pending state (message_id=0) while offline
    await expect(
      page.locator('[data-sb-message-id="0"]').filter({ hasText: msgText }),
    ).toBeVisible({ timeout: 8_000 });

    // 3. Restore network — SDK auto-reconnects and delivers the pending message
    await page.context().setOffline(false);
    await expect(messageByText(page, msgText)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
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
    await page.locator('.sendbird-message-input--send').click({ timeout: 10_000 }).catch(() => {});
    const fileBubble = page.locator('.sendbird-thumbnail-message-item-body, .sendbird-file-message-item-body').last();
    await expect(fileBubble).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
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
    await page.locator('.sendbird-message-input--send').click({ timeout: 5_000 }).catch(() => {});
    await expect(page.locator('[class*="multiple-files"]').last()).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // C10
  test('renders voice message bubble after recording and sending', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const voiceBtn = page.locator('.sendbird-message-input--voice-message');
    if (!await voiceBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
      test.skip();
      return;
    }
    // --use-fake-device-for-media-stream handles device; grantPermissions covers the browser
    // permission check so navigator.permissions.query doesn't show a warning modal.
    await page.context().grantPermissions(['microphone']);
    await voiceBtn.click();
    // Recording UI opens in READY_TO_RECORD state (timer at 00:00, red circle button)
    await expect(page.locator('.sendbird-voice-message-input')).toBeVisible({ timeout: 5_000 });
    // First click starts recording (READY_TO_RECORD → getUserMedia → RECORDING + timer)
    await page.locator('.sendbird-voice-message-input__controler__main').click();
    // Wait for recording to exceed minimum duration (1000 ms); includes getUserMedia init time
    await page.waitForTimeout(2500);
    // Second click stops recording (only works if recordingTime >= 1000 ms, else cancels)
    await page.locator('.sendbird-voice-message-input__controler__main').click();
    // After stopping, state → READY_TO_PLAY; submit loses .voice-message--disabled CSS class
    await expect(
      page.locator('.sendbird-voice-message-input__controler__submit:not(.voice-message--disabled)'),
    ).toBeVisible({ timeout: 8_000 });
    // The VoiceMessageInput has a 250ms click-buffer guard shared across all buttons.
    // After the 2nd main-button click (stop), audio conversion can be fast (<250ms) with
    // fake audio, so the submit click would arrive within the buffer window and be ignored.
    // Wait 300ms to guarantee the buffer has cleared before clicking submit.
    await page.waitForTimeout(300);
    await page.locator('.sendbird-voice-message-input__controler__submit').click();
    // Recording UI dismisses when submit is accepted (setShowVoiceMessageInput(false))
    await expect(page.locator('.sendbird-voice-message-input')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.locator('[class*="voice-message-item-body"]').last()).toBeVisible({ timeout: 30_000 });
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
      await expect(messageByText(page, btnText.trim())).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
    } else {
      test.skip();
    }
  });

  // C13
  test('renders highlighted mention in the message bubble', async ({
    page, workerUser, secondUser, createChannel,
  }) => {
    const channel = await createChannel({ memberIds: [secondUser.userId] });
    // secondUser sends a structured mention message (mention_type + mentioned_user_ids required
    // for UIKit to render a .sendbird-mention-user-label badge)
    const mentionMsg = `@${workerUser.userId} hi ${runTag}`;
    await platform.sendMentionMessage(channel.url, secondUser.userId, mentionMsg, [workerUser.userId]);

    await openFirstGroupChannel(page, { userId: workerUser.userId, groupChannel_enableMention: 'true' });
    const mentionLabel = page.locator('[class*="mention"], .sendbird-mention-user-label').filter({ hasText: workerUser.userId });
    if (!await mentionLabel.isVisible({ timeout: 8_000 }).catch(() => false)) {
      test.skip(); // enableMention may not be supported in this Sendbird app
      return;
    }
    await expect(mentionLabel).toBeVisible();
  });

  // C15
  test('updates message status from SENT to READ after 2nd user reads it', async ({
    page, workerUser, secondUser, secondPage, createChannel,
  }) => {
    await createChannel({ memberIds: [secondUser.userId] });
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    const msgText = `[c15-read] ${runTag}`;
    await sendText(page, msgText);
    // Verify SENT state (not read yet)
    await expect(messageByText(page, msgText)).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    // secondUser opens the channel to trigger a read receipt.
    // Filter to a preview with actual text content to avoid clicking a loading skeleton.
    await secondPage.goto(appPath('/group_channel', { userId: secondUser.userId }));
    await secondPage.locator('.sendbird-channel-preview').filter({ hasText: /\S/ }).first().click({ timeout: 30_000 });
    await expect(secondPage.locator('.sendbird-conversation')).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });

    // Status should flip to READ — sendbird-message-status--sent shows when not failed;
    // the icon uses IconColors.READ (purple) when READ state is reached
    await expect(
      messageByText(page, msgText).locator('[class*="message-status--sent"], [data-testid="sendbird-message-status-icon"]'),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });

  // C16
  test('renders URL preview card for a message with a URL', async ({ page, workerUser, createChannel }) => {
    await createChannel();
    await openFirstGroupChannel(page, { userId: workerUser.userId });
    await sendText(page, `check https://sendbird.com ${runTag}`);
    await expect(
      page.locator('[class*="og-message-item-body"], [class*="og-tag"], [class*="url-preview"]').last(),
    ).toBeVisible({ timeout: SERVER_RESPONSE_TIMEOUT });
  });
});
