/**
 * Test isReplyTypeMessageEnabled in another file
 */
import { Role } from '@sendbird/chat';
import { isUserMessage, isFailedMessage, isPendingMessage, isSentMessage } from '..';
import {
  showMenuItemCopy,
  showMenuItemEdit,
  showMenuItemResend,
  showMenuItemDelete,
  showMenuItemOpenInChannel,
  showMenuItemReply,
  showMenuItemThread,
} from '../menuConditions';
import type { Mock } from 'vitest';

// Mock the utility functions
vi.mock('..', () => ({
  isUserMessage: vi.fn(),
  isFailedMessage: vi.fn(),
  isPendingMessage: vi.fn(),
  isSentMessage: vi.fn(),
}));

interface Channel {
  isGroupChannel?: () => boolean;
  isEphemeral?: boolean;
  isBroadcast?: boolean;
  myRole?: Role;
}

interface Message {
  sendingStatus?: string;
  isResendable?: boolean;
  parentMessageId?: number | null;
}

describe('Global-utils/MenuConditions', () => {
  let channel: Channel;
  let message: Message;
  let params: any;

  beforeEach(() => {
    channel = {
      isGroupChannel: () => true,
      isEphemeral: false,
      isBroadcast: false,
      myRole: Role.NONE,
    };
    message = {
      sendingStatus: 'succeeded',
    };
    params = {
      message,
      channel,
      isByMe: true,
      onMoveToParentMessage: null,
      isReplyTypeEnabled: true,
      replyType: 'QUOTE_REPLY',
      onReplyInThread: null,
    };
  });

  it('showMenuItemCopy returns true for user messages', () => {
    (isUserMessage as unknown as Mock).mockReturnValue(true);
    expect(showMenuItemCopy(params)).toBe(true);

    (isUserMessage as unknown as Mock).mockReturnValue(false);
    expect(showMenuItemCopy(params)).toBe(false);
  });

  it('showMenuItemEdit returns true for editable messages', () => {
    (isUserMessage as unknown as Mock).mockReturnValue(true);
    (isSentMessage as unknown as Mock).mockReturnValue(true);
    channel.isEphemeral = false;
    params.isByMe = true;
    expect(showMenuItemEdit(params)).toBe(true);

    channel.isEphemeral = true;
    expect(showMenuItemEdit(params)).toBe(false);
  });

  it('showMenuItemResend returns true for resendable messages', () => {
    (isFailedMessage as Mock).mockReturnValue(true);
    message.isResendable = true;
    params.isByMe = true;
    expect(showMenuItemResend(params)).toBe(true);

    (isFailedMessage as Mock).mockReturnValue(false);
    expect(showMenuItemResend(params)).toBe(false);
  });

  it('showMenuItemDelete returns true for deletable messages', () => {
    (isPendingMessage as Mock).mockReturnValue(false);
    channel.isEphemeral = false;
    params.isByMe = true;
    expect(showMenuItemDelete(params)).toBe(true);

    (isPendingMessage as Mock).mockReturnValue(true);
    expect(showMenuItemDelete(params)).toBe(false);
  });

  it('showMenuItemOpenInChannel returns true if onMoveToParentMessage is provided', () => {
    params.onMoveToParentMessage = () => {};
    expect(showMenuItemOpenInChannel(params)).toBe(true);

    params.onMoveToParentMessage = null;
    expect(showMenuItemOpenInChannel(params)).toBe(false);
  });

  it('showMenuItemReply returns true for quote reply', () => {
    params.replyType = 'QUOTE_REPLY';
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(showMenuItemReply(params)).toBe(true);

    params.replyType = 'THREAD';
    expect(showMenuItemReply(params)).toBe(false);
  });

  it('showMenuItemThread returns true for thread reply if onReplyInThread is a function', () => {
    params.replyType = 'THREAD';
    params.onReplyInThread = () => {};
    params.message.parentMessageId = null;
    (isFailedMessage as Mock).mockReturnValue(false);
    (isPendingMessage as Mock).mockReturnValue(false);
    expect(showMenuItemThread(params)).toBe(true);

    params.onReplyInThread = null;
    expect(showMenuItemThread(params)).toBe(false);
  });
});
