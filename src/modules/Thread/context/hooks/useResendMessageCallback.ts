import { GroupChannel } from '@sendbird/chat/groupChannel';
import {FileMessage, MessageType, MultipleFilesMessage, SendingStatus, UserMessage} from '@sendbird/chat/message';
import { useCallback } from 'react';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics from '../../../../lib/pubSub/topics';
import { SendableMessageType } from '../../../../utils';

interface DynamicProps {
  currentChannel: GroupChannel;
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
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
      failedMessage.sendingStatus = SendingStatus.PENDING;
      logger.info('Thread | useResendMessageCallback: Resending failedMessage start.', failedMessage);
      threadDispatcher({
        type: ThreadContextActionTypes.RESEND_MESSAGE_START,
        payload: failedMessage,
      });

      if (failedMessage?.isUserMessage?.() || failedMessage?.messageType === MessageType.USER) {
        currentChannel?.resendUserMessage(failedMessage as UserMessage)
          .then((message) => {
            logger.info('Thread | useResendMessageCallback: Resending failedMessage succeeded.', message);
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
              payload: { message },
            });
            pubSub.publish(topics.SEND_USER_MESSAGE, {
              channel: currentChannel,
              message: message,
            });
          })
          .catch((error) => {
            logger.warning('Thread | useResendMessageCallback: Resending failedMessage failed.', error);
            failedMessage.sendingStatus = SendingStatus.FAILED;
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
              payload: { message: failedMessage },
            });
          });
      } else if (failedMessage?.isFileMessage?.() || failedMessage?.messageType === MessageType.FILE) {
        currentChannel?.resendFileMessage?.(failedMessage as FileMessage)
          .then((message) => {
            logger.info('Thread | useResendMessageCallback: Resending failedMessage succeeded.', message);
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
              payload: { message },
            });
          })
          .catch((error) => {
            logger.warning('Thread | useResendMessageCallback: Resending failedMessage failed.', error);
            failedMessage.sendingStatus = SendingStatus.FAILED;
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
              payload: { message: failedMessage },
            });
            pubSub.publish(topics.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message: failedMessage,
            });
          });
      } else if (failedMessage?.isMultipleFilesMessage?.()) {
        currentChannel?.resendMessage?.(failedMessage as MultipleFilesMessage)
          // TODO: Handle on pending event (Same goes for the other message types).
          // TODO: Handle on file info upload event.
          .onSucceeded((message: MultipleFilesMessage) => {
            logger.info('Thread | useResendMessageCallback: Resending failedMessage succeeded.', message);
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_SUCESS,
              payload: { message },
            });
          })
          .onFailed((error: Error, message: MultipleFilesMessage) => {
            logger.warning('Thread | useResendMessageCallback: Resending failedMessage failed.', error);
            threadDispatcher({
              type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
              payload: { message },
            });
            pubSub.publish(topics.SEND_FILE_MESSAGE, {
              channel: currentChannel,
              message,
            });
          });
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
