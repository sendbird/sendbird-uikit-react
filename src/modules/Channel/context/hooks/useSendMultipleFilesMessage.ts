import { useCallback } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type {
  MultipleFilesMessageCreateParams,
  UploadableFileInfo,
} from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import type { Nullable } from '../../../../types';
import PUBSUB_TOPICS from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import { SendableMessageType } from '../../../../utils';

export type OnBeforeSendMFMType = (
  files: Array<File>,
  quoteMessage?: SendableMessageType,
) => MultipleFilesMessageCreateParams;

export interface UseSendMFMDynamicParams {
  currentChannel: Nullable<GroupChannel>,
  onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType,
}
export interface UseSendMFMStaticParams {
  logger: Logger,
  pubSub: any,
  scrollRef?: React.RefObject<HTMLDivElement>;
}
export type SendMFMFunctionType = (files: Array<File>, quoteMessage?: SendableMessageType) => void;

/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
export const useSendMultipleFilesMessage = ({
  currentChannel,
  onBeforeSendMultipleFilesMessage,
}: UseSendMFMDynamicParams, {
  logger,
  pubSub,
  scrollRef,
}: UseSendMFMStaticParams): Array<SendMFMFunctionType> => {
  const sendMessage = useCallback((files: Array<File>, quoteMessage?: SendableMessageType): void => {
    if (!currentChannel) {
      logger.warning('Channel: Sending MFm failed, because currentChannel is null.', { currentChannel });
      return;
    }
    if (files.length <= 1) {
      logger.warning('Channel: Sending MFM failed, because there are no multiple files.', { files });
      return;
    }
    let messageParams: MultipleFilesMessageCreateParams = {
      fileInfoList: files.map((file: File): UploadableFileInfo => ({
        file,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      })),
    };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    if (typeof onBeforeSendMultipleFilesMessage === 'function') {
      messageParams = onBeforeSendMultipleFilesMessage(files, quoteMessage);
    }
    logger.info('Channel: Start sending MFM', { messageParams });
    try {
      currentChannel.sendMultipleFilesMessage(messageParams)
        /**
         * We don't operate the onFileUploaded event for now
         * until we will add UI/UX for it
         */
        .onFileUploaded((requestId, index, uploadableFileInfo, error) => {
          logger.info('Channel: onFileUploaded during sending MFM', { requestId, index, error, uploadableFileInfo });
        })
        .onPending((pendingMessage) => {
          pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_START, {
            message: pendingMessage,
            channel: currentChannel,
          });
          if (scrollRef) {
            setTimeout(() => scrollIntoLast(0, scrollRef));
          }
        })
        .onFailed((error, failedMessage) => {
          logger.error('Channel: Sending MFM failed.', { error, failedMessage });
          pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, {
            channel: currentChannel,
            message: failedMessage,
          });
        })
        .onSucceeded((succeededMessage) => {
          logger.info('Channel: Sending voice message success!', { succeededMessage });
          pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
            channel: currentChannel,
            message: succeededMessage,
          });
        });
    } catch (error) {
      logger.error('Channel: Sending MFM failed.', { error });
    }
  }, [
    currentChannel,
    onBeforeSendMultipleFilesMessage,
  ]);
  return [sendMessage];
};
