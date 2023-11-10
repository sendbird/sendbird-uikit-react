import React, { useCallback } from 'react';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { FileMessage, FileMessageCreateParams } from '@sendbird/chat/message';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import * as utils from '../utils';
import topics, { SBUGlobalPubSub } from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { LoggerInterface } from '../../../../lib/Logger';
import { SendableMessageType } from '../../../../utils';
import { SendBirdState } from '../../../../lib/types';

type UseSendFileMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  onBeforeSendFileMessage?: (file: File, quoteMessage: SendableMessageType | null) => FileMessageCreateParams;
  imageCompression?: SendBirdState['config']['imageCompression'];
};
type UseSendFileMessageCallbackParams = {
  logger: LoggerInterface;
  pubSub: SBUGlobalPubSub;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
export default function useSendFileMessageCallback(
  { currentGroupChannel, onBeforeSendFileMessage, imageCompression }: UseSendFileMessageCallbackOptions,
  { logger, pubSub, scrollRef, messagesDispatcher }: UseSendFileMessageCallbackParams,
) {
  const sendMessage = useCallback(
    (compressedFile: File, quoteMessage = null) => new Promise<FileMessage>((resolve, reject) => {
      // Create FileMessageParams
      let params: FileMessageCreateParams = onBeforeSendFileMessage?.(compressedFile, quoteMessage);
      if (!params) {
        params = { file: compressedFile };
        if (quoteMessage) {
          params.isReplyToChannel = true;
          params.parentMessageId = quoteMessage.messageId;
        }
      }

      // Send FileMessage
      logger.info('Channel: Uploading file message start!', params);
      currentGroupChannel
        .sendFileMessage(params)
        .onPending((pendingMessage) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            /* pubSub is used instead of messagesDispatcher
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
            message: {
              ...pendingMessage,
              url: URL.createObjectURL(compressedFile),
              // pending thumbnail message seems to be failed
              requestState: 'pending',
            } as unknown as FileMessage,
            channel: currentGroupChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          });
          setTimeout(() => utils.scrollIntoLast(0, scrollRef), 1000);
        })
        .onFailed((err, failedMessage) => {
          logger.error('Channel: Sending file message failed!', { failedMessage, err });

          // TODO: v4 - remove logic that modifies the original object.
          //  It makes the code difficult to track, likely causing unpredictable side effects.
          // @ts-ignore eslint-disable-next-line no-param-reassign
          failedMessage.localUrl = URL.createObjectURL(compressedFile);
          // @ts-ignore eslint-disable-next-line no-param-reassign
          failedMessage.file = compressedFile;

          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_FAILURE,
            payload: failedMessage as SendableMessageType,
          });
          reject(err);
        })
        .onSucceeded((succeededMessage) => {
          logger.info('Channel: Sending file message success!', succeededMessage);
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGE_SUCCESS,
            payload: succeededMessage as SendableMessageType,
          });
          resolve(succeededMessage as FileMessage);
        });
    }),
    [currentGroupChannel, onBeforeSendFileMessage, imageCompression],
  );
  return [sendMessage];
}
