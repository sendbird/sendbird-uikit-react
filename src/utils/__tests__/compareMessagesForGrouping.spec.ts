import { compareMessagesForGrouping } from '../../utils/messages';

// NOTE: this suite previously mocked `isSameGroup` and called the comparator with five
// arguments while the real signature takes six (stringSet is the fourth). The mock never
// intercepted the internal call and the misplaced arguments pushed every case down the
// non-group early return, so the assertions passed for the wrong reason. Both problems are
// fixed here: the comparator runs unmocked against real message shapes.

const stringSet = { DATE_FORMAT__MESSAGE_CREATED_AT: 'p' } as any;

const messageWith = (sendingStatus: string, overrides: Record<string, unknown> = {}) => ({
  messageId: 1,
  messageType: 'user',
  sendingStatus,
  sender: { userId: 'tester' },
  createdAt: 1579767478896,
  ...overrides,
} as any);

/** A group channel where nobody has caught up, so no message resolves to READ/DELIVERED. */
const groupChannel = {
  channelType: 'group',
  isGroupChannel: () => true,
  getUnreadMemberCount: () => 1,
  getUndeliveredMemberCount: () => 1,
} as any;

const compare = (
  sendingStatus: string,
  channel: unknown,
  replyType?: string,
  overrides?: Record<string, unknown>,
) => compareMessagesForGrouping(
  messageWith(sendingStatus, overrides),
  messageWith(sendingStatus, overrides),
  messageWith(sendingStatus, overrides),
  stringSet,
  channel as any,
  replyType as any,
);

describe('compareMessagesForGrouping', () => {
  it('returns [false, false] when replyType is THREAD and the message has threadInfo', () => {
    expect(compare('succeeded', groupChannel, 'THREAD', { threadInfo: {} })).toEqual([false, false]);
  });

  it('returns [true, true] for consecutive succeeded messages in the same group', () => {
    expect(compare('succeeded', groupChannel)).toEqual([true, true]);
  });

  it('returns [false, false] when the message is pending', () => {
    expect(compare('pending', groupChannel)).toEqual([false, false]);
  });

  it('returns [false, false] when the message is failed', () => {
    expect(compare('failed', groupChannel)).toEqual([false, false]);
  });

  it('returns a two-element tuple, as the exported contract promises', () => {
    const result = compare('succeeded', groupChannel);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });
});

// CLNP-8803
//
// getOutgoingMessageState now maps canceled and scheduled to NONE before consulting read
// receipts. isSameGroup compares isReadMessage() on both sides, and receipt counts are
// per-message (they key off createdAt), so two same-minute canceled messages could
// previously differ by receipt and stay ungrouped. Collapsing both to NONE would have
// started chaining them. Grouping is decided by delivery, not by receipt bookkeeping, so
// the guard covers every state that never reached the server.
describe('compareMessagesForGrouping - undelivered messages are never chained', () => {
  it('does not group canceled messages', () => {
    expect(compare('canceled', groupChannel)).toEqual([false, false]);
  });

  it('does not group scheduled messages', () => {
    expect(compare('scheduled', groupChannel)).toEqual([false, false]);
  });

  it('does not group a canceled pair whose read receipts disagree', () => {
    // Before the guard covered `canceled`, one side resolved to READ and the other to NONE,
    // which happened to keep them apart. That accident must not be what protects us.
    const mixedReceiptChannel = {
      channelType: 'group',
      isGroupChannel: () => true,
      getUnreadMemberCount: (m: any) => (m.messageId === 1 ? 0 : 1),
      getUndeliveredMemberCount: () => 1,
    } as any;
    const first = messageWith('canceled', { messageId: 1 });
    const second = messageWith('canceled', { messageId: 2 });

    expect(
      compareMessagesForGrouping(first, second, first, stringSet, mixedReceiptChannel, undefined),
    ).toEqual([false, false]);
  });
});

// The non-group early return is deliberately left untouched: OpenChannel calls the
// comparator without a channel (OpenChannelMessageList passes four arguments) and renders
// its pending/failed indicators independently of the chain flags, so guarding that path
// would change avatars and headers in a view that has no status bug. MessageContent's own
// unsettled-message check covers the null-channel group case instead.
describe('compareMessagesForGrouping - the non-group path is unchanged', () => {
  it('still groups pending messages when there is no channel', () => {
    expect(compare('pending', null)).toEqual([true, true]);
  });

  it('still groups failed messages in a non-group channel', () => {
    expect(compare('failed', { channelType: 'open' })).toEqual([true, true]);
  });

  it('still groups succeeded messages when there is no channel', () => {
    expect(compare('succeeded', null)).toEqual([true, true]);
  });
});
