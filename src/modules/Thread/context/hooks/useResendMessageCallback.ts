import { GroupChannel } from '@sendbird/chat/groupChannel';
import {
  FileMessage,
  MessageType,
  MultipleFilesMessage,
  SendingStatus,
  UploadableFileInfo,
  UserMessage,
} from '@sendbird/chat/message';
import { useCallback } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';
import { PublishingModuleType } from '../../../internalInterfaces';

interface DynamicProps {
  currentChannel: GroupChannel | null;
}
interface StaticProps {
  logger: Logger;
  pubSub: SBUGlobalPubSub;
  threadDispatcher: CustomUseReducerDispatcher;
}

export default function useResendMessageCallback({
  currentChannel,
}: DynamicProps, {
  logger,
  pubSub,
  threadDispatcher,
}: StaticProps): (failedMessage: SendableMessageType) => void {
  return useCallback((failedMessage: SendableMessageType) => {
    if ((failedMessage as SendableMessageType)?.isResendable) {
      logger.info('Thread | useResendMessageCallback: Resending failedMessage start.', failedMessage);
      if (failedMessage?.isUserMessage?.() || failedMessage?.messageType === MessageType.USER) {
        try {
          currentChannel?.resendMessage(failedMessage as UserMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending user message started.', message);
              threadDispatcher({
                type: ThreadContextActionTypes.RESEND_MESSAGE_START,
                payload: { message },
              });
            })
            .onSucceeded((message) => {
              logger.info('Thread | useResendMessageCallback: Resending user message succeeded.', message);
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
                payload: { message },
              });
              pubSub.publish(topics.SEND_USER_MESSAGE, {
                channel: currentChannel,
                message: message,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error) => {
              logger.warning('Thread | useResendMessageCallback: Resending user message failed.', error);
              failedMessage.sendingStatus = SendingStatus.FAILED;
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
                payload: { message: failedMessage },
              });
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending user message failed.', err);
          failedMessage.sendingStatus = SendingStatus.FAILED;
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message: failedMessage },
          });
        }
      } else if (failedMessage?.isFileMessage?.()) {
        try {
          currentChannel?.resendMessage?.(failedMessage as FileMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending file message started.', message);
              threadDispatcher({
                type: ThreadContextActionTypes.RESEND_MESSAGE_START,
                payload: { message },
              });
            })
            .onSucceeded((message) => {
              logger.info('Thread | useResendMessageCallback: Resending file message succeeded.', message);
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
                payload: { message },
              });
              pubSub.publish(topics.SEND_FILE_MESSAGE, {
                channel: currentChannel,
                message: failedMessage,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error) => {
              logger.warning('Thread | useResendMessageCallback: Resending file message failed.', error);
              failedMessage.sendingStatus = SendingStatus.FAILED;
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
                payload: { message: failedMessage },
              });
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending file message failed.', err);
          failedMessage.sendingStatus = SendingStatus.FAILED;
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message: failedMessage },
          });
        }
      } else if (failedMessage?.isMultipleFilesMessage?.()) {
        try {
          currentChannel?.resendMessage?.(failedMessage as MultipleFilesMessage)
            .onPending((message) => {
              logger.info('Thread | useResendMessageCallback: Resending multiple files message started.', message);
              threadDispatcher({
                type: ThreadContextActionTypes.RESEND_MESSAGE_START,
                payload: { message },
              });
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
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
                payload: { message },
              });
              pubSub.publish(topics.SEND_FILE_MESSAGE, {
                channel: currentChannel,
                message,
                publishingModules: [PublishingModuleType.THREAD],
              });
            })
            .onFailed((error, message) => {
              logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', error);
              threadDispatcher({
                type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
                payload: { message },
              });
            });
        } catch (err) {
          logger.warning('Thread | useResendMessageCallback: Resending MFM failed.', err);
          threadDispatcher({
            type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
            payload: { message: failedMessage },
          });
        }
      } else {
        logger.warning('Thread | useResendMessageCallback: Message is not resendable.', failedMessage);
        failedMessage.sendingStatus = SendingStatus.FAILED;
        threadDispatcher({
          type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
          payload: { message: failedMessage },
        });
      }
    }
  }, [currentChannel]);
}
