import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import {
  FileMessage,
  MessageType,
  MultipleFilesMessage,
  SendingStatus,
  UploadableFileInfo,
  UserMessage,
} from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/Sendbird/types';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from '../../../internalInterfaces';

interface DynamicProps {
  currentChannel: GroupChannel | null;
  resendMessageStart: (message: SendableMessageType) => void;
  sendMessageSuccess: (message: SendableMessageType) => void;
  sendMessageFailure: (message: SendableMessageType) => void;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
}

export default function useResendMessageCallback({
  currentChannel,
  resendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
}: DynamicProps, {
  logger,
  pubSub,
}: StaticProps): (failedMessage: SendableMessageType) => void {
  return useCallback((failedMessage: SendableMessageType) => {
    if (!(failedMessage as SendableMessageType)?.isResendable) {
      logger.warning('Thread | useResendMessageCallback: Message is not resendable.', failedMessage);
      return;
    }

    logger.info('Thread | useResendMessageCallback: Resending failedMessage start.', failedMessage);
    if (failedMessage?.isUserMessage?.() || failedMessage?.messageType === MessageType.USER) {
      try {
        currentChannel?.resendMessage(failedMessage as UserMessage)
          .onPending((message) => {
            logger.info('Thread | useResendMessageCallback: Resending user message started.', message);
            resendMessageStart(message);
          })
          .onSucceeded((message) => {
            logger.info('Thread | useResendMessageCallback: Resending user message succeeded.', message);
            sendMessageSuccess(message);
            pubSub.publish(topics.SEND_USER_MESSAGE, {
              channel: currentChannel,
              message: message,
              publishingModules: [PublishingModuleType.THREAD],
            });
          })
          .onFailed((error) => {
            logger.warning('Thread | useResendMessageCallback: Resending user message failed.', error);
            failedMessage.sendingStatus = SendingStatus.FAILED;
            sendMessageFailure(failedMessage);
          });
      } catch (err) {
        logger.warning('Thread | useResendMessageCallback: Resending user message failed.', err);
        failedMessage.sendingStatus = SendingStatus.FAILED;
        sendMessageFailure(failedMessage);
      }
    } else if (failedMessage?.isFileMessage?.()) {
      try {
        currentChannel?.resendMessage?.(failedMessage as FileMessage)
          .onPending((message) => {
            logger.info('Thread | useResendMessageCallback: Resending file message started.', message);
            resendMessageStart(message);
          })
          .onSucceeded((message) => {
            logger.info('Thread | useResendMessageCallback: Resending file message succeeded.', message);
            sendMessageSuccess(message);
            pubSub.publish(topics.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: failedMessage,
              publishingModules: [PublishingModuleType.THREAD],
            });
          })
          .onFailed((error) => {
            logger.warning('Thread | useResendMessageCallback: Resending file message failed.', error);
            failedMessage.sendingStatus = SendingStatus.FAILED;
            sendMessageFailure(failedMessage);
          });
      } catch (err) {
        logger.warning('Thread | useResendMessageCallback: Resending file message failed.', err);
        failedMessage.sendingStatus = SendingStatus.FAILED;
        sendMessageFailure(failedMessage);
      }
    } else if (failedMessage?.isMultipleFilesMessage?.()) {
      try {
        currentChannel?.resendMessage?.(failedMessage as MultipleFilesMessage)
          .onPending((message) => {
            logger.info('Thread | useResendMessageCallback: Resending multiple files message started.', message);
            resendMessageStart(message);
          })
          .onFileUploaded((requestId, index, uploadableFileInfo: UploadableFileInfo, error) => {
            logger.info('Thread | useResendMessageCallback: onFileUploaded during resending multiple files message.', {
              requestId,
              index,
              error,
              uploadableFileInfo,
            });
            pubSub.publish(topics.ON_FILE_INFO_UPLOADED, {
              response: {
                channelUrl: currentChannel.url,
                requestId,
                index,
                uploadableFileInfo,
                error,
              },
              publishingModules: [PublishingModuleType.THREAD],
            });
          })
          .onSucceeded((message: MultipleFilesMessage) => {
            logger.info('Thread | useResendMessageCallback: Resending MFM succeeded.', message);
            sendMessageSuccess(message);
            pubSub.publish(topics.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message,
              publishingModules: [PublishingModuleType.THREAD],
            });
          })
          .onFailed((error, message) => {
            logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', error);
            sendMessageFailure(message);
          });
      } catch (err) {
        logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', err);
        sendMessageFailure(failedMessage);
      }
    } else {
      logger.warning('Thread | useResendMessageCallback: Message is not resendable.', failedMessage);
      failedMessage.sendingStatus = SendingStatus.FAILED;
      sendMessageFailure(failedMessage);
    }
  }, [currentChannel]);
}
