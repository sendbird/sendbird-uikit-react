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
import { MultipleFilesMessage } from '@sendbird/chat/message';

export type OnBeforeSendMFMType = (
  files: Array<File>,
  quoteMessage?: SendableMessageType,
) => MultipleFilesMessageCreateParams;

export enum PublishingModuleType {
  CHANNEL = 'CHANNEL',
  THREAD = 'THREAD',
}

export interface UseSendMFMDynamicParams {
  currentChannel: Nullable<GroupChannel>;
  onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType;
  publishingModules: PublishingModuleType[];
}
export interface UseSendMFMStaticParams {
  logger: Logger,
  pubSub: any,
  scrollRef?: React.RefObject<HTMLDivElement>;
}
export type SendMFMFunctionType = (files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>;

/**
 * pubSub is used instead of messagesDispatcher to avoid redundantly calling
 * because this useSendMultipleFilesMessage is used in the Channel and Thread both
 */
export const useSendMultipleFilesMessage = ({
  currentChannel,
  onBeforeSendMultipleFilesMessage,
  publishingModules,
}: UseSendMFMDynamicParams, {
  logger,
  pubSub,
  scrollRef,
}: UseSendMFMStaticParams): Array<SendMFMFunctionType> => {
  const sendMessage = useCallback((
    files: Array<File>,
    quoteMessage?: SendableMessageType
  ): Promise<MultipleFilesMessage> => {
    return new Promise((resolve, reject) => {
      if (!currentChannel) {
        logger.warning('Channel: Sending MFm failed, because currentChannel is null.', { currentChannel });
        reject();
      }
      if (files.length <= 1) {
        logger.warning('Channel: Sending MFM failed, because there are no multiple files.', { files });
        reject();
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
          .onFileUploaded((requestId, index, uploadableFileInfo: UploadableFileInfo, error) => {
            logger.info('Channel: onFileUploaded during sending MFM', {
              requestId,
              index,
              error,
              uploadableFileInfo,
            });
            pubSub.publish(PUBSUB_TOPICS.ON_FILE_INFO_UPLOADED, {
              response: {
                channelUrl: currentChannel.url,
                requestId,
                index,
                uploadableFileInfo,
                error,
              },
              publishingModules,
            });
          })
          .onPending((pendingMessage: MultipleFilesMessage) => {
            logger.info('Channel: in progress of sending MFM', { pendingMessage, fileInfoList: messageParams.fileInfoList });
            pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_START, {
              message: pendingMessage,
              channel: currentChannel,
              publishingModules,
            });
            if (scrollRef) {
              // We need this delay because rendering MFM takes time due to large image files.
              setTimeout(() => scrollIntoLast(0, scrollRef), 100);
            }
          })
          .onFailed((error, failedMessage: MultipleFilesMessage) => {
            logger.error('Channel: Sending MFM failed.', { error, failedMessage });
            pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, {
              channel: currentChannel,
              message: failedMessage,
              publishingModules,
            });
          })
          .onSucceeded((succeededMessage) => {
            logger.info('Channel: Sending voice message success!', { succeededMessage });
            pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: succeededMessage,
              publishingModules,
            });
            if (scrollRef) {
              // We need this delay because rendering MFM takes time due to large image files.
              setTimeout(() => scrollIntoLast(0, scrollRef), 100);
            }
          });
      } catch (error) {
        logger.error('Channel: Sending MFM failed.', { error });
        reject(error);
      }
    });
  }, [
    currentChannel,
    onBeforeSendMultipleFilesMessage,
    publishingModules,
  ]);
  return [sendMessage];
};
