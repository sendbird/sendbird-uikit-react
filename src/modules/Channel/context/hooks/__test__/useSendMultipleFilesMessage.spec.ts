import { RefObject, createRef } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { MultipleFilesMessageCreateParams, UserMessage } from '@sendbird/chat/message';
import { renderHook } from '@testing-library/react';

import {
  UseSendMFMDynamicParams,
  UseSendMFMStaticParams,
  useSendMultipleFilesMessage,
} from '../useSendMultipleFilesMessage';
import { Logger } from '../../../../../lib/SendbirdState';
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

describe('useSendMultipleFilesMessage', () => {
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

  it('should check sending MFM', () => {
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

    sendMultipleFilesMessage(mockFileList);

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
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        {
          message: { mockMessageType: MockMessageStateType.PENDING },
          channel: {
            url: globalContext.currentChannel?.url,
            sendMultipleFilesMessage: expect.any(Function),
          },
        },
      );
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        {
          message: { mockMessageType: MockMessageStateType.FAILED },
          channel: {
            url: globalContext.currentChannel?.url,
            sendMultipleFilesMessage: expect.any(Function),
          },
        },
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        {
          message: { mockMessageType: MockMessageStateType.SUCCEEDED },
          channel: {
            url: globalContext.currentChannel?.url,
            sendMultipleFilesMessage: expect.any(Function),
          },
        },
      );
  });

  it('should check sending MFM failed', () => {
    const { result } = renderHook(() => (
      useSendMultipleFilesMessage({
        // this mock channel will fail sending MFM -> getMockMessageRequestHandler(false)
        currentChannel: {
          ...globalContext.currentChannel,
          sendMultipleFilesMessage: jest.fn(() => getMockMessageRequestHandler(false)),
        } as unknown as GroupChannel,
        onBeforeSendMultipleFilesMessage: globalContext.onBeforeSendMultipleFilesMessage,
      }, {
        logger: globalContext.logger as Logger,
        pubSub: globalContext.pubSub,
        scrollRef: globalContext.scrollRef as RefObject<HTMLDivElement>,
      })
    ));
    const [sendMultipleFilesMessage] = result.current;

    sendMultipleFilesMessage(mockFileList);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        {
          message: { mockMessageType: MockMessageStateType.PENDING },
          channel: {
            url: globalContext.currentChannel?.url,
            sendMultipleFilesMessage: expect.any(Function),
          },
        },
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        {
          message: { mockMessageType: MockMessageStateType.FAILED },
          channel: {
            url: globalContext.currentChannel?.url,
            sendMultipleFilesMessage: expect.any(Function),
          },
        },
      );
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        {
          message: { mockMessageType: MockMessageStateType.SUCCEEDED },
          channel: globalContext.currentChannel,
        },
      );
  });

  it('should not send message when receiving empty files', () => {
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
    sendMultipleFilesMessage([]);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalled();
  });

  it('should not send message when receiving an array of one file', () => {
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
    sendMultipleFilesMessage([mockFileList[0]]);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .not.toHaveBeenCalled();
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalled();
  });

  it('should apply the quoteMessage', () => {
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
    sendMultipleFilesMessage(mockFileList, mockSentMessage as unknown as UserMessage);

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
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        {
          message: { mockMessageType: MockMessageStateType.PENDING },
          channel: globalContext.currentChannel,
        },
      );

    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        {
          message: { mockMessageType: MockMessageStateType.FAILED },
          channel: globalContext.currentChannel,
        },
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        {
          message: { mockMessageType: MockMessageStateType.SUCCEEDED },
          channel: globalContext.currentChannel,
        },
      );
  });

  it('should apply the onBeforeSendMultipleFilesMessage', () => {
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

    sendMultipleFilesMessage(mockFileList);

    expect(globalContext.currentChannel?.sendMultipleFilesMessage)
      .toHaveBeenCalledWith(newParamsOptions);
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        {
          message: { mockMessageType: MockMessageStateType.PENDING },
          channel: globalContext.currentChannel,
        },
      );
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        {
          message: { mockMessageType: MockMessageStateType.FAILED },
          channel: globalContext.currentChannel,
        },
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        {
          message: { mockMessageType: MockMessageStateType.SUCCEEDED },
          channel: globalContext.currentChannel,
        },
      );
  });

  it('should have higher priority with onBeforeSendMultipleFilesMessage rather than quoteMessage', () => {
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
    sendMultipleFilesMessage(mockFileList, mockSentMessage as unknown as UserMessage);

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
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_START,
        {
          message: { mockMessageType: MockMessageStateType.PENDING },
          channel: globalContext.currentChannel,
        },
      );
    expect(globalContext.pubSub?.publish)
      .not.toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_MESSAGE_FAILED,
        {
          message: { mockMessageType: MockMessageStateType.FAILED },
          channel: globalContext.currentChannel,
        },
      );
    expect(globalContext.pubSub?.publish)
      .toHaveBeenCalledWith(
        PUBSUB_TOPICS.SEND_FILE_MESSAGE,
        {
          message: { mockMessageType: MockMessageStateType.SUCCEEDED },
          channel: globalContext.currentChannel,
        },
      );
  });
});
