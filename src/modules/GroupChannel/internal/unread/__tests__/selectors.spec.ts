/**
 * Phase 4 RV — selectors (RV-4.2..4.6).
 */
import {
  selectUnreadCount,
  selectShouldShowSeparator,
  selectShouldShowUnreadBadge,
  selectShouldShowScrollToBottomButton,
  selectShouldMarkAsRead,
  selectUnreadMode,
  selectFirstUnreadMessageId,
  selectFirstUnreadCreatedAt,
  selectLastReadAt,
} from '../selectors';
import { unreadReducer } from '../reducer';
import { createInitialUnreadState } from '../model';

describe('Phase 4 — unread selectors', () => {
  /* ─── RV-4.2  selectUnreadCount ──────────────────────────────── */
  it('RV-4.2  selectUnreadCount returns 0 on clean, grows in tracking, persists in marked-unread', () => {
    const s0 = createInitialUnreadState();
    expect(selectUnreadCount(s0)).toBe(0);

    const tracking = unreadReducer(s0, {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 1, createdAt: 100 }, { messageId: 2, createdAt: 200 }],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(selectUnreadCount(tracking)).toBe(2);

    const marked = unreadReducer(s0, {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 7,
      createdAt: 700,
    });
    expect(selectUnreadCount(marked)).toBe(1);
  });

  /* ─── RV-4.3  selectShouldShowSeparator ──────────────────────── */
  it('RV-4.3  selectShouldShowSeparator returns true for the anchor message id only', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 10, createdAt: 1000 }, { messageId: 11, createdAt: 1100 }],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(selectShouldShowSeparator(s, { messageId: 10 })).toBe(true);
    expect(selectShouldShowSeparator(s, { messageId: 11 })).toBe(false);
    expect(selectShouldShowSeparator(s, { messageId: 99 })).toBe(false);
  });

  it('selectShouldShowSeparator returns false when separator is not visible', () => {
    const s = createInitialUnreadState();
    expect(selectShouldShowSeparator(s, { messageId: 1 })).toBe(false);
  });

  /* ─── RV-4.4  selectShouldShowUnreadBadge ────────────────────── */
  it('RV-4.4  selectShouldShowUnreadBadge: false on clean / true when tracking', () => {
    expect(selectShouldShowUnreadBadge(createInitialUnreadState())).toBe(false);
    const tracking = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 1, createdAt: 100 }],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(selectShouldShowUnreadBadge(tracking)).toBe(true);
  });

  /* ─── RV-4.5  selectShouldShowScrollToBottomButton ──────────── */
  it('RV-4.5  selectShouldShowScrollToBottomButton: false at bottom / true otherwise', () => {
    const s = createInitialUnreadState();
    expect(selectShouldShowScrollToBottomButton(s, { position: 'bottom' })).toBe(false);
    expect(selectShouldShowScrollToBottomButton(s, { position: 'middle' })).toBe(true);
    expect(selectShouldShowScrollToBottomButton(s, { position: 'top' })).toBe(true);
  });

  /* ─── RV-4.6  selectShouldMarkAsRead ─────────────────────────── */
  it('RV-4.6  disableMarkAsRead=true blocks the decision unconditionally', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    expect(
      selectShouldMarkAsRead(s, { position: 'bottom' }, { disableMarkAsRead: true }),
    ).toBe(false);
  });

  it('RV-4.6  enableMarkAsUnread=true suppresses auto mark-as-read', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    expect(
      selectShouldMarkAsRead(s, { position: 'bottom' }, { enableMarkAsUnread: true }),
    ).toBe(false);
  });

  it('RV-4.6  myMemberState="none" blocks mark-as-read', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    expect(
      selectShouldMarkAsRead(s, { position: 'bottom' }, { myMemberState: 'none' }),
    ).toBe(false);
  });

  it('RV-4.6  marked-unread mode blocks mark-as-read even at bottom', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 1,
      createdAt: 100,
    });
    const sAtBottom = unreadReducer(s, { type: 'USER_REACHED_BOTTOM', at: 1000 });
    expect(sAtBottom.shouldMarkAsRead).toBe(true);
    expect(sAtBottom.mode).toBe('marked-unread');
    expect(
      selectShouldMarkAsRead(sAtBottom, { position: 'bottom' }, { myMemberState: 'joined' }),
    ).toBe(false);
  });

  it('RV-4.6  happy path: shouldMarkAsRead + position=bottom + joined → true', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    expect(
      selectShouldMarkAsRead(s, { position: 'bottom' }, { myMemberState: 'joined' }),
    ).toBe(true);
  });

  it('RV-4.6  blocks when not at bottom regardless of shouldMarkAsRead flag', () => {
    const s = { ...createInitialUnreadState(), shouldMarkAsRead: true };
    expect(
      selectShouldMarkAsRead(s, { position: 'middle' }, { myMemberState: 'joined' }),
    ).toBe(false);
  });

  /* ─── m2 RV-4.10  firstUnreadMessageId parity ─────────────────── */
  it('RV-4.10  selectFirstUnreadMessageId returns the same value set via MARK_AS_UNREAD_SET', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'MARK_AS_UNREAD_SET',
      messageId: 555,
      createdAt: 55500,
    });
    expect(selectFirstUnreadMessageId(s)).toBe(555);
    expect(selectFirstUnreadCreatedAt(s)).toBe(55500);
  });

  /* ─── trivial selectors ──────────────────────────────────────── */
  it('selectUnreadMode reflects the current mode', () => {
    expect(selectUnreadMode(createInitialUnreadState())).toBe('clean');
    const tracking = unreadReducer(createInitialUnreadState(), {
      type: 'MESSAGES_RECEIVED',
      messages: [{ messageId: 1, createdAt: 100 }],
      fromCurrentUser: false,
    }, { isAtBottom: false });
    expect(selectUnreadMode(tracking)).toBe('tracking');
  });

  it('selectLastReadAt tracks READ_CONFIRMED.at', () => {
    const s = unreadReducer(createInitialUnreadState(), {
      type: 'READ_CONFIRMED',
      channelUrl: 'ch1',
      at: 12345,
    });
    expect(selectLastReadAt(s)).toBe(12345);
  });
});
