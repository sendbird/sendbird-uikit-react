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
import { SBUEventHandlers, SendBirdState } from '../../../../lib/types';
import { SCROLL_BOTTOM_DELAY_FOR_SEND } from '../../../../utils/consts';

type UseSendFileMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  onBeforeSendFileMessage?: (file: File, quoteMessage: SendableMessageType | null) => FileMessageCreateParams;
  imageCompression?: SendBirdState['config']['imageCompression'];
};
type UseSendFileMessageCallbackParams = {
  logger: LoggerInterface;
  eventHandlers?: SBUEventHandlers
  pubSub: SBUGlobalPubSub;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
export default function useSendFileMessageCallback(
  { currentGroupChannel, onBeforeSendFileMessage, imageCompression }: UseSendFileMessageCallbackOptions,
  { logger,eventHandlers,  pubSub, scrollRef, messagesDispatcher }: UseSendFileMessageCallbackParams,
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
            // TODO: remove data pollution
            message: {
              ...pendingMessage,
              url: URL.createObjectURL(compressedFile),
              // pending thumbnail message seems to be failed
              requestState: 'pending',
              isUserMessage: pendingMessage.isUserMessage,
              isFileMessage: pendingMessage.isFileMessage,
              isAdminMessage: pendingMessage.isAdminMessage,
              isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
            } as unknown as FileMessage,
            channel: currentGroupChannel,
            publishingModules: [PublishingModuleType.CHANNEL],
          });
          setTimeout(() => utils.scrollIntoLast(0, scrollRef), SCROLL_BOTTOM_DELAY_FOR_SEND);
        })
        .onFailed((err, failedMessage) => {
          logger.error('Channel: Sending file message failed!', { failedMessage, err });
          eventHandlers?.request?.onFailed?.(err);

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
