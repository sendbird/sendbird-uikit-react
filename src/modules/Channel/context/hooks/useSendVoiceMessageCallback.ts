import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams, MessageMetaArray, UserMessage } from '@sendbird/chat/message';
import { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import topics from '../../../../lib/pubSub/topics';
import {
  META_ARRAY_MESSAGE_TYPE_KEY,
  META_ARRAY_MESSAGE_TYPE_VALUE__VOICE,
  META_ARRAY_VOICE_DURATION_KEY,
  VOICE_MESSAGE_FILE_NAME,
  VOICE_MESSAGE_MIME_TYPE,
} from '../../../../utils/consts';

interface DynamicParams {
  currentGroupChannel: GroupChannel;
  onBeforeSendVoiceMessage?: (file: File, quoteMessage?: UserMessage | FileMessage) => FileMessageCreateParams;
}
interface StaticParams {
  logger: Logger;
  pubSub: any;
  scrollRef: React.RefObject<HTMLDivElement>;
  messagesDispatcher: (props: { type: string, payload: any }) => void;
}
type FuncType = (file: File, duration: number, quoteMessage: UserMessage | FileMessage) => void;

export const useSendVoiceMessageCallback = ({
  currentGroupChannel,
  onBeforeSendVoiceMessage,
}: DynamicParams,
{
  logger,
  pubSub,
  scrollRef,
  messagesDispatcher,
}: StaticParams): Array<FuncType> => {
  const sendMessage = useCallback((file: File, duration: number, quoteMessage: UserMessage | FileMessage) => {
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
    logger.info('Channel: Start sending voice message', messageParams);
    currentGroupChannel.sendFileMessage(messageParams)
      .onPending((pendingMessage) => {
        pubSub.publish(topics.SEND_MESSAGE_START, {
          /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
          message: pendingMessage,
          channel: currentGroupChannel,
        });
        setTimeout(() => utils.scrollIntoLast(0, scrollRef), 1000);
      })
      .onFailed((err, failedMessage) => {
        logger.error('Channel: Sending voice message failed!', { failedMessage, err });
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGE_FAILURE,
          payload: failedMessage,
        });
      })
      .onSucceeded((succeededMessage) => {
        logger.info('Channel: Sending voice message success!', succeededMessage);
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGE_SUCESS,
          payload: succeededMessage,
        });
      });
  }, [
    currentGroupChannel,
    onBeforeSendVoiceMessage,
  ]);
  return [sendMessage];
};

export default useSendVoiceMessageCallback;
