import { Role } from '../../lib/types';
import { isFailedMessage, isPendingMessage } from '..';
import { isReplyTypeMessageEnabled } from '../menuConditions';

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

jest.mock('..', () => ({
  isFailedMessage: jest.fn(),
  isPendingMessage: jest.fn(),
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
      isGroupChannel: jest.fn(),
      isEphemeral: false,
      isBroadcast: false,
      myRole: Role.NONE,
    };
    message = {};
  });

  it('returns false if the message is a failed message', () => {
    (isFailedMessage as jest.Mock).mockReturnValue(true);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the message is a pending message', () => {
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(true);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is not a group channel', () => {
    (channel.isGroupChannel as jest.Mock).mockReturnValue(false);
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is ephemeral', () => {
    (channel.isGroupChannel as jest.Mock).mockReturnValue(true);
    channel.isEphemeral = true;
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns false if the channel is a broadcast and user is not an operator', () => {
    (channel.isGroupChannel as jest.Mock).mockReturnValue(true);
    channel.isBroadcast = true;
    channel.myRole = Role.NONE;
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(false);
  });

  it('returns true if the channel is a broadcast and user is an operator', () => {
    (channel.isGroupChannel as jest.Mock).mockReturnValue(true);
    channel.isBroadcast = true;
    channel.myRole = Role.OPERATOR;
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(true);
  });

  it('returns true if the channel is not a broadcast', () => {
    (channel.isGroupChannel as jest.Mock).mockReturnValue(true);
    channel.isBroadcast = false;
    channel.myRole = Role.NONE;
    (isFailedMessage as jest.Mock).mockReturnValue(false);
    (isPendingMessage as jest.Mock).mockReturnValue(false);
    expect(isReplyTypeMessageEnabled({ channel, message })).toBe(true);
  });
});
