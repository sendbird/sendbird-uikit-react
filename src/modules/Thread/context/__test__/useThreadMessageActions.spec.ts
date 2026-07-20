import { renderHook, act, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';
import { User } from '@sendbird/chat';
import type { FileMessage } from '@sendbird/chat/message';

import { useThreadMessageActions } from '../hooks/useThreadMessageActions';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { VOICE_MESSAGE_FILE_NAME, VOICE_MESSAGE_MIME_TYPE } from '../../../../utils/consts';
import type { SendableMessageType } from '../../../../utils';
import type { Logger } from '../../../../lib/Sendbird/types';
import type { ThreadState } from '../ThreadProvider';

const mockChannel = { url: 'test-channel' };

const makeState = (overrides: Partial<ThreadState> = {}): ThreadState => ({
  currentChannel: mockChannel,
  onBeforeSendUserMessage: undefined,
  onBeforeSendFileMessage: undefined,
  onBeforeSendVoiceMessage: undefined,
  onBeforeSendMultipleFilesMessage: undefined,
  dsSendUserMessage: vi.fn().mockResolvedValue({ messageId: 1, isUserMessage: () => true }),
  dsSendFileMessage: vi.fn().mockResolvedValue({ messageId: 2 }),
  dsSendMultipleFilesMessage: vi.fn().mockResolvedValue({ messageId: 3 }),
  dsUpdateUserMessage: vi.fn().mockResolvedValue({ messageId: 4 }),
  dsResendMessage: vi.fn().mockImplementation(async (message) => message),
  dsDeleteMessage: vi.fn().mockResolvedValue(undefined),
  ...overrides,
} as unknown as ThreadState);

const makeStatics = () => ({
  logger: { info: vi.fn(), warning: vi.fn(), error: vi.fn() } as unknown as Logger,
  pubSub: { publish: vi.fn(), subscribe: vi.fn() } as unknown as SBUGlobalPubSub,
  isMentionEnabled: true,
});

describe('useThreadMessageActions', () => {
  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:thread-local-preview'),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(),
      configurable: true,
    });
  });

  it('sendMessage builds user params (mention + quote) and publishes SEND_USER_MESSAGE [THREAD]', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const quoteMessage = { messageId: 99 } as unknown as SendableMessageType;
    const mentionedUsers = [{ userId: 'u1' }] as unknown as User[];

    await act(async () => {
      result.current.sendMessage({ message: 'hi', mentionedUsers, mentionTemplate: '@{u1}', quoteMessage });
    });

    const [params, onPending] = (state.dsSendUserMessage as Mock).mock.calls[0];
    expect(params).toMatchObject({
      message: 'hi',
      mentionedUsers,
      mentionedMessageTemplate: '@{u1}',
      isReplyToChannel: true,
      parentMessageId: 99,
    });
    expect(typeof onPending).toBe('function');
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.SEND_USER_MESSAGE, expect.objectContaining({
        channel: mockChannel,
        publishingModules: [PublishingModuleType.THREAD],
      }));
    });
  });

  it('sendFileMessage builds file params and publishes SEND_FILE_MESSAGE [THREAD]', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const quoteMessage = { messageId: 7 } as unknown as SendableMessageType;

    await act(async () => {
      await result.current.sendFileMessage(file, quoteMessage);
    });

    const [params] = (state.dsSendFileMessage as Mock).mock.calls[0];
    expect(params).toMatchObject({ file, isReplyToChannel: true, parentMessageId: 7 });
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.SEND_FILE_MESSAGE, expect.objectContaining({
        publishingModules: [PublishingModuleType.THREAD],
      }));
    });
  });

  it('sendFileMessage attaches a local preview (localUrl + file) to the pending message', async () => {
    const pendingMessage = { messageId: 0 } as unknown as FileMessage;
    const state = makeState({
      dsSendFileMessage: vi.fn().mockImplementation((_params, onPending) => {
        onPending?.(pendingMessage);
        return Promise.resolve({ messageId: 2 });
      }),
    });
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const file = new File(['x'], 'a.png', { type: 'image/png' });

    await act(async () => {
      await result.current.sendFileMessage(file);
    });

    const local = pendingMessage as FileMessage & { localUrl?: string; file?: File };
    expect(local.localUrl).toBe('blob:thread-local-preview');
    expect(local.file).toBe(file);
  });

  it('sendVoiceMessage builds voice metaArrays and publishes SEND_FILE_MESSAGE', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const file = new File(['x'], 'voice', { type: 'audio/mp3' });

    await act(async () => {
      result.current.sendVoiceMessage(file, 3000);
    });

    const [params] = (state.dsSendFileMessage as Mock).mock.calls[0];
    expect(params).toMatchObject({ fileName: VOICE_MESSAGE_FILE_NAME, mimeType: VOICE_MESSAGE_MIME_TYPE });
    expect(params.metaArrays).toHaveLength(2);
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.SEND_FILE_MESSAGE, expect.anything());
    });
  });

  it('sendMultipleFilesMessage builds fileInfoList and publishes SEND_FILE_MESSAGE', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
    ];

    await act(async () => {
      await result.current.sendMultipleFilesMessage(files);
    });

    const [params] = (state.dsSendMultipleFilesMessage as Mock).mock.calls[0];
    expect(params.fileInfoList).toHaveLength(2);
    expect(params.fileInfoList[0]).toMatchObject({ fileName: 'a.png', mimeType: 'image/png' });
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.SEND_FILE_MESSAGE, expect.anything());
    });
  });

  it('updateMessage builds update params and publishes UPDATE_USER_MESSAGE', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));

    await act(async () => {
      result.current.updateMessage({ messageId: 5, message: 'edited', mentionedUserIds: ['u2'], mentionTemplate: '@{u2}' });
    });

    expect(state.dsUpdateUserMessage).toHaveBeenCalledWith(5, expect.objectContaining({
      message: 'edited',
      mentionedUserIds: ['u2'],
      mentionedMessageTemplate: '@{u2}',
    }));
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.UPDATE_USER_MESSAGE, expect.objectContaining({
        fromSelector: true,
        publishingModules: [PublishingModuleType.THREAD],
      }));
    });
  });

  it('deleteMessage delegates to the data source', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const message = { messageId: 8 } as unknown as SendableMessageType;

    await act(async () => {
      await result.current.deleteMessage(message);
    });

    expect(state.dsDeleteMessage).toHaveBeenCalledWith(message);
  });

  it('resendMessage delegates to the data source and publishes by message type', async () => {
    const state = makeState();
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));
    const failedMessage = { messageId: 9, isResendable: true, isUserMessage: () => true } as unknown as SendableMessageType;

    await act(async () => {
      result.current.resendMessage(failedMessage);
    });

    expect(state.dsResendMessage).toHaveBeenCalledWith(failedMessage);
    await waitFor(() => {
      expect(statics.pubSub.publish).toHaveBeenCalledWith(topics.SEND_USER_MESSAGE, expect.objectContaining({
        publishingModules: [PublishingModuleType.THREAD],
      }));
    });
  });

  it('does not send or publish when the data source method is missing', () => {
    const state = makeState({ dsSendUserMessage: undefined });
    const statics = makeStatics();
    const { result } = renderHook(() => useThreadMessageActions(state, statics));

    act(() => {
      result.current.sendMessage({ message: 'hi' });
    });

    expect(statics.pubSub.publish).not.toHaveBeenCalled();
  });
});
