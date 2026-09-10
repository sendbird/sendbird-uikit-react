import { describe, it, expect } from 'vitest';

import { getMessagePartsInfo } from '../getMessagePartsInfo';
import type { CoreMessageType } from '../../../../../utils';
import { StringSet } from '../../../../../ui/Label/stringSet';

// hasSeparator does not read the stringSet, and grouping is disabled below, so an empty stub is enough.
const stringSet = {} as StringSet;

const userMessage = (createdAt: number, sendingStatus: string): CoreMessageType => ({
  messageId: createdAt,
  createdAt,
  sendingStatus,
  messageType: 'user',
  isUserMessage: () => true,
  isAdminMessage: () => false,
  isFileMessage: () => false,
  isMultipleFilesMessage: () => false,
} as unknown as CoreMessageType);

// Local time so the assertion matches date-fns isSameDay (also local). 10:00 keeps us clear of midnight.
const SEP_08 = new Date(2026, 8, 8, 10, 0, 0).getTime();
const SEP_09 = new Date(2026, 8, 9, 10, 0, 0).getTime();
const SEP_10 = new Date(2026, 8, 10, 10, 0, 0).getTime();
const SEP_10_LATE = new Date(2026, 8, 10, 20, 0, 0).getTime();

describe('getMessagePartsInfo - date separator across sending status', () => {
  const base = {
    stringSet,
    isMessageGroupingEnabled: false, // isolate hasSeparator from message-grouping logic
    currentChannel: null,
  };

  const separatorFor = (previous: CoreMessageType, current: CoreMessageType) => {
    return getMessagePartsInfo({
      ...base,
      allMessages: [previous, current],
      currentIndex: 1,
      currentMessage: current,
    }).hasSeparator;
  };

  // Regression: when the just-sent message is still pending, the scroll-to-bottom fires on the
  // pending callback. If the date separator only appeared after the message succeeded, its height
  // was inserted above the message after the scroll, clipping the sent message at the viewport bottom.
  it('shows the date separator for a PENDING message that starts a new day', () => {
    expect(separatorFor(userMessage(SEP_09, 'succeeded'), userMessage(SEP_10, 'pending'))).toBe(true);
  });

  it('does not show a separator for a pending message on the same day as the previous message', () => {
    const previousSameDay = userMessage(SEP_10 - 60 * 60 * 1000, 'succeeded');
    expect(separatorFor(previousSameDay, userMessage(SEP_10, 'pending'))).toBe(false);
  });

  it('keeps the separator once the message succeeds, so there is no post-send layout shift', () => {
    expect(separatorFor(userMessage(SEP_09, 'succeeded'), userMessage(SEP_10, 'succeeded'))).toBe(true);
  });

  it('shows the separator for a FAILED message that starts a new day, avoiding flicker on resend', () => {
    expect(separatorFor(userMessage(SEP_09, 'succeeded'), userMessage(SEP_10, 'failed'))).toBe(true);
  });

  // Regression: @sendbird/uikit-tools sorts unsent messages to the bottom (createdAt + LARGE_OFFSET),
  // so a failed message from an earlier day can render below a newer succeeded one. It must not emit a
  // backward-dated separator that contradicts the later date already shown above it.
  it('does not show a backward-dated separator for an out-of-order (displaced) failed message', () => {
    expect(separatorFor(userMessage(SEP_10, 'succeeded'), userMessage(SEP_09, 'failed'))).toBe(false);
  });

  it('shows the separator for the first message in the list (no previous message)', () => {
    const first = userMessage(SEP_10, 'succeeded');
    const { hasSeparator } = getMessagePartsInfo({
      ...base, allMessages: [first], currentIndex: 0, currentMessage: first,
    });
    expect(hasSeparator).toBe(true);
  });

  it('shows the separator for canceled/scheduled local statuses at a forward day boundary', () => {
    expect(separatorFor(userMessage(SEP_09, 'succeeded'), userMessage(SEP_10, 'canceled'))).toBe(true);
    expect(separatorFor(userMessage(SEP_09, 'succeeded'), userMessage(SEP_10, 'scheduled'))).toBe(true);
  });

  // Regression (P2): with several displaced unsent messages, comparing only the immediately-previous
  // message reintroduced date reversal / duplicate separators. Judge against the latest day shown above.
  it('does not reverse dates across multiple displaced failed messages from different days', () => {
    const displacedFailed09 = userMessage(SEP_09, 'failed');
    const { hasSeparator } = getMessagePartsInfo({
      ...base,
      allMessages: [userMessage(SEP_10, 'succeeded'), userMessage(SEP_08, 'failed'), displacedFailed09],
      currentIndex: 2,
      currentMessage: displacedFailed09,
    });
    expect(hasSeparator).toBe(false);
  });

  it('does not duplicate a day separator for a pending message following a displaced older failed one', () => {
    const pending10 = userMessage(SEP_10_LATE, 'pending');
    const { hasSeparator } = getMessagePartsInfo({
      ...base,
      allMessages: [userMessage(SEP_10, 'succeeded'), userMessage(SEP_09, 'failed'), pending10],
      currentIndex: 2,
      currentMessage: pending10,
    });
    expect(hasSeparator).toBe(false);
  });

  // The forward-only rule is limited to local messages. The deprecated Channel module can append a delayed
  // succeeded message out of order (passUnsuccessfullMessages), and non-local messages keep the original
  // immediate-previous comparison, so that message still renders its separator as before.
  it('keeps the original comparison for a non-local message appended out of chronological order', () => {
    expect(separatorFor(userMessage(SEP_10, 'succeeded'), userMessage(SEP_09, 'succeeded'))).toBe(true);
  });
});

describe('getMessagePartsInfo - unread "New Messages" separator stays gated by sending status', () => {
  const partsFor = (message: CoreMessageType) => {
    return getMessagePartsInfo({
      stringSet,
      isMessageGroupingEnabled: false,
      currentChannel: null,
      allMessages: [userMessage(SEP_09, 'succeeded'), message],
      currentIndex: 1,
      currentMessage: message,
      isUnreadMessageExistInChannel: { current: true },
      firstUnreadMessageId: message.messageId,
    });
  };

  // The fix keeps `isLocalMessage` alive only for this branch: a just-sent local message is never the
  // unread boundary. Guards against a future refactor deleting the now-"unused-looking" guard.
  it('suppresses the unread separator for a pending message even if it matches firstUnreadMessageId', () => {
    expect(partsFor(userMessage(SEP_10, 'pending')).hasNewMessageSeparator).toBe(false);
  });

  it('shows the unread separator for a succeeded message that matches firstUnreadMessageId', () => {
    expect(partsFor(userMessage(SEP_10, 'succeeded')).hasNewMessageSeparator).toBe(true);
  });
});
