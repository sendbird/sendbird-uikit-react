import React, { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import { ChannelActionTypes } from '../dux/actionTypes';
import * as utils from '../utils';
import topics from '../../../../lib/pubSub/topics';
import { PublishingModuleType } from '../../../internalInterfaces';
import { GroupChannel } from '@sendbird/chat/groupChannel';
import { LoggerInterface } from '../../../../lib/Logger';
import { PubSubTypes } from '../../../../lib/pubSub';
import { SendableMessageType } from '../../../../utils';
import { SendBirdState } from '../../../../lib/types';
import { FileMessageCreateParams } from '@sendbird/chat/message';

type UseSendFileMessageCallbackOptions = {
  currentGroupChannel: null | GroupChannel;
  onBeforeSendFileMessage?: (file: File, quoteMessage: SendableMessageType | null) => FileMessageCreateParams;
  imageCompression?: SendBirdState['config']['imageCompression'];
};
type UseSendFileMessageCallbackParams = {
  logger: LoggerInterface;
  pubSub: PubSubTypes;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  messagesDispatcher: React.Dispatch<ChannelActionTypes>;
};
export default function useSendFileMessageCallback(
  { currentGroupChannel, onBeforeSendFileMessage, imageCompression }: UseSendFileMessageCallbackOptions,
  { logger, pubSub, scrollRef, messagesDispatcher }: UseSendFileMessageCallbackParams,
) {
  const sendMessage = useCallback(
    (file: File, quoteMessage = null) => new Promise((resolve, reject) => {
      const { compressionRate, resizingWidth, resizingHeight } = imageCompression ?? {};
      const shouldCreateCustomParams = onBeforeSendFileMessage && typeof onBeforeSendFileMessage === 'function';

      const compressibleFileType = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg';
      const compressibleRatio = compressionRate > 0 && compressionRate < 1;
      // pxToNumber returns null if values are invalid
      const compressibleDiamensions = utils.pxToNumber(resizingWidth) || utils.pxToNumber(resizingHeight);

      const canCompressImage = compressibleFileType && (compressibleRatio || compressibleDiamensions);

      const createParamsDefault = (fileToSend: File) => {
        const params: FileMessageCreateParams = {
          file: fileToSend,
        };
        if (quoteMessage) {
          params.isReplyToChannel = true;
          params.parentMessageId = quoteMessage.messageId;
        }
        return params;
      };

      if (canCompressImage) {
        // Using image compression
        try {
          // TODO: Extract image compression logic to utils.
          const image = document.createElement('img');
          image.src = URL.createObjectURL(file);
          image.onload = () => {
            URL.revokeObjectURL(image.src);
            const canvas = document.createElement('canvas');
            const imageWdith = image.naturalWidth || image.width;
            const imageHeight = image.naturalHeight || image.height;

            let targetWidth = utils.pxToNumber(resizingWidth) || imageWdith;
            let targetHeight = utils.pxToNumber(resizingHeight) || imageHeight;

            // In canvas.toBlob(callback, mimeType, qualityArgument)
            // qualityArgument doesnt work
            // so in case compressibleDiamensions are not present, we use ratio
            if (file.type === 'image/png' && !compressibleDiamensions) {
              targetWidth *= compressionRate;
              targetHeight *= compressionRate;
            }

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, targetWidth, targetHeight);
            context.canvas.toBlob(
              (newImageBlob) => {
                const compressedFile = new File([newImageBlob], file.name, { type: file.type });
                if (shouldCreateCustomParams) {
                  logger.info('Channel: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
                }
                const params = shouldCreateCustomParams
                  ? onBeforeSendFileMessage(compressedFile, quoteMessage)
                  : createParamsDefault(compressedFile);
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
                      },
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
                    resolve(succeededMessage);
                  });
              },
              file.type,
              compressionRate,
            );
          };
        } catch (error) {
          logger.error('Channel: Sending file message failed!', error);
          reject(error);
        }
      } else {
        // Not using image compression
        if (shouldCreateCustomParams) {
          logger.info('Channel: creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
        }
        const params = onBeforeSendFileMessage
          ? onBeforeSendFileMessage(file, quoteMessage)
          : createParamsDefault(file);
        logger.info('Channel: Uploading file message start!', params);

        currentGroupChannel
          .sendFileMessage(params)
          .onPending((pendingMsg) => {
            pubSub.publish(topics.SEND_MESSAGE_START, {
              /* pubSub is used instead of messagesDispatcher
                to avoid redundantly calling `messageActionTypes.SEND_MESSAGE_START` */
              message: {
                ...pendingMsg,
                // TODO: v4 - remove logic that modifies the original object.
                //  It makes the code difficult to track, likely causing unpredictable side effects.
                url: URL.createObjectURL(file),
                // pending thumbnail message seems to be failed
                requestState: 'pending',
              },
              channel: currentGroupChannel,
              publishingModules: [PublishingModuleType.CHANNEL],
            });
            setTimeout(() => utils.scrollIntoLast(0, scrollRef), 1000);
          })
          .onFailed((error, message) => {
            logger.error('Channel: Sending file message failed!', { message, error });

            // TODO: v4 - remove logic that modifies the original object.
            //  It makes the code difficult to track, likely causing unpredictable side effects.
            // @ts-ignore eslint-disable-next-line no-param-reassign
            message.localUrl = URL.createObjectURL(file);
            // @ts-ignore eslint-disable-next-line no-param-reassign
            message.file = file;

            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_FAILURE,
              payload: message as SendableMessageType,
            });
            reject(error);
          })
          .onSucceeded((message) => {
            logger.info('Channel: Sending message success!', message);
            messagesDispatcher({
              type: messageActionTypes.SEND_MESSAGE_SUCCESS,
              payload: message as SendableMessageType,
            });
            resolve(message);
          });
      }
    }),
    [currentGroupChannel, onBeforeSendFileMessage, imageCompression],
  );
  return [sendMessage];
}
