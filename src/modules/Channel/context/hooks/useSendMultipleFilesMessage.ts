import { useCallback } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import type { MultipleFilesMessageCreateParams, UploadableFileInfo } from '@sendbird/chat/message';
import { MultipleFilesMessage } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import type { Nullable } from '../../../../types';
import PUBSUB_TOPICS from '../../../../lib/pubSub/topics';
import { scrollIntoLast as scrollIntoLastForChannel } from '../utils';
import { SendableMessageType } from '../../../../utils';
import {
  PublishingModuleType,
  shouldPubSubPublishToChannel,
  shouldPubSubPublishToThread,
} from '../../../internalInterfaces';
import { scrollIntoLast as scrollIntoLastForThread } from '../../../Thread/context/utils';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../utils/consts';
import { SBUEventHandlers } from '../../../../lib/types';

export type OnBeforeSendMFMType = (
  files: Array<File>,
  quoteMessage?: SendableMessageType,
) => MultipleFilesMessageCreateParams;

export interface UseSendMFMDynamicParams {
  currentChannel: Nullable<GroupChannel>;
  onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType;
  publishingModules: PublishingModuleType[];
}
export interface UseSendMFMStaticParams {
  logger: Logger,
  eventHandlers?: SBUEventHandlers,
  pubSub: any,
  scrollRef?: React.RefObject<HTMLDivElement>;
}
export interface FileUploadedPayload {
  channelUrl: string,
  requestId: string,
  index: number,
  uploadableFileInfo: UploadableFileInfo,
  error: Error,
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
  eventHandlers,
  pubSub,
  scrollRef,
}: UseSendMFMStaticParams): Array<SendMFMFunctionType> => {
  const sendMessage = useCallback((
    files: Array<File>,
    quoteMessage?: SendableMessageType,
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
            setTimeout(() => {
              if (scrollRef && shouldPubSubPublishToChannel(publishingModules)) {
                scrollIntoLastForChannel(0, scrollRef);
              }
              if (shouldPubSubPublishToThread(publishingModules)) {
                scrollIntoLastForThread(0);
              }
            }, SCROLL_BOTTOM_DELAY_FOR_SEND);
          })
          .onFailed((error, failedMessage: MultipleFilesMessage) => {
            logger.error('Channel: Sending MFM failed.', { error, failedMessage });
            eventHandlers?.request?.onFailed?.(error);
            pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_FAILED, {
              channel: currentChannel,
              message: failedMessage,
              publishingModules,
            });
            reject(error);
          })
          .onSucceeded((succeededMessage: MultipleFilesMessage) => {
            logger.info('Channel: Sending voice message success!', { succeededMessage });
            pubSub.publish(PUBSUB_TOPICS.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: succeededMessage,
              publishingModules,
            });
            resolve(succeededMessage);
          });
      } catch (error) {
        logger.error('Channel: Sending MFM failed.', { error });
        eventHandlers?.request?.onFailed?.(error);
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
