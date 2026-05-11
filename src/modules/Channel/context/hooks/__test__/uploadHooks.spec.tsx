import React from 'react';
import { act, renderHook } from '@testing-library/react';

import PUBSUB_TOPICS from '../../../../../lib/pubSub/topics';
import useSendbird from '../../../../../lib/Sendbird/context/hooks/useSendbird';
import { useGlobalModalContext } from '../../../../../hooks/useModal';
import { useLocalization } from '../../../../../lib/LocalizationContext';
import { compressImages } from '../../../../../utils/compressImages';
import { useHandleUploadFiles as useChannelHandleUploadFiles } from '../useHandleUploadFiles';
import { useSendMultipleFilesMessage } from '../useSendMultipleFilesMessage';
import { useHandleUploadFiles as useGroupChannelHandleUploadFiles } from '../../../../GroupChannel/components/MessageInputWrapper/useHandleUploadFiles';
import { PublishingModuleType } from '../../../../internalInterfaces';
import { scrollIntoLast as scrollIntoLastForChannel } from '../../utils';
import { scrollIntoLast as scrollIntoLastForThread } from '../../../../Thread/context/utils';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../../utils/consts';

jest.mock('../../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../../hooks/useModal', () => ({
  useGlobalModalContext: jest.fn(),
}));
jest.mock('../../../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));
jest.mock('../../../../../utils/compressImages', () => ({
  compressImages: jest.fn(),
}));
jest.mock('../../utils', () => ({
  scrollIntoLast: jest.fn(),
}));
jest.mock('../../../../Thread/context/utils', () => ({
  scrollIntoLast: jest.fn(),
}));

const ONE_MIB = 1024 * 1024;

const createFile = (name: string, type: string, size = 10) => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { configurable: true, value: size });
  return file;
};

const createLogger = () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const openModal = jest.fn();

const setupCommonMocks = (overrides = {}) => {
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        imageCompression: { compressionRate: 0.7 },
        uikitUploadSizeLimit: ONE_MIB,
        uikitMultipleFilesMessageLimit: 2,
        ...overrides,
      },
    },
  });
  (useGlobalModalContext as jest.Mock).mockReturnValue({ openModal });
  (useLocalization as jest.Mock).mockReturnValue({
    stringSet: {
      BUTTON__OK: 'OK',
      FILE_UPLOAD_NOTIFICATION__COUNT_LIMIT: 'Only %d files',
      FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT: 'Only %d MiB',
    },
  });
  (compressImages as jest.Mock).mockImplementation(({ files }) => Promise.resolve({ compressedFiles: files }));
};

describe('Channel useHandleUploadFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupCommonMocks();
  });

  it('warns when required send functions or files are missing', async () => {
    const logger = createLogger();
    const { result, rerender } = renderHook(
      ({ sendFileMessage, sendMultipleFilesMessage }: any) => useChannelHandleUploadFiles(
        { sendFileMessage, sendMultipleFilesMessage },
        { logger: logger as any },
      ),
      {
        initialProps: {
          sendFileMessage: undefined,
          sendMultipleFilesMessage: undefined,
        },
      },
    );

    await act(async () => {
      await result.current([createFile('image.png', 'image/png')]);
    });
    expect(logger.warning).toHaveBeenCalledWith(
      'Channel|useHandleUploadFiles: required functions are undefined',
      expect.any(Object),
    );

    rerender({
      sendFileMessage: jest.fn(),
      sendMultipleFilesMessage: jest.fn(),
    });
    await act(async () => {
      await result.current([]);
    });
    expect(logger.warning).toHaveBeenCalledWith(
      'Channel|useHandleUploadFiles: given file list is empty.',
      { files: [] },
    );
  });

  it('opens notification modals for count and size limits', async () => {
    const logger = createLogger();
    const sendFileMessage = jest.fn();
    const sendMultipleFilesMessage = jest.fn();
    const { result } = renderHook(() => useChannelHandleUploadFiles(
      { sendFileMessage, sendMultipleFilesMessage },
      { logger: logger as any },
    ));

    await act(async () => {
      await result.current([
        createFile('one.png', 'image/png'),
        createFile('two.png', 'image/png'),
        createFile('three.png', 'image/png'),
      ]);
    });
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Only 2 files' }),
      childElement: expect.any(Function),
    }));

    await act(async () => {
      await result.current([createFile('large.png', 'image/png', ONE_MIB + 1)]);
    });
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Only 1 MiB' }),
      childElement: expect.any(Function),
    }));
    expect(sendFileMessage).not.toHaveBeenCalled();
    expect(sendMultipleFilesMessage).not.toHaveBeenCalled();
  });

  it('sends single files, image batches, and non-image files after compression', async () => {
    const logger = createLogger();
    const sendFileMessage = jest.fn().mockResolvedValue({ messageId: 1 });
    const sendMultipleFilesMessage = jest.fn().mockResolvedValue({ messageId: 2 });
    const quoteMessage = { messageId: 99 };
    const { result } = renderHook(() => useChannelHandleUploadFiles(
      { sendFileMessage, sendMultipleFilesMessage, quoteMessage: quoteMessage as any },
      { logger: logger as any },
    ));

    const image = createFile('image.png', 'image/png');
    await act(async () => {
      await result.current([image]);
    });
    expect(compressImages).toHaveBeenCalledWith(expect.objectContaining({
      files: [image],
      imageCompression: { compressionRate: 0.7 },
      logger,
    }));
    expect(sendFileMessage).toHaveBeenLastCalledWith(image, quoteMessage);

    const imageA = createFile('a.jpg', 'image/jpeg');
    const imageB = createFile('b.jpg', 'image/jpeg');
    await act(async () => {
      await result.current([imageA, imageB]);
    });
    expect(sendMultipleFilesMessage).toHaveBeenLastCalledWith([imageA, imageB], quoteMessage);

    const doc = createFile('doc.pdf', 'application/pdf');
    await act(async () => {
      await result.current([imageA, doc]);
    });
    expect(sendFileMessage).toHaveBeenLastCalledWith(doc, quoteMessage);
  });
});

describe('GroupChannel MessageInputWrapper useHandleUploadFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupCommonMocks();
  });

  it('validates file list, count, and size before sending', async () => {
    const logger = createLogger();
    const sendFileMessage = jest.fn();
    const sendMultipleFilesMessage = jest.fn();
    const { result } = renderHook(() => useGroupChannelHandleUploadFiles(
      { sendFileMessage, sendMultipleFilesMessage },
      { logger: logger as any },
    ));

    await act(async () => {
      await result.current([]);
    });
    expect(logger.warning).toHaveBeenCalledWith('Channel|useHandleUploadFiles: given file list is empty.', { files: [] });

    await act(async () => {
      await result.current([
        createFile('one.png', 'image/png'),
        createFile('two.png', 'image/png'),
        createFile('three.png', 'image/png'),
      ]);
    });
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Only 1048576 files' }),
    }));

    await act(async () => {
      await result.current([createFile('large.png', 'image/png', ONE_MIB + 1)]);
    });
    expect(openModal).toHaveBeenLastCalledWith(expect.objectContaining({
      modalProps: expect.objectContaining({ titleText: 'Only 1 MiB' }),
    }));
    expect(sendFileMessage).not.toHaveBeenCalled();
    expect(sendMultipleFilesMessage).not.toHaveBeenCalled();
  });

  it('sends single files and splits multiple image/non-image uploads', async () => {
    const logger = createLogger();
    const sendFileMessage = jest.fn().mockResolvedValue({ messageId: 1 });
    const sendMultipleFilesMessage = jest.fn().mockResolvedValue({ messageId: 2 });
    const quoteMessage = { messageId: 77 };
    const { result } = renderHook(() => useGroupChannelHandleUploadFiles(
      { sendFileMessage, sendMultipleFilesMessage, quoteMessage: quoteMessage as any },
      { logger: logger as any },
    ));

    const image = createFile('image.png', 'image/png');
    await act(async () => {
      await result.current([image]);
    });
    expect(sendFileMessage).toHaveBeenLastCalledWith({ file: image, parentMessageId: 77 });

    const imageA = createFile('a.jpg', 'image/jpeg');
    const imageB = createFile('b.jpg', 'image/jpeg');
    await act(async () => {
      await result.current([imageA, imageB]);
    });
    expect(sendMultipleFilesMessage).toHaveBeenLastCalledWith({
      fileInfoList: [
        { file: imageA, fileName: 'a.jpg', fileSize: 10, mimeType: 'image/jpeg' },
        { file: imageB, fileName: 'b.jpg', fileSize: 10, mimeType: 'image/jpeg' },
      ],
      parentMessageId: 77,
    });

    const doc = createFile('doc.pdf', 'application/pdf');
    await act(async () => {
      await result.current([imageA, doc]);
    });
    expect(sendFileMessage).toHaveBeenCalledWith({ file: imageA, parentMessageId: 77 });
    expect(sendFileMessage).toHaveBeenLastCalledWith({ file: doc, parentMessageId: 77 });
  });
});

describe('useSendMultipleFilesMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('rejects invalid state before calling the SDK', async () => {
    const logger = createLogger();
    const pubSub = { publish: jest.fn() };
    const { result, rerender } = renderHook(
      ({ currentChannel, files }: any) => {
        const [send] = useSendMultipleFilesMessage(
          {
            currentChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          },
          { logger: logger as any, pubSub },
        );
        return { send, files };
      },
      {
        initialProps: {
          currentChannel: null,
          files: [createFile('a.png', 'image/png'), createFile('b.png', 'image/png')],
        },
      },
    );

    await expect(result.current.send(result.current.files)).rejects.toBeUndefined();
    expect(logger.warning).toHaveBeenCalledWith(
      'Channel: Sending MFm failed, because currentChannel is null.',
      { currentChannel: null },
    );

    const currentChannel = { url: 'channel-url', sendMultipleFilesMessage: jest.fn() };
    rerender({ currentChannel, files: [createFile('only.png', 'image/png')] });
    await expect(result.current.send(result.current.files)).rejects.toBeUndefined();
    expect(logger.warning).toHaveBeenCalledWith(
      'Channel: Sending MFM failed, because there are no multiple files.',
      { files: result.current.files },
    );
  });

  it('publishes SDK upload, pending, failed, and succeeded events', async () => {
    const logger = createLogger();
    const pubSub = { publish: jest.fn() };
    const files = [createFile('a.png', 'image/png'), createFile('b.png', 'image/png')];
    const failed = { messageId: 10 };
    const succeeded = { messageId: 11 };
    const sdkError = new Error('sdk failed');
    let rejectCallback: Function | undefined;

    const currentChannel = {
      url: 'channel-url',
      sendMultipleFilesMessage: jest.fn((params) => ({
        onFileUploaded(callback: Function) {
          callback('request-id', 1, params.fileInfoList[1], undefined);
          return this;
        },
        onPending(callback: Function) {
          callback({ messageId: 9 });
          return this;
        },
        onFailed(callback: Function) {
          rejectCallback = callback;
          return this;
        },
        onSucceeded(callback: Function) {
          callback(succeeded);
          return this;
        },
      })),
    };
    const scrollRef = { current: document.createElement('div') };
    const { result } = renderHook(() => {
      const [send] = useSendMultipleFilesMessage(
        {
          currentChannel: currentChannel as any,
          publishingModules: [PublishingModuleType.CHANNEL, PublishingModuleType.THREAD],
          onBeforeSendMultipleFilesMessage: (items, quoteMessage) => ({
            fileInfoList: items.map((file) => ({
              file,
              fileName: `custom-${file.name}`,
              fileSize: file.size,
              mimeType: file.type,
            })),
            parentMessageId: quoteMessage?.messageId,
          }),
        },
        { logger: logger as any, pubSub, scrollRef },
      );
      return send;
    });

    await expect(result.current(files, { messageId: 123 } as any)).resolves.toBe(succeeded);
    expect(currentChannel.sendMultipleFilesMessage).toHaveBeenCalledWith(expect.objectContaining({
      parentMessageId: 123,
      fileInfoList: expect.arrayContaining([
        expect.objectContaining({ fileName: 'custom-a.png' }),
        expect.objectContaining({ fileName: 'custom-b.png' }),
      ]),
    }));
    expect(pubSub.publish).toHaveBeenCalledWith(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, expect.objectContaining({
      response: expect.objectContaining({ requestId: 'request-id', index: 1 }),
    }));
    expect(pubSub.publish).toHaveBeenCalledWith(PUBSUB_TOPICS.SEND_MESSAGE_START, expect.objectContaining({
      message: { messageId: 9 },
      channel: currentChannel,
    }));
    act(() => {
      jest.advanceTimersByTime(SCROLL_BOTTOM_DELAY_FOR_SEND);
    });
    expect(scrollIntoLastForChannel).toHaveBeenCalledWith(0, scrollRef);
    expect(scrollIntoLastForThread).toHaveBeenCalledWith(0);
    expect(pubSub.publish).toHaveBeenCalledWith(PUBSUB_TOPICS.SEND_FILE_MESSAGE, expect.objectContaining({
      message: succeeded,
      channel: currentChannel,
    }));

    await expect(new Promise((_, reject) => {
      rejectCallback?.(sdkError, failed);
      reject(sdkError);
    })).rejects.toThrow('sdk failed');
    expect(pubSub.publish).toHaveBeenCalledWith(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, expect.objectContaining({
      message: failed,
      channel: currentChannel,
    }));
  });

  it('rejects when the SDK throws while sending', async () => {
    const logger = createLogger();
    const pubSub = { publish: jest.fn() };
    const sdkError = new Error('thrown');
    const currentChannel = {
      url: 'channel-url',
      sendMultipleFilesMessage: jest.fn(() => {
        throw sdkError;
      }),
    };
    const { result } = renderHook(() => {
      const [send] = useSendMultipleFilesMessage(
        {
          currentChannel: currentChannel as any,
          publishingModules: [PublishingModuleType.CHANNEL],
        },
        { logger: logger as any, pubSub },
      );
      return send;
    });

    await expect(result.current([
      createFile('a.png', 'image/png'),
      createFile('b.png', 'image/png'),
    ])).rejects.toThrow('thrown');
    expect(logger.error).toHaveBeenCalledWith('Channel: Sending MFM failed.', { error: sdkError });
  });
});
