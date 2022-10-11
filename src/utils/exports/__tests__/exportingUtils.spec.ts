/* eslint-disable @typescript-eslint/no-unused-vars */
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage } from '@sendbird/chat/message';
import { getOutgoingMessageState, OutgoingMessageStates } from '../getOutgoingMessageState';

describe('Global-export-utils-getOutgoingMessageState', () => {
  test('OutgoingMessageStates should contain each types', () => {
    expect(OutgoingMessageStates.NONE).toBe('NONE');
    expect(OutgoingMessageStates.PENDING).toBe('PENDING');
    expect(OutgoingMessageStates.SENT).toBe('SENT');
    expect(OutgoingMessageStates.FAILED).toBe('FAILED');
    expect(OutgoingMessageStates.DELIVERED).toBe('DELIVERED');
    expect(OutgoingMessageStates.READ).toBe('READ');
  });

  it('should return pending', () => {
    expect(
      getOutgoingMessageState(
        {} as GroupChannel,
        { sendingStatus: 'pending' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.PENDING);
  });
  it('should return failed', () => {
    expect(
      getOutgoingMessageState(
        {} as GroupChannel,
        { sendingStatus: 'failed' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.FAILED);
  });
  it('should return sent', () => {
    // when it's not a group channel
    expect(
      getOutgoingMessageState(
        { isGroupChannel: () => false } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.SENT);
    // when getUnreadMemberCount or getUndeliveredMemberCount doesn't exist
    expect(
      getOutgoingMessageState(
        { isGroupChannel: () => true } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.SENT);
    // when getUnreadMemberCount and getUndeliveredMemberCount return a number(0<)
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 1,
          getUndeliveredMemberCount: (_) => 1,
        } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.SENT);
  });
  it('should return delivered', () => {
    // when getUnreadMemberCount doesn't exist & getUndeliveredMemberCount returns 0
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUndeliveredMemberCount: (_) => 0,
        } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.DELIVERED);
    // when getUnreadMemberCount returns a number(0<) & getUndeliveredMemberCount returns 0
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 1,
          getUndeliveredMemberCount: (_) => 0,
        } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.DELIVERED);
  });
  it('should return read', () => {
    // when getUnreadMemberCount returns 0
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 0,
        } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.READ);
    // when getUnreadMemberCount returns 0
    expect(
      getOutgoingMessageState(
        {
          isGroupChannel: () => true,
          getUnreadMemberCount: (_) => 0,
          getUndeliveredMemberCount: (_) => 1,
        } as GroupChannel,
        { sendingStatus: 'succeeded' } as UserMessage,
      )
    ).toBe(OutgoingMessageStates.READ);
  })
});
