import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../../lib/pubSub/topics';

export default function useSendFileMessageCallback({
  currentGroupChannel,
  onBeforeSendFileMessage,
  imageCompression = {},
}, {
  sdk,
  logger,
  pubSub,
  messagesDispatcher,
}) {
  const sendMessage = useCallback((file, quoteMessage = null) => {
    const {
      compressionRate,
      resizingWidth,
      resizingHeight,
    } = imageCompression;
    const createCustomParams = onBeforeSendFileMessage && typeof onBeforeSendFileMessage === 'function';

    const compressibleFileType = (file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg');
    const compressibleRatio = (compressionRate > 0) && (compressionRate < 1);
    // pxToNumber returns null if values are invalid
    const compressibleDiamensions = utils.pxToNumber(resizingWidth)
      || utils.pxToNumber(resizingHeight);

    const canCompressImage = compressibleFileType && (compressibleRatio || compressibleDiamensions);

    const createParamsDefault = (file_) => {
      const params = {};
      params.file = file_;
      if (quoteMessage) {
        params.isReplyToChannel = true;
        params.parentMessageId = quoteMessage.messageId;
      }
      return params;
    };

    if (canCompressImage) { // Using image compression
      try {
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
              if (createCustomParams) {
                logger.info('Channel: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
              }
              const params = createCustomParams
                ? onBeforeSendFileMessage(compressedFile, quoteMessage)
                : createParamsDefault(compressedFile);
              logger.info('Channel: Uploading file message start!', params);
              currentGroupChannel.sendFileMessage(params)
                .onPending((pendingMessage) => {
                  pubSub.publish(topics.SEND_MESSAGE_START, {
                    /* pubSub is used instead of messagesDispatcher
                      to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
                    message: {
                      ...pendingMessage,
                      url: URL.createObjectURL(compressedFile),
                      // pending thumbnail message seems to be failed
                      requestState: 'pending',
                    },
                    channel: currentGroupChannel,
                  });
                  setTimeout(() => utils.scrollIntoLast(), 1000);
                })
                .onFailed((err, failedMessage) => {
                  logger.error('Channel: Sending file message failed!', { message, err });
                  // eslint-disable-next-line no-param-reassign
                  failedMessage.localUrl = URL.createObjectURL(compressedFile);
                  // eslint-disable-next-line no-param-reassign
                  failedMessage.file = compressedFile;
                  messagesDispatcher({
                    type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
                    payload: failedMessage,
                  });
                })
                .onSucceeded((succeededMessage) => {
                  logger.info('Channel: Sending file message success!', message);
                  messagesDispatcher({
                    type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
                    payload: succeededMessage,
                  });
                });
            },
            file.type,
            compressionRate,
          );
        };
      } catch (error) {
        logger.error('Channel: Sending file message failed!', error);
      }
    } else { // Not using image compression
      if (createCustomParams) {
        logger.info('Channel: creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
      }
      const params = onBeforeSendFileMessage
        ? onBeforeSendFileMessage(file, quoteMessage)
        : createParamsDefault(file);
      logger.info('Channel: Uploading file message start!', params);

      currentGroupChannel.sendFileMessage(params)
        .onPending((pendingMsg) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            /* pubSub is used instead of messagesDispatcher
              to avoid redundantly calling `messageActionTypes.SEND_MESSAGEGE_START` */
            message: {
              ...pendingMsg,
              url: URL.createObjectURL(file),
              // pending thumbnail message seems to be failed
              requestState: 'pending',
            },
            channel: currentGroupChannel,
          });
          setTimeout(() => utils.scrollIntoLast(), 1000);
        })
        .onFailed((error, message) => {
          logger.error('Channel: Sending file message failed!', { message, error });
          // eslint-disable-next-line no-param-reassign
          message.localUrl = URL.createObjectURL(file);
          // eslint-disable-next-line no-param-reassign
          message.file = file;
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
            payload: message,
          });
        })
        .onSucceeded((message) => {
          logger.info('Channel: Sending message success!', message);
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
            payload: message,
          });
        });
    }
  }, [currentGroupChannel, onBeforeSendFileMessage, imageCompression]);
  return [sendMessage];
}
