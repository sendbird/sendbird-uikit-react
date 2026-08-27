import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage } from '@sendbird/chat/message';
import { getOutgoingMessageState, OutgoingMessageStates } from '../getOutgoingMessageState';

/**
 * CLNP-8803 / C4
 *
 * `getUnreadMemberCount` and `getUndeliveredMemberCount` are outgoing read receipts:
 * they count the joined members whose cached receipt timestamp is older than the
 * message's `createdAt`. The SDK short-circuits them to `0` for super, broadcast and
 * exclusive channels, and they are naturally `0` when nobody else has joined.
 *
 * Running those checks before confirming the message actually reached the server made
 * an unsent message report as READ. These tests pin the receipt checks behind a
 * `succeeded` guard while keeping every succeeded path unchanged.
 */

/** A channel whose receipt counters always report 0, as super/broadcast channels do. */
const zeroReceiptChannel = {
  isGroupChannel: () => true,
  getUnreadMemberCount: () => 0,
  getUndeliveredMemberCount: () => 0,
} as unknown as GroupChannel;

/** An ordinary group channel where the recipient has not caught up with the message. */
const pendingReceiptChannel = {
  isGroupChannel: () => true,
  getUnreadMemberCount: () => 1,
  getUndeliveredMemberCount: () => 1,
} as unknown as GroupChannel;

describe('getOutgoingMessageState - undelivered messages must not borrow read receipts', () => {
  it('does not report a canceled message as READ when the receipt counters are 0', () => {
    expect(
      getOutgoingMessageState(
        zeroReceiptChannel,
        { sendingStatus: 'canceled' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.NONE);
  });

  it('does not report a scheduled message as READ or DELIVERED when the receipt counters are 0', () => {
    expect(
      getOutgoingMessageState(
        zeroReceiptChannel,
        { sendingStatus: 'scheduled' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.NONE);
  });

  it('does not report a canceled message as DELIVERED when only the delivery counter is 0', () => {
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: () => 1,
          getUndeliveredMemberCount: () => 0,
        } as unknown as GroupChannel,
        { sendingStatus: 'canceled' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.NONE);
  });

  it('keeps canceled out of the FAILED bucket', () => {
    // `canceled` covers both an aborted request and a user-cancelled upload; the SDK
    // collapses the two into one error code, so UIKit must not promote it to a failure.
    expect(
      getOutgoingMessageState(
        pendingReceiptChannel,
        { sendingStatus: 'canceled' } as UserMessage,
      ),
    ).not.toBe(OutgoingMessageStates.FAILED);
  });
});

describe('getOutgoingMessageState - unchanged behaviour', () => {
  it('still resolves an ordinary group channel undelivered message to NONE', () => {
    // The dominant real-world case: receipts are non-zero, so this was already NONE.
    expect(
      getOutgoingMessageState(
        pendingReceiptChannel,
        { sendingStatus: 'canceled' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.NONE);
  });

  it('still resolves a succeeded message to READ when the unread counter is 0', () => {
    expect(
      getOutgoingMessageState(
        zeroReceiptChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.READ);
  });

  it('still resolves a succeeded message to DELIVERED when only the delivery counter is 0', () => {
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: () => 1,
          getUndeliveredMemberCount: () => 0,
        } as unknown as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.DELIVERED);
  });

  it('still resolves a succeeded message to SENT when neither counter is 0', () => {
    expect(
      getOutgoingMessageState(
        pendingReceiptChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.SENT);
  });

  it('still resolves a succeeded open channel message to SENT', () => {
    expect(
      getOutgoingMessageState(
        { isGroupChannel: () => false } as unknown as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      ),
    ).toBe(OutgoingMessageStates.SENT);
  });

  it('still resolves pending and failed before any receipt check', () => {
    expect(
      getOutgoingMessageState(zeroReceiptChannel, { sendingStatus: 'pending' } as UserMessage),
    ).toBe(OutgoingMessageStates.PENDING);
    expect(
      getOutgoingMessageState(zeroReceiptChannel, { sendingStatus: 'failed' } as UserMessage),
    ).toBe(OutgoingMessageStates.FAILED);
  });

  it('still resolves a missing message to NONE', () => {
    expect(getOutgoingMessageState(zeroReceiptChannel, null)).toBe(OutgoingMessageStates.NONE);
    expect(
      getOutgoingMessageState(zeroReceiptChannel, {} as UserMessage),
    ).toBe(OutgoingMessageStates.NONE);
  });
});
