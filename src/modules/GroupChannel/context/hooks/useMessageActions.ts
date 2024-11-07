import { useCallback } from 'react';
import { useGroupChannelMessages } from '@sendbird/uikit-tools';
import { MessageMetaArray } from '@sendbird/chat/message';
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

import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';
import type { GroupChannelState } from '../types';

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
}

const pass = <T>(value: T) => value;

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
  } = params;

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
    [],
  );

  return {
    sendUserMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<UserMessageCreateParams>(params);
        const processedParams = await onBeforeSendUserMessage(internalParams);

        return sendUserMessage(processedParams, asyncScrollToBottom);
      },
      [buildInternalMessageParams, sendUserMessage, scrollToBottom],
    ),
    sendFileMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<FileMessageCreateParams>(params);
        const processedParams = await onBeforeSendFileMessage(internalParams);

        return sendFileMessage(processedParams, asyncScrollToBottom);
      },
      [buildInternalMessageParams, sendFileMessage, scrollToBottom],
    ),
    sendMultipleFilesMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<MultipleFilesMessageCreateParams>(params);
        const processedParams = await onBeforeSendMultipleFilesMessage(internalParams);

        return sendMultipleFilesMessage(processedParams, asyncScrollToBottom);
      },
      [buildInternalMessageParams, sendMultipleFilesMessage, scrollToBottom],
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
        const processedParams = await onBeforeSendVoiceMessage(internalParams);

        return sendFileMessage(processedParams, asyncScrollToBottom);
      },
      [buildInternalMessageParams, sendFileMessage, scrollToBottom],
    ),
    updateUserMessage: useCallback(
      async (messageId: number, params: UserMessageUpdateParams) => {
        const internalParams = buildInternalMessageParams<UserMessageUpdateParams>(params);
        const processedParams = await onBeforeUpdateUserMessage(internalParams);

        return updateUserMessage(messageId, processedParams);
      },
      [buildInternalMessageParams, updateUserMessage],
    ),
    updateFileMessage,
    resendMessage,
    deleteMessage,
    resetNewMessages,
  };
}
