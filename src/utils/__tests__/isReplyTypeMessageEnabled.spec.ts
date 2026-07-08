import { Role } from '../../lib/Sendbird/types';
import { isFailedMessage, isPendingMessage } from '..';
import { isReplyTypeMessageEnabled } from '../menuConditions';
import type { Mock } from 'vitest';

// Legacy conditions
// const isReplyTypeMessageEnabled = ({ message, channel }) => (
//   !isFailedMessage(message)
//   && !isPendingMessage(message)
//   && (channel?.isGroupChannel?.()
//     && !channel?.isEphemeral
//     && (
//       ((channel)?.isBroadcast && channel?.myRole === Role.OPERATOR)
//       || !(channel)?.isBroadcast
//     ))
// );

vi.mock('..', () => ({
  isFailedMessage: vi.fn(),
  isPendingMessage: vi.fn(),
}));

interface Channel {
  isGroupChannel?: () => boolean;
  isEphemeral?: boolean;
  isBroadcast?: boolean;
  myRole?: typeof Role[keyof typeof Role];
}

interface Message { }

describe('isReplyTypeMessageEnabled', () => {
  let channel: Channel;
  let message: Message;

  beforeEach(() => {
    channel = {
      isGroupChannel: vi.fn(),
      isEphemeral: false,
      isBroadcast: false,
      myRole: Role.NONE,
    };
    message = {};
  });

  it('returns false if the message is a failed message', () => {
    (isFailedMessage as Mock).mockReturnValue(true);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the message is a pending message', () => {
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(true);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is not a group channel', () => {
    (channel.isGroupChannel as Mock).mockReturnValue(false);
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is ephemeral', () => {
    (channel.isGroupChannel as Mock).mockReturnValue(true);
    channel.isEphemeral = true;
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is a broadcast and user is not an operator', () => {
    (channel.isGroupChannel as Mock).mockReturnValue(true);
    channel.isBroadcast = true;
    channel.myRole = Role.NONE;
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns true if the channel is a broadcast and user is an operator', () => {
    (channel.isGroupChannel as Mock).mockReturnValue(true);
    channel.isBroadcast = true;
    channel.myRole = Role.OPERATOR;
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(true);
  });

  it('returns true if the channel is not a broadcast', () => {
    (channel.isGroupChannel as Mock).mockReturnValue(true);
    channel.isBroadcast = false;
    channel.myRole = Role.NONE;
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(true);
  });
});
