import { match } from 'ts-pattern';
import { useCallback } from 'react';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import type {
  BaseMessageCreateParams,
  FileMessage,
  FileMessageCreateParams,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { MessageMetaArray } from '@sendbird/chat/message';

import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import type { GroupChannelState, OnBeforeHandler } from '../types';
import type { CoreMessageType } from '../../../../utils';
import { PublishingModuleType, PUBSUB_TOPICS } from '../../../../lib/pubSub/topics';
import { GroupChannel } from '@sendbird/chat/groupChannel';

type MessageListDataSource = ReturnType<typeof useGroupChannelMessages>;
type MessageActions = {
  sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
  sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
} & Partial<MessageListDataSource>;

interface Params extends GroupChannelState {
  scrollToBottom(animated?: boolean): Promise<void>;
  currentChannel: GroupChannel;
}

const pass = <T>(value: T) => value;
type MessageParamsByType = {
  user: UserMessageCreateParams;
  file: FileMessageCreateParams;
  multipleFiles: MultipleFilesMessageCreateParams;
  voice: FileMessageCreateParams;
  update: UserMessageUpdateParams;
};

/**
 * @description This hook controls common processes related to message sending, updating.
 * */
export function useMessageActions(params: Params): MessageActions {
  const {
    onBeforeSendUserMessage = pass,
    onBeforeSendFileMessage = pass,
    onBeforeUpdateUserMessage = pass,
    onBeforeSendVoiceMessage = pass,
    onBeforeSendMultipleFilesMessage = pass,

    sendFileMessage,
    sendMultipleFilesMessage,
    sendUserMessage,
    updateUserMessage,
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetNewMessages,

    scrollToBottom,
    quoteMessage,
    replyType,
    currentChannel,
  } = params;
  const {
    state: {
      eventHandlers,
      config: {
        pubSub,
      },
    },
  } = useSendbird();
  const buildInternalMessageParams = useCallback(
    <T extends BaseMessageCreateParams>(basicParams: T): T => {
      const messageParams = { ...basicParams } as T;

      if (params.quoteMessage && replyType !== 'NONE') {
        messageParams.isReplyToChannel = true;
        messageParams.parentMessageId = quoteMessage?.messageId;
      }

      return messageParams;
    },
    [replyType, quoteMessage],
  );

  // This is a hack for the hotfix of following issue
  // https://sendbird.atlassian.net/browse/SBISSUE-17029
  const asyncScrollToBottom = useCallback(
    () => {
      setTimeout(scrollToBottom, 0);
    },
    [scrollToBottom],
  );

  const processParams = useCallback(async <T extends keyof MessageParamsByType>(
    handler: OnBeforeHandler<MessageParamsByType[T]>,
    params: ReturnType<typeof buildInternalMessageParams>,
    type: keyof MessageParamsByType,
  ): Promise<MessageParamsByType[T]> => {
    try {
      const result = await handler(params as MessageParamsByType[T]);
      return (result === undefined ? params : result) as MessageParamsByType[T];
    } catch (error) {
      if (typeof eventHandlers?.message === 'object') {
        match(type)
          .with('file', 'voice', () => {
            if ((params as any).file) {
              eventHandlers.message.onFileUploadFailed?.(error);
            }
            eventHandlers.message.onSendMessageFailed?.(params as CoreMessageType, error);
          })
          .with('multipleFiles', () => {
            if ((params as MultipleFilesMessageCreateParams).fileInfoList) {
              eventHandlers.message.onFileUploadFailed?.(error);
            }
            eventHandlers.message.onSendMessageFailed?.(params as CoreMessageType, error);
          })
          .with('user', () => {
            eventHandlers.message.onSendMessageFailed?.(
              params as CoreMessageType,
              error,
            );
          })
          .with('update', () => {
            eventHandlers.message.onUpdateMessageFailed?.(
              params as CoreMessageType,
              error,
            );
          })
          .exhaustive();
      }
      throw error;
    }
  }, [eventHandlers]);

  return {
    sendUserMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<UserMessageCreateParams>(params);
        const processedParams = await processParams(onBeforeSendUserMessage, internalParams, 'user') as UserMessageCreateParams;
        const message = await sendUserMessage(processedParams, asyncScrollToBottom);
        pubSub.publish(PUBSUB_TOPICS.SEND_USER_MESSAGE, {
          channel: currentChannel,
          message,
          publishingModules: [PublishingModuleType.CHANNEL],
        });
        return message;
      },
      [buildInternalMessageParams, sendUserMessage, scrollToBottom, processParams],
    ),
    sendFileMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<FileMessageCreateParams>(params);
        const processedParams = await processParams(onBeforeSendFileMessage, internalParams, 'file') as FileMessageCreateParams;
        const message = await sendFileMessage(processedParams, asyncScrollToBottom);

        pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message,
          publishingModules: [PublishingModuleType.CHANNEL],
        });

        return message;
      },
      [buildInternalMessageParams, sendFileMessage, scrollToBottom, processParams],
    ),
    sendMultipleFilesMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<MultipleFilesMessageCreateParams>(params);
        const processedParams = await processParams(onBeforeSendMultipleFilesMessage, internalParams, 'multipleFiles') as MultipleFilesMessageCreateParams;
        const message = await sendMultipleFilesMessage(processedParams, asyncScrollToBottom);
        pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message,
          publishingModules: [PublishingModuleType.CHANNEL],
        });
        return message;
      },
      [buildInternalMessageParams, sendMultipleFilesMessage, scrollToBottom, processParams],
    ),
    sendVoiceMessage: useCallback(
      async (params: FileMessageCreateParams, duration: number) => {
        const internalParams = buildInternalMessageParams<FileMessageCreateParams>({
          ...params,
          fileName: VOICE_MESSAGE_FILE_NAME,
          mimeType: VOICE_MESSAGE_MIME_TYPE,
          metaArrays: [
            new MessageMetaArray({
              key: META_ARRAY_VOICE_DURATION_KEY,
              value: [`${duration}`],
            }),
            new MessageMetaArray({
              key: META_ARRAY_MESSAGE_TYPE_KEY,
              value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
            }),
          ],
        });
        const processedParams = await processParams(onBeforeSendVoiceMessage, internalParams, 'voice');
        return sendFileMessage(processedParams, asyncScrollToBottom);
      },
      [buildInternalMessageParams, sendFileMessage, scrollToBottom, processParams],
    ),
    updateUserMessage: useCallback(
      async (messageId: number, params: UserMessageUpdateParams) => {
        const internalParams = buildInternalMessageParams<UserMessageUpdateParams>(params);
        const processedParams = await processParams(onBeforeUpdateUserMessage, internalParams, 'update');
        return updateUserMessage(messageId, processedParams)
          .then((message) => {
            pubSub.publish(PUBSUB_TOPICS.UPDATE_USER_MESSAGE, {
              channel: currentChannel,
              message,
              publishingModules: [PublishingModuleType.CHANNEL],
            });

            return message;
          });
      },
      [buildInternalMessageParams, updateUserMessage, processParams, currentChannel?.url],
    ),
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetNewMessages,
  };
}
