import { useCallback } from 'react';

import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import * as topics from '../../../lib/pubSub/topics';

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
  const sendMessage = useCallback((file) => {
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
      const params = new sdk.FileMessageParams();
      params.file = file_;
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
                ? onBeforeSendFileMessage(compressedFile)
                : createParamsDefault(compressedFile);
              logger.info('Channel: Uploading file message start!', params);
              const pendingMessage = currentGroupChannel.sendFileMessage(
                params,
                (response, err) => {
                  const swapParams = sdk.getErrorFirstCallback();
                  const [message, error] = swapParams ? [err, response] : [response, err];
                  if (error) {
                    // sending params instead of pending message
                    // to make sure that we can resend the message once it fails
                    logger.error('Channel: Sending file message failed!', { message, error });
                    message.localUrl = URL.createObjectURL(compressedFile);
                    message.file = compressedFile;
                    messagesDispatcher({
                      type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
                      payload: message,
                    });
                    return;
                  }
                  logger.info('Channel: Sending file message success!', message);
                  messagesDispatcher({
                    type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
                    payload: message,
                  });
                },
              );
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
        ? onBeforeSendFileMessage(file)
        : createParamsDefault(file);
      logger.info('Channel: Uploading file message start!', params);

      const pendingMsg = currentGroupChannel.sendFileMessage(params, (response, err) => {
        const swapParams = sdk.getErrorFirstCallback();
        const [message, error] = swapParams ? [err, response] : [response, err];
        if (error) {
          // sending params instead of pending message
          // to make sure that we can resend the message once it fails
          logger.error('Channel: Sending file message failed!', { message, error });
          message.localUrl = URL.createObjectURL(file);
          message.file = file;
          messagesDispatcher({
            type: messageActionTypes.SEND_MESSAGEGE_FAILURE,
            payload: message,
          });
          return;
        }
        logger.info('Channel: Sending message success!', message);
        messagesDispatcher({
          type: messageActionTypes.SEND_MESSAGEGE_SUCESS,
          payload: message,
        });
      });
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
    }
  }, [currentGroupChannel, onBeforeSendFileMessage, imageCompression]);
  return [sendMessage];
}
