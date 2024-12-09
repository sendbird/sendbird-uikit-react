import { renderHook } from '@testing-library/react-hooks';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { UserMessage } from '@sendbird/chat/message';
import { User } from '@sendbird/chat';
import useUpdateMessageCallback from '../hooks/useUpdateMessageCallback';
import { PublishingModuleType } from '../../../internalInterfaces';
import { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';

const mockSetEmojiContainer = jest.fn();

jest.mock('../useThread', () => ({
  __esModule: true,
  default: () => ({
    actions: {
      setEmojiContainer: mockSetEmojiContainer,
    },
  }),
}));

const mockPubSub = {
  publish: jest.fn(),
} as unknown as SBUGlobalPubSub;

const mockLogger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

describe('useUpdateMessageCallback', () => {
  const mockMessageId = 12345;
  const mockMessage = 'Updated message content';
  const mockMentionedUsers = [{ userId: 'user1' }] as User[];
  const mockMentionTemplate = '@{user1}';

  const createMockChannel = (updateUserMessage = jest.fn()) => ({
    updateUserMessage,
  }) as unknown as GroupChannel;
  const createMockCallbacks = () => ({
    onMessageUpdated: jest.fn(),
  });

  const renderUpdateMessageCallbackHook = ({
    currentChannel = undefined,
    isMentionEnabled = false,
    callbacks = createMockCallbacks(),
  } = {}) => {
    return renderHook(() => useUpdateMessageCallback(
      {
        currentChannel: currentChannel ?? null,
        isMentionEnabled,
        onMessageUpdated: callbacks.onMessageUpdated,
      },
      {
        logger: mockLogger,
        pubSub: mockPubSub,
      },
    ));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update message successfully', async () => {
    const updatedMessage = {
      messageId: mockMessageId,
      message: mockMessage,
    } as UserMessage;

    const mockUpdateUserMessage = jest.fn().mockResolvedValue(updatedMessage);
    const mockChannel = createMockChannel(mockUpdateUserMessage);
    const callbacks = createMockCallbacks();

    const { result } = renderUpdateMessageCallbackHook({
      currentChannel: mockChannel,
      callbacks,
    });

    await result.current({
      messageId: mockMessageId,
      message: mockMessage,
    });

    expect(mockUpdateUserMessage).toHaveBeenCalledWith(
      mockMessageId,
      expect.objectContaining({
        message: mockMessage,
      }),
    );
    expect(callbacks.onMessageUpdated).toHaveBeenCalledWith(mockChannel, updatedMessage);
    expect(mockPubSub.publish).toHaveBeenCalledWith(
      'UPDATE_USER_MESSAGE',
      expect.objectContaining({
        fromSelector: true,
        channel: mockChannel,
        message: updatedMessage,
        publishingModules: [PublishingModuleType.THREAD],
      }),
    );
  });

  it('should include mention data when mention is enabled', async () => {
    const mockUpdateUserMessage = jest.fn().mockResolvedValue({} as UserMessage);
    const mockChannel = createMockChannel(mockUpdateUserMessage);

    const { result } = renderUpdateMessageCallbackHook({
      currentChannel: mockChannel,
      isMentionEnabled: true,
    });

    await result.current({
      messageId: mockMessageId,
      message: mockMessage,
      mentionedUsers: mockMentionedUsers,
      mentionTemplate: mockMentionTemplate,
    });

    expect(mockUpdateUserMessage).toHaveBeenCalledWith(
      mockMessageId,
      expect.objectContaining({
        message: mockMessage,
        mentionedUsers: mockMentionedUsers,
        mentionedMessageTemplate: mockMentionTemplate,
      }),
    );
  });

  it('should use message as mention template when template is not provided', async () => {
    const mockUpdateUserMessage = jest.fn().mockResolvedValue({} as UserMessage);
    const mockChannel = createMockChannel(mockUpdateUserMessage);

    const { result } = renderUpdateMessageCallbackHook({
      currentChannel: mockChannel,
      isMentionEnabled: true,
    });

    await result.current({
      messageId: mockMessageId,
      message: mockMessage,
      mentionedUsers: mockMentionedUsers,
    });

    expect(mockUpdateUserMessage).toHaveBeenCalledWith(
      mockMessageId,
      expect.objectContaining({
        message: mockMessage,
        mentionedUsers: mockMentionedUsers,
        mentionedMessageTemplate: mockMessage,
      }),
    );
  });

  it('should not update message when currentChannel is undefined', async () => {
    const callbacks = createMockCallbacks();
    const { result } = renderUpdateMessageCallbackHook({
      currentChannel: undefined,
      callbacks,
    });

    await result.current({
      messageId: mockMessageId,
      message: mockMessage,
    });

    expect(callbacks.onMessageUpdated).not.toHaveBeenCalled();
    expect(mockPubSub.publish).not.toHaveBeenCalled();
  });
});
