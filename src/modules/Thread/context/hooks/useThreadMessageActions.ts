import { useCallback, useMemo } from 'react';
import { User } from '@sendbird/chat';
import {
  FileMessage,
  FileMessageCreateParams,
  MessageMetaArray,
  MultipleFilesMessage,
  MultipleFilesMessageCreateParams,
  UploadableFileInfo,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/Sendbird/types';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { SendableMessageType } from '../../../../utils';
import { scrollIntoLast } from '../utils';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  SCROLL_BOTTOM_DELAY_FOR_SEND,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';
import type { ThreadState } from '../ThreadProvider';

export type SendMessageParams = {
  message: string;
  quoteMessage?: SendableMessageType;
  mentionTemplate?: string;
  mentionedUsers?: Array<User>;
};

export type UpdateMessageParams = {
  messageId: number;
  message: string;
  mentionedUsers?: User[];
  mentionedUserIds?: string[];
  mentionTemplate?: string;
};

export interface ThreadMessageActions {
  sendMessage: (props: SendMessageParams) => void;
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>;
  sendVoiceMessage: (file: File, duration: number, quoteMessage?: SendableMessageType) => void;
  sendMultipleFilesMessage: (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;
  updateMessage: (props: UpdateMessageParams) => void;
  deleteMessage: (message: SendableMessageType) => Promise<void>;
  resendMessage: (failedMessage: SendableMessageType) => void;
}

interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
  isMentionEnabled: boolean;
}

const scrollToLastAfterSend = () => {
  setTimeout(() => scrollIntoLast(), SCROLL_BOTTOM_DELAY_FOR_SEND);
};

const attachLocalFilePreview = (pendingMessage: FileMessage, file: File): string => {
  const localUrl = URL.createObjectURL(file);
  const localFileMessage = pendingMessage as FileMessage & { localUrl?: string; file?: File };
  localFileMessage.localUrl = localUrl;
  localFileMessage.file = file;
  return localUrl;
};

export function useThreadMessageActions(state: ThreadState, { logger, pubSub, isMentionEnabled }: StaticProps): ThreadMessageActions {
  const {
    currentChannel,
    onBeforeSendUserMessage,
    onBeforeSendFileMessage,
    onBeforeSendVoiceMessage,
    onBeforeSendMultipleFilesMessage,
    dsSendUserMessage,
    dsSendFileMessage,
    dsSendMultipleFilesMessage,
    dsUpdateUserMessage,
    dsResendMessage,
    dsDeleteMessage,
  } = state;

  const sendMessage = useCallback((props: SendMessageParams) => {
    const { message, quoteMessage, mentionTemplate, mentionedUsers } = props;
    const createDefaultParams = () => {
      const params = {} as UserMessageCreateParams;
      params.message = message;
      const mentionedUsersLength = mentionedUsers?.length || 0;
      if (isMentionEnabled && mentionedUsersLength) {
        params.mentionedUsers = mentionedUsers;
      }
      if (isMentionEnabled && mentionTemplate && mentionedUsersLength) {
        params.mentionedMessageTemplate = mentionTemplate;
      }
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    const params = onBeforeSendUserMessage?.(message, quoteMessage) ?? createDefaultParams();
    if (!dsSendUserMessage || !currentChannel) return;
    logger.info('Thread | useThreadMessageActions: Sending user message start.', params);
    dsSendUserMessage(params, () => scrollToLastAfterSend())
      .then((sentMessage) => {
        pubSub.publish(topics.SEND_USER_MESSAGE, {
          channel: currentChannel,
          message: sentMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
      })
      .catch((error) => {
        logger.info('Thread | useThreadMessageActions: Sending user message failed.', error);
      });
  }, [dsSendUserMessage, onBeforeSendUserMessage, currentChannel, isMentionEnabled]);

  const sendFileMessage = useCallback((file: File, quoteMessage?: SendableMessageType): Promise<FileMessage> => {
    const createParamsDefault = () => {
      const params = {} as FileMessageCreateParams;
      params.file = file;
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    const params = onBeforeSendFileMessage?.(file, quoteMessage) ?? createParamsDefault();
    if (!dsSendFileMessage || !currentChannel) {
      logger.warning('Thread | useThreadMessageActions: currentChannel is null. Skipping file message send.');
      return Promise.resolve(null as unknown as FileMessage);
    }
    logger.info('Thread | useThreadMessageActions: Sending file message start.', params);
    let localPreviewUrl: string | undefined;
    return dsSendFileMessage(params, (pendingMessage) => {
      localPreviewUrl = attachLocalFilePreview(pendingMessage, file);
      scrollToLastAfterSend();
    })
      .then((sentMessage) => {
        if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: sentMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
        return sentMessage;
      });
  }, [dsSendFileMessage, onBeforeSendFileMessage, currentChannel]);

  const sendVoiceMessage = useCallback((file: File, duration: number, quoteMessage?: SendableMessageType) => {
    const params: FileMessageCreateParams = (onBeforeSendVoiceMessage && typeof onBeforeSendVoiceMessage === 'function')
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: VOICE_MESSAGE_FILE_NAME,
        mimeType: VOICE_MESSAGE_MIME_TYPE,
        metaArrays: [
          new MessageMetaArray({ key: META_ARRAY_VOICE_DURATION_KEY, value: [`${duration}`] }),
          new MessageMetaArray({ key: META_ARRAY_MESSAGE_TYPE_KEY, value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE] }),
        ],
      };
    if (quoteMessage) {
      params.isReplyToChannel = true;
      params.parentMessageId = quoteMessage.messageId;
    }
    if (!dsSendFileMessage || !currentChannel) return;
    logger.info('Thread | useThreadMessageActions: Sending voice message start.', params);
    let localPreviewUrl: string | undefined;
    dsSendFileMessage(params, (pendingMessage) => {
      localPreviewUrl = attachLocalFilePreview(pendingMessage, file);
      scrollToLastAfterSend();
    })
      .then((sentMessage) => {
        if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: sentMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
      })
      .catch((error) => {
        logger.info('Thread | useThreadMessageActions: Sending voice message failed.', error);
      });
  }, [dsSendFileMessage, onBeforeSendVoiceMessage, currentChannel]);

  const sendMultipleFilesMessage = useCallback((files: Array<File>, quoteMessage?: SendableMessageType): Promise<MultipleFilesMessage> => {
    if (files.length <= 1) {
      const error = new Error('Thread | useThreadMessageActions: Sending multiple files message requires at least two files.');
      logger.warning('Thread | useThreadMessageActions: Sending multiple files message failed, because there are no multiple files.', { files, error });
      return Promise.reject(error);
    }
    if (!dsSendMultipleFilesMessage || !currentChannel) {
      const error = new Error('Thread | useThreadMessageActions: Sending multiple files message cannot be sent because current channel or data source is unavailable.');
      logger.warning('Thread | useThreadMessageActions: Sending multiple files message failed, because current channel or data source is unavailable.', {
        currentChannel,
        dsSendMultipleFilesMessage,
        error,
      });
      return Promise.reject(error);
    }
    const createParamsDefault = (): MultipleFilesMessageCreateParams => {
      const params: MultipleFilesMessageCreateParams = {
        fileInfoList: files.map((file: File): UploadableFileInfo => ({
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        })),
      };
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    const params = onBeforeSendMultipleFilesMessage?.(files, quoteMessage) ?? createParamsDefault();
    logger.info('Thread | useThreadMessageActions: Sending multiple files message start.', params);
    return dsSendMultipleFilesMessage(params, () => scrollToLastAfterSend())
      .then((sentMessage) => {
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: sentMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
        return sentMessage;
      });
  }, [dsSendMultipleFilesMessage, onBeforeSendMultipleFilesMessage, currentChannel]);

  const updateMessage = useCallback((props: UpdateMessageParams) => {
    const { messageId, message, mentionedUsers, mentionedUserIds, mentionTemplate } = props;
    const params = {} as UserMessageUpdateParams;
    params.message = message;
    if (isMentionEnabled && mentionedUserIds) {
      params.mentionedUserIds = mentionedUserIds;
    } else if (isMentionEnabled && mentionedUsers) {
      params.mentionedUsers = mentionedUsers;
    }
    if (isMentionEnabled && mentionTemplate) {
      params.mentionedMessageTemplate = mentionTemplate;
    } else {
      params.mentionedMessageTemplate = message;
    }
    if (!dsUpdateUserMessage || !currentChannel) return;
    logger.info('Thread | useThreadMessageActions: Message update start.', params);
    dsUpdateUserMessage(messageId, params)
      .then((updatedMessage) => {
        pubSub.publish(topics.UPDATE_USER_MESSAGE, {
          fromSelector: true,
          channel: currentChannel,
          message: updatedMessage,
          publishingModules: [PublishingModuleType.THREAD],
        });
      })
      .catch((error) => {
        logger.warning('Thread | useThreadMessageActions: Message update failed.', error);
      });
  }, [dsUpdateUserMessage, currentChannel, isMentionEnabled]);

  const deleteMessage = useCallback((message: SendableMessageType): Promise<void> => {
    if (!dsDeleteMessage) return Promise.resolve();
    logger.info('Thread | useThreadMessageActions: Deleting message.', message);
    return dsDeleteMessage(message as UserMessage | FileMessage | MultipleFilesMessage);
  }, [dsDeleteMessage]);

  const resendMessage = useCallback((failedMessage: SendableMessageType) => {
    if (!(failedMessage as SendableMessageType)?.isResendable || !dsResendMessage || !currentChannel) {
      logger.warning('Thread | useThreadMessageActions: Message is not resendable.', failedMessage);
      return;
    }
    logger.info('Thread | useThreadMessageActions: Resending message start.', failedMessage);
    dsResendMessage(failedMessage as UserMessage | FileMessage | MultipleFilesMessage)
      .then((sentMessage) => {
        const isUserMessage = (sentMessage as SendableMessageType)?.isUserMessage?.();
        pubSub.publish(isUserMessage ? topics.SEND_USER_MESSAGE : topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: sentMessage as SendableMessageType,
          publishingModules: [PublishingModuleType.THREAD],
        });
      })
      .catch((error) => {
        logger.warning('Thread | useThreadMessageActions: Resending message failed.', error);
      });
  }, [dsResendMessage, currentChannel]);

  return useMemo(() => ({
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
    updateMessage,
    deleteMessage,
    resendMessage,
  }), [
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
    updateMessage,
    deleteMessage,
    resendMessage,
  ]);
}

export default useThreadMessageActions;
