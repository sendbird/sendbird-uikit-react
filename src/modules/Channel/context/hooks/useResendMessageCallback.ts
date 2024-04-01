import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { UploadableFileInfo } from '@sendbird/chat/message';
import topics, { PublishingModuleType, SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { SBUEventHandlers } from '../../../../lib/types';

type UseResendMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type UseResendMessageCallbackParams = {
  logger: LoggerInterface;
  eventHandlers?: SBUEventHandlers
  pubSub: SBUGlobalPubSub;
};

function useResendMessageCallback(
  { currentGroupChannel, messagesDispatcher }: UseResendMessageCallbackOptions,
  { logger, eventHandlers, pubSub }: UseResendMessageCallbackParams,
) {
  return useCallback(
    (failedMessage: SendableMessageType): void => {
      logger.info('Channel: Resending message has started', failedMessage);
      if (failedMessage?.isResendable) {
        // userMessage
        if (failedMessage.isUserMessage()) {
          currentGroupChannel
            .resendMessage(failedMessage)
            .onPending((message) => {
              logger.info('Channel: Resending message start!', message);
              messagesDispatcher({
                type: messageActionTypes.RESEND_MESSAGE_START,
                payload: message,
              });
            })
            .onSucceeded((message) => {
              logger.info('Channel: Resending message success!', message);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_SUCCESS,
                payload: message,
              });
            })
            .onFailed((e, message) => {
              logger.warning('Channel: Resending message failed!', e);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_FAILURE,
                payload: message,
              });
            });
        } else if (failedMessage.isFileMessage()) {
          currentGroupChannel
            .resendMessage(failedMessage)
            .onPending((message) => {
              logger.info('Channel: Resending file message start!', message);
              messagesDispatcher({
                type: messageActionTypes.RESEND_MESSAGE_START,
                payload: message,
              });
            })
            .onSucceeded((message) => {
              logger.info('Channel: Resending file message success!', message);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_SUCCESS,
                payload: message,
              });
            })
            .onFailed((e, message) => {
              logger.warning('Channel: Resending file message failed!', e);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_FAILURE,
                payload: message,
              });
            });
        } else if (failedMessage.isMultipleFilesMessage()) {
          currentGroupChannel
            .resendMessage(failedMessage)
            .onPending((message) => {
              logger.info('Channel: Resending multiple files message start!', message);
              messagesDispatcher({
                type: messageActionTypes.RESEND_MESSAGE_START,
                payload: message,
              });
            })
            .onFileUploaded((requestId, index, uploadableFileInfo: UploadableFileInfo, error) => {
              logger.info('Channel: Resending multiple files message file uploaded!', {
                requestId,
                index,
                error,
                uploadableFileInfo,
              });
              pubSub.publish(topics.ON_FILE_INFO_UPLOADED, {
                response: {
                  channelUrl: currentGroupChannel.url,
                  requestId,
                  index,
                  uploadableFileInfo,
                  error,
                },
                publishingModules: [PublishingModuleType.CHANNEL],
              });
            })
            .onSucceeded((message) => {
              logger.info('Channel: Resending multiple files message success!', message);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_SUCCESS,
                payload: message,
              });
            })
            .onFailed((e, message) => {
              logger.warning('Channel: Resending multiple files message failed!', e);
              messagesDispatcher({
                type: messageActionTypes.SEND_MESSAGE_FAILURE,
                payload: message,
              });
            });
        }
      } else {
        logger.error('Message is not resendable', failedMessage);
        eventHandlers?.request?.onFailed?.(new Error('Message is not resendable'));
      }
    },
    [currentGroupChannel, messagesDispatcher],
  );
}

export default useResendMessageCallback;
