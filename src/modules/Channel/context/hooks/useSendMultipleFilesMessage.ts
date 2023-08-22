import { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, MultipleFilesMessageCreateParams, UserMessage } from '@sendbird/chat/message';

import { CustomUseReducerDispatcher, Logger } from '../../../../lib/SendbirdState';
import { scrollIntoLast } from '../utils';
import PUBSUB_TOPICS from '../../../../lib/pubSub/topics';
import * as messageActionTypes from '../dux/actionTypes';

export type OnBeforeSendMFMType = (
  params: MultipleFilesMessageCreateParams,
  quoteMessage?: UserMessage | FileMessage,
) => MultipleFilesMessageCreateParams;

export interface UseSendMFMDynamicParams {
  currentChannel: GroupChannel,
  onBeforeSendMultipleFilesMessage?: OnBeforeSendMFMType,
}
export interface UseSendMFMStaticParams {
  logger: Logger,
  pubSub: any,
  scrollRef: React.RefObject<HTMLDivElement>;
  messagesDispatcher: CustomUseReducerDispatcher;
}
type FunctionType = (files: Array<File>, quoteMessage?: UserMessage | FileMessage) => void;

export const useSendMultipleFilesMessage = ({
  currentChannel,
  onBeforeSendMultipleFilesMessage,
}: UseSendMFMDynamicParams, {
  logger,
  pubSub,
  scrollRef,
  messagesDispatcher,
}: UseSendMFMStaticParams): Array<FunctionType> => {
  const sendMessage = useCallback((files: Array<File>, quoteMessage?: UserMessage | FileMessage): void => {
    if (files.length <= 1) {
      logger.error('Channel: Sending MFM failed, because there are no multiple files.', { files });
      return;
    }
    let messageParams: MultipleFilesMessageCreateParams = {
      fileInfoList: files.map((file) => ({ file })),
    };
    if (quoteMessage) {
      messageParams.isReplyToChannel = true;
      messageParams.parentMessageId = quoteMessage.messageId;
    }
    if (typeof onBeforeSendMultipleFilesMessage === 'function') {
      messageParams = onBeforeSendMultipleFilesMessage(messageParams);
    }
    logger.info('Channel: Start sending MFM', { messageParams });
    currentChannel.sendMultipleFilesMessage(messageParams)
      /**
       * We don't operate the onFileUploaded event for now
       * until we will add UI/UX for it
       */
      // .onFileUploaded((requestId, index, uploadableFileInfo, err) => {})
      .onPending((pendingMessage) => {
        /**
         * pubSub is used instead of messagesDispatcher
         * to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START`
         */
        pubSub.publish(PUBSUB_TOPICS.SEND_MESSAGE_START, {
          message: pendingMessage,
          channel: currentChannel,
        });
        setTimeout(() => scrollIntoLast(0, scrollRef));
      })
      .onFailed((error, failedMessage) => {
        logger.error('Channel: Sending MFM failed.', { error, failedMessage });
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGE_FAILURE,
          payload: failedMessage,
        });
      })
      .onSucceeded((succeededMessage) => {
        logger.info('Channel: Sending voice message success!', { succeededMessage });
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
          payload: succeededMessage,
        });
      });
  }, [
    currentChannel,
    onBeforeSendMultipleFilesMessage,
  ]);
  return [sendMessage];
};
