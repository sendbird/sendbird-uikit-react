import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';

type UseResendMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
type UseResendMessageCallbackParams = {
  logger: LoggerInterface;
};

function useResendMessageCallback(
  { currentGroupChannel, messagesDispatcher }: UseResendMessageCallbackOptions,
  { logger }: UseResendMessageCallbackParams,
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
              messagesDispatcher({
                type: messageActionTypes.RESEND_MESSAGE_START,
                payload: message,
              });
            })
            // TODO: Handle on file info upload event.
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
      }
    },
    [currentGroupChannel, messagesDispatcher],
  );
}

export default useResendMessageCallback;
