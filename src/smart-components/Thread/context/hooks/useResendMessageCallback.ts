import { GroupChannel } from "@sendbird/chat/groupChannel";
import { FileMessage, MessageType, SendingStatus, UserMessage } from "@sendbird/chat/message";
import { useCallback } from "react";
import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import { ThreadContextActionTypes } from "../dux/actionTypes";
import * as topics from '../../../../lib/pubSub/topics';

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
}: StaticProps) {
  return useCallback((failedMessage: UserMessage | FileMessage) => {
    if ((failedMessage as UserMessage | FileMessage)?.isResendable) {
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
