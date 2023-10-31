import type { OpenChannel } from '@sendbird/chat/openChannel';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import { SendableMessageType } from '../../../../utils';
import { Logger } from '../../../../lib/SendbirdState';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
}

type MessagesDispatcherType = { type: string; payload: any };

interface StaticParams {
  logger: Logger;
  messagesDispatcher: (dispatcher: MessagesDispatcherType) => void;
}
type CallbackReturn = (failedMessage: SendableMessageType) => void;

function useResendMessageCallback(
  { currentOpenChannel }: DynamicParams,
  { logger, messagesDispatcher }: StaticParams,
): CallbackReturn {
  return useCallback(
    (failedMessage) => {
      logger.info(
        'OpenChannel | useResendMessageCallback: Resending message has started',
        failedMessage,
      );
      if (
        typeof failedMessage?.isResendable === 'boolean'
        && failedMessage.isResendable
      ) {
        // userMessage
        if (failedMessage.isUserMessage()) {
          currentOpenChannel
            .resendMessage(failedMessage)
            .onPending((message) => {
              messagesDispatcher({
                type: messageActionTypes.RESENDING_MESSAGE_START,
                payload: {
                  channel: currentOpenChannel,
                  message: message,
                },
              });
            })
            .onSucceeded((message) => {
              logger.info(
                'OpenChannel | useResendMessageCallback: Reseding message succeeded',
                message,
              );
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
                payload: message,
              });
            })
            .onFailed((error, message) => {
              logger.warning(
                'OpenChannel | useResendMessageCallback: Resending message failed',
                error,
              );
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_FAILED,
                payload: message,
              });
            });
        }

        // fileMessage
        if (failedMessage.isFileMessage()) {
          currentOpenChannel
            .resendMessage(failedMessage)
            .onPending((message) => {
              messagesDispatcher({
                type: messageActionTypes.RESENDING_MESSAGE_START,
                payload: {
                  channel: currentOpenChannel,
                  message: message,
                },
              });
            })
            .onSucceeded((message) => {
              logger.info(
                'OpenChannel | useResendMessageCallback: Resending file message succeeded',
                message,
              );
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
                payload: message,
              });
            })
            .onFailed((error, message) => {
              logger.warning(
                'OpenChannel | useResendMessageCallback: Resending file message failed',
                error,
              );
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_FAILED,
                payload: message,
              });
            });
        }
      } else {
        // to alert user on console
        // eslint-disable-next-line no-console
        console.error(
          'OpenChannel | useResendMessageCallback: Message is not resendable',
        );
        logger.warning(
          'OpenChannel | useResendMessageCallback: Message is not resendable',
          failedMessage,
        );
      }
    },
    [currentOpenChannel],
  );
}

export default useResendMessageCallback;
