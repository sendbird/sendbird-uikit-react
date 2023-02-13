import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams, MessageMetaArray, UserMessage } from '@sendbird/chat/message';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from "../dux/actionTypes";
import * as topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from "../utils";

interface DynamicParams {
  currentChannel: GroupChannel;
  onBeforeSendVoiceMessage?: (file: File, quoteMessage?: UserMessage | FileMessage) => FileMessageCreateParams;
}
interface StaticParams {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}
type FuncType = (file: File, duration: number, quoteMessage: UserMessage | FileMessage) => void;
interface LocalFileMessage extends FileMessage {
  localUrl: string;
  file: File;
}

export const useSendVoiceMessageCallback = ({
  currentChannel,
  onBeforeSendVoiceMessage,
}: DynamicParams,
  {
    logger,
    pubSub,
    threadDispatcher,
  }: StaticParams): FuncType => {
  const sendMessage = useCallback((file: File, duration: number, quoteMessage: UserMessage | FileMessage) => {
    const messageParams: FileMessageCreateParams = (
      onBeforeSendVoiceMessage
      && typeof onBeforeSendVoiceMessage === 'function'
    )
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: 'Voice message.mp3',
        mimeType: 'audio/mp3;sbu_type=voice',
        metaArrays: [
          new MessageMetaArray({
            key: 'KEY_VOICE_MESSAGE_DURATION',
            value: [`${duration}`],
          }),
          new MessageMetaArray({
            key: 'KEY_INTERNAL_MESSAGE_TYPE',
            value: ['voice/mp3'],
          })
        ],
      };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }

    currentChannel?.sendFileMessage(messageParams)
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
        logger.info('Thread | useSendVoiceMessageCallback: Sending voice message failed.', { message, error });
        threadDispatcher({
          type: ThreadContextActionTypes.SEND_MESSAGE_FAILURE,
          payload: { message, error },
        });
      })
      .onSucceeded((message) => {
        logger.info('Thread | useSendVoiceMessageCallback: Sending voice message succeeded.', message);
        pubSub.publish(topics.SEND_FILE_MESSAGE, {
          channel: currentChannel,
          message: message,
        });
      });
  }, [
    currentChannel,
    onBeforeSendVoiceMessage,
  ]);
  return sendMessage;
};

export default useSendVoiceMessageCallback;
