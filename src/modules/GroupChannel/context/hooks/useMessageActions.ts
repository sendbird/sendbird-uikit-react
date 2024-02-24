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
import type { SendableMessageType } from '../../../../utils';
import type { ReplyType } from '../../../../types';
import type { GroupChannelProviderProps } from '../GroupChannelProvider';
import {PersonalTemplatesDataForTesting} from './temp';

type MessageListDataSource = ReturnType<typeof useGroupChannelMessages>;
type MessageActions = {
  sendUserMessage: (params: UserMessageCreateParams) => Promise<UserMessage>;
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  sendVoiceMessage: (params: FileMessageCreateParams, duration: number) => Promise<FileMessage>;
  sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  updateUserMessage: (messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>;
};

interface Params extends GroupChannelProviderProps, MessageListDataSource {
  scrollToBottom(): Promise<void>;
  quoteMessage?: SendableMessageType;
  replyType: ReplyType;
}

const pass = <T>(value: T) => value;

/**
 * @description This hook controls common processes related to message sending, updating.
 * */
export function useMessageActions(params: Params): MessageActions {
  const {
    // FIXME: Put this back to pass before merging.
    // onBeforeSendUserMessage = (params) => {
    //   params.extendedMessagePayload = {
    //     // template: PersonalTemplatesDataForTesting[0],
    //     template: { key: 't0' },
    //   };
    //   return params;
    // },
    onBeforeSendUserMessage = pass,
    onBeforeSendFileMessage = pass,
    onBeforeUpdateUserMessage = pass,
    onBeforeSendVoiceMessage = pass,
    onBeforeSendMultipleFilesMessage = pass,

    sendFileMessage,
    sendMultipleFilesMessage,
    sendUserMessage,
    updateUserMessage,

    scrollToBottom,
    quoteMessage,
    replyType,
  } = params;

  const buildInternalMessageParams = useCallback(
    <T extends BaseMessageCreateParams>(basicParams: T): T => {
      const messageParams = { ...basicParams } as T;

      if (params.quoteMessage && replyType !== 'NONE') {
        messageParams.isReplyToChannel = true;
        messageParams.parentMessageId = quoteMessage.messageId;
      }

      return messageParams;
    },
    [replyType, quoteMessage],
  );

  return {
    sendUserMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<UserMessageCreateParams>(params);
        const processedParams = await onBeforeSendUserMessage(internalParams);

        return sendUserMessage(processedParams, () => scrollToBottom());
      },
      [buildInternalMessageParams, sendUserMessage, scrollToBottom],
    ),
    sendFileMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<FileMessageCreateParams>(params);
        const processedParams = await onBeforeSendFileMessage(internalParams);

        return sendFileMessage(processedParams, () => scrollToBottom());
      },
      [buildInternalMessageParams, sendFileMessage, scrollToBottom],
    ),
    sendMultipleFilesMessage: useCallback(
      async (params) => {
        const internalParams = buildInternalMessageParams<MultipleFilesMessageCreateParams>(params);
        const processedParams = await onBeforeSendMultipleFilesMessage(internalParams);

        return sendMultipleFilesMessage(processedParams, () => scrollToBottom());
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

        return sendFileMessage(processedParams, () => scrollToBottom());
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
  };
}
