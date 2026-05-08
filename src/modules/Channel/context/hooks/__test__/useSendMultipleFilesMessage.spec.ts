import { RefObject, createRef } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MultipleFilesMessageCreateParams, UserMessage } from '@sendbird/chat/message';
import { renderHook } from '@testing-library/react';

import {
  UseSendMFMDynamicParams,
  UseSendMFMStaticParams,
  useSendMultipleFilesMessage,
} from '../useSendMultipleFilesMessage';
import type { Logger } from '../../../../../lib/Sendbird/types';
import {
  MockMessageRequestHandlerType,
  getMockMessageRequestHandler,
} from '../../../../../utils/testMocks/messageRequestHandler';
import PUBSUB_TOPICS from '../../../../../lib/pubSub/topics';
import { MockMessageStateType, mockSentMessage } from '../../../../../utils/testMocks/message';
import uuidv4 from '../../../../../utils/uuid';

interface UseSendMFMParams extends UseSendMFMDynamicParams, UseSendMFMStaticParams {
  messageRequestHandler: MockMessageRequestHandlerType;
}
type GlobalContextType = {
  [K in keyof UseSendMFMParams]?: UseSendMFMParams[K];
};
const globalContext: GlobalContextType = {};
const mockFileList = [new File([], 'fileOne'), new File([], 'fileTwo')];

const expectPublishedMessage = (topic: string, mockMessageType: MockMessageStateType) => {
  expect(globalContext.pubSub?.publish)
    .toHaveBeenCalledWith(
      topic,
      expect.objectContaining({
        message: expect.objectContaining({ mockMessageType }),
        channel: globalContext.currentChannel,
        publishingModules: [],
      }),
    );
};

const expectFileUploadPublished = () => {
  expect(globalContext.pubSub?.publish)
    .toHaveBeenCalledWith(
      PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED,
      expect.objectContaining({
        response: expect.objectContaining({
          channelUrl: globalContext.currentChannel?.url,
          requestId: 0,
          index: 0,
          uploadableFileInfo: {},
          error: null,
        }),
        publishingModules: [],
      }),
    );
};

describe('useSendMultipleFilesMessage', () => {
  // URL.createObjectURL seems it doesn't work in the jest env.
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });
  afterAll(() => {
    (global.URL.createObjectURL as jest.Mock).mockReset();
  });

  beforeEach(() => {
    globalContext.currentChannel = {
      url: uuidv4(),
      sendMultipleFilesMessage: jest.fn(() => getMockMessageRequestHandler()),
    } as unknown as GroupChannel;
    globalContext.onBeforeSendMultipleFilesMessage = (files, quoteMessage) => {
      const params = {
        fileInfoList: files.map((file: File) => ({
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        })),
      } as MultipleFilesMessageCreateParams;
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    globalContext.logger = { info: jest.fn(), warning: jest.fn(), error: jest.fn() };
    globalContext.pubSub = { publish: jest.fn() };
    globalContext.scrollRef = createRef<HTMLDivElement>();
  });

  it('should check sending MFM', async () => {
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    await sendMultipleFilesMessage(mockFileList);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .toHaveBeenCalledWith({
        fileInfoList: [
          {
            file: mockFileList[0],
            fileName: mockFileList[0].name,
            fileSize: mockFileList[0].size,
            mimeType: mockFileList[0].type,
          },
          {
            file: mockFileList[1],
            fileName: mockFileList[1].name,
            fileSize: mockFileList[1].size,
            mimeType: mockFileList[1].type,
          },
        ],
      });

    expectFileUploadPublished();
    expectPublishedMessage(PUBSUB_TOPICS.SEND_MESSAGE_START, MockMessageStateType.PENDING);
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        expect.anything(),
      );
    expectPublishedMessage(PUBSUB_TOPICS.SEND_FILE_MESSAGE, MockMessageStateType.SUCCEEDED);
  });

  it('should check sending MFM failed', async () => {
    const currentChannel = {
      ...globalContext.currentChannel,
      sendMultipleFilesMessage: jest.fn(() => getMockMessageRequestHandler(false)),
    } as unknown as GroupChannel;
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        // this mock channel will fail sending MFM -> getMockMessageRequestHandler(false)
        currentChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    await expect(sendMultipleFilesMessage(mockFileList)).rejects.toBeDefined();

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(currentChannel.sendMultipleFilesMessage)
      .toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        expect.anything(),
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        expect.objectContaining({
          message: expect.objectContaining({ mockMessageType: MockMessageStateType.FAILED }),
          channel: currentChannel,
          publishingModules: [],
        }),
      );
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        expect.anything(),
      );
  });

  it('should not send message when receiving empty files', async () => {
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    // receiving an empty array
    await expect(sendMultipleFilesMessage([])).rejects.toBeUndefined();

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalled();
  });

  it('should not send message when receiving an array of one file', async () => {
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    // receiving only one file
    await expect(sendMultipleFilesMessage([mockFileList[0]])).rejects.toBeUndefined();

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalled();
  });

  it('should apply the quoteMessage', async () => {
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    // send multiple files message with a quote message
    await sendMultipleFilesMessage(mockFileList, mockSentMessage as unknown as UserMessage);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .toHaveBeenCalledWith({
        fileInfoList: [
          {
            file: mockFileList[0],
            fileName: mockFileList[0].name,
            fileSize: mockFileList[0].size,
            mimeType: mockFileList[0].type,
          },
          {
            file: mockFileList[1],
            fileName: mockFileList[1].name,
            fileSize: mockFileList[1].size,
            mimeType: mockFileList[1].type,
          },
        ],
        isReplyToChannel: true,
        parentMessageId: mockSentMessage.messageId,
      });
    expectFileUploadPublished();
    expectPublishedMessage(PUBSUB_TOPICS.SEND_MESSAGE_START, MockMessageStateType.PENDING);

    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        expect.anything(),
      );
    expectPublishedMessage(PUBSUB_TOPICS.SEND_FILE_MESSAGE, MockMessageStateType.SUCCEEDED);
  });

  it('should apply the onBeforeSendMultipleFilesMessage', async () => {
    const newParamsOptions = {
      customType: 'custom-type',
      fileInfoList: [new File([], 'newFileOne'), new File([], 'newFileTwo')].map((file) => ({ file })),
    };
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        // modify the message create params before sending a message
        onBeforeSendMultipleFilesMessage: (files, quotedMessage) => ({
          ...globalContext?.onBeforeSendMultipleFilesMessage?.(files, quotedMessage),
          ...newParamsOptions,
        }),
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    await sendMultipleFilesMessage(mockFileList);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .toHaveBeenCalledWith(newParamsOptions);
    expectFileUploadPublished();
    expectPublishedMessage(PUBSUB_TOPICS.SEND_MESSAGE_START, MockMessageStateType.PENDING);
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        expect.anything(),
      );
    expectPublishedMessage(PUBSUB_TOPICS.SEND_FILE_MESSAGE, MockMessageStateType.SUCCEEDED);
  });

  it('should have higher priority with onBeforeSendMultipleFilesMessage rather than quoteMessage', async () => {
    const newParamsOptions = {
      customType: 'custom-type',
      fileInfoList: [new File([], 'newFileOne'), new File([], 'newFileTwo')].map((file) => ({ file })),
      parentMessageId: 1111,
    };
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        currentChannel: globalContext.currentChannel as GroupChannel,
        // modify the message create params before sending a message
        onBeforeSendMultipleFilesMessage: (files, quotedMessage) => ({
          ...globalContext?.onBeforeSendMultipleFilesMessage?.(files, quotedMessage),
          // upsert the properties for the quote message
          ...newParamsOptions,
        }),
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    // send multiple files message with a quote message
    await sendMultipleFilesMessage(mockFileList, mockSentMessage as unknown as UserMessage);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .toHaveBeenCalledWith({
        isReplyToChannel: true,
        ...newParamsOptions,
      });
    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalledWith({
        customType: newParamsOptions.customType,
        fileInfoList: newParamsOptions.fileInfoList,
        isReplyToChannel: true,
        parentMessageId: mockSentMessage.messageId,
      });
    expectFileUploadPublished();
    expectPublishedMessage(PUBSUB_TOPICS.SEND_MESSAGE_START, MockMessageStateType.PENDING);
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        expect.anything(),
      );
    expectPublishedMessage(PUBSUB_TOPICS.SEND_FILE_MESSAGE, MockMessageStateType.SUCCEEDED);
  });
});
