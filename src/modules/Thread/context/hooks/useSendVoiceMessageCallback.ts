import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams, MessageMetaArray } from '@sendbird/chat/message';
import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { ThreadContextActionTypes } from '../dux/actionTypes';
import topics from '../../../../lib/pubSub/topics';
import { scrollIntoLast } from '../utils';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';

interface DynamicParams {
  currentChannel: GroupChannel;
  onBeforeSendVoiceMessage?: (file: File, quoteMessage?: SendableMessageType) => FileMessageCreateParams;
}
interface StaticParams {
  logger: Logger;
  pubSub: any;
  threadDispatcher: CustomUseReducerDispatcher;
}
type FuncType = (file: File, duration: number, quoteMessage: SendableMessageType) => void;
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
  const sendMessage = useCallback((file: File, duration: number, quoteMessage: SendableMessageType) => {
    const messageParams: FileMessageCreateParams = (
      onBeforeSendVoiceMessage
      && typeof onBeforeSendVoiceMessage === 'function'
    )
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: VOICE_MESSAGE_FILE_NAME,
        mimeType: VOICE_MESSAGE_MIME_TYPE,
        metaArrays: [
          new MessageMetaArray({
            key: META_ARRAY_VOICE_DURATION_KEY,
            value: [`${duration}`],
          }),
          new MessageMetaArray({
            key: META_ARRAY_MESSAGE_TYPE_KEY,
            value: [META_ARRAY_MESSAGE_TYPE_VALUE__VOICE],
          }),
        ],
      };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    logger.info('Thread | useSendVoiceMessageCallback:  Start sending voice message', messageParams);
    currentChannel?.sendFileMessage(messageParams)
      .onPending((pendingMessage) => {
        threadDispatcher({
          type: ThreadContextActionTypes.SEND_MESSAGE_START,
          payload: {
            /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
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
