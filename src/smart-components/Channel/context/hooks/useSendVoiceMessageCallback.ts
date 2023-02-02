import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams, MessageMetaArray, UserMessage } from '@sendbird/chat/message';
import { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../../lib/pubSub/topics';

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
    debugger
    const messageParams: FileMessageCreateParams = (
      onBeforeSendVoiceMessage
      && typeof onBeforeSendVoiceMessage === 'function'
    )
      ? onBeforeSendVoiceMessage(file, quoteMessage)
      : {
        file,
        fileName: 'Voice message',
        mimeType: 'voice/mp3',
        metaArrays: [
          new MessageMetaArray({
            key: 'KEY_VOICE_MESSAGE_DURATION',
            value: [`${duration}`],
          })
        ],
      };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    currentGroupChannel.sendFileMessage(messageParams)
      .onPending((pendingMessage) => {
        pubSub.publish(topics.SEND_MESSAGE_START, {
          /* pubSub is used instead of messagesDispatcher
            to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
          message: pendingMessage,
          channel: currentGroupChannel,
        });
        setTimeout(() => utils.scrollIntoLast(0, scrollRef), 1000);
      })
      .onFailed((err, failedMessage) => {
        logger.error('Channel: Sending voice message failed!', { failedMessage, err });
        // // eslint-disable-next-line no-param-reassign
        // failedMessage.localUrl = URL.createObjectURL(file);
        // // eslint-disable-next-line no-param-reassign
        // failedMessage.file = file;
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
          payload: failedMessage,
        });
      })
      .onSucceeded((succeededMessage) => {
        logger.info('Channel: Sending voice message success!', succeededMessage);
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
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
