import { useCallback } from "react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { FileMessage, FileMessageCreateParams } from "@sendbird/chat/message";

import { CustomUseReducerDispatcher, Logger } from "../../../../lib/SendbirdState";
import { ThreadContextActionTypes } from "../dux/actionTypes";
import * as topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from "../utils";

interface DynamicProps {
  currentChannel: GroupChannel;
}
interface StaticProps {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}

interface LocalFileMessage extends FileMessage {
  localUrl: string;
  file: File;
}

export default function useSendFileMessageCallback({
  currentChannel,
}: DynamicProps, {
  logger,
  pubSub,
  threadDispatcher,
}: StaticProps) {
  const sendMessage = useCallback((file, quoteMessage) => {
    const createParamsDefault = () => {
      const params = {} as FileMessageCreateParams;
      params.file = file;
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };
    const params = createParamsDefault();

    currentChannel?.sendFileMessage(params)
      .onPending((pendingMessage) => {
        threadDispatcher({
          type: ThreadContextActionTypes.SEND_MESSAGE_START,
          payload: {
            /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
            message: {
              ...pendingMessage,
              url: URL.createObjectURL(file),
              // pending thumbnail message seems to be failed
              requestState: 'pending',
            },
          },
        });
        setTimeout(() => scrollIntoLast(), 1000);
      })
      .onFailed((error, message) => {
        (message as LocalFileMessage).localUrl = URL.createObjectURL(file);
        (message as LocalFileMessage).file = file;
        threadDispatcher({
          type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
          payload: { message, error },
        });
      })
      .onSucceeded((message) => {
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: message,
        });
      });
  }, [currentChannel]);
  return sendMessage;
}
