// import Sendbird from 'sendbird';
import Sendbird from '../../../sendbird.min.js';
import { useCallback } from 'react';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface MainProps {
  currentOpenChannel: SendbirdUIKit.OpenChannelType;
  onBeforeSendFileMessage: (file: File) => Sendbird.FileMessageParams;
  checkScrollBottom: () => boolean;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
}
interface ToolProps {
  sdk: SendbirdUIKit.Sdk;
  logger: SendbirdUIKit.Logger;
  messagesDispatcher: ({ type: string, payload: any }) => void;
}

type CallbackReturn = (file: File) => void;

function useFileUploadCallback(
  {
    currentOpenChannel,
    checkScrollBottom,
    imageCompression = {},
    onBeforeSendFileMessage,
  }: MainProps,
  { sdk, logger, messagesDispatcher }: ToolProps,
): CallbackReturn {
  return useCallback((file) => {
    if (sdk && sdk.FileMessageParams) {
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

      const createParamsDefault = (file_): Sendbird.FileMessageParams => {
        const params = new sdk.FileMessageParams();
        params.file = file_;
        return params;
      };

      if (canCompressImage) { // Using image compression
        try {
          const image: HTMLImageElement = document.createElement('img');
          image.src = URL.createObjectURL(file);
          image.onload = () => {
            URL.revokeObjectURL(image.src);
            const canvas = document.createElement('canvas');
            const imageWidth = image.naturalWidth || image.width;
            const imageHeight = image.naturalHeight || image.height;
            let targetWidth = utils.pxToNumber(resizingWidth) || imageWidth;
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
                  logger.info('OpenChannel | useFileUploadCallback: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
                }
                const params = onBeforeSendFileMessage ? onBeforeSendFileMessage(compressedFile) : createParamsDefault(compressedFile);
                logger.info('OpenChannel | useFileUploadCallback: Uploading file message start', params);

                const isBottom = checkScrollBottom();
                const pendingMessage = currentOpenChannel.sendFileMessage(
                  params,
                  (message: SendbirdUIKit.ClientFileMessage, error) => {
                    if (!error) {
                      logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
                      messagesDispatcher({
                        type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
                        payload: message,
                      });
                      if (isBottom) {
                        setTimeout(() => {
                          utils.scrollIntoLast();
                        });
                      }
                    } else {
                      logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', { message, error });
                      message.localUrl = URL.createObjectURL(file);
                      message.file = file;
                      messagesDispatcher({
                        type: messageActionTypes.SENDING_MESSAGE_FAILED,
                        payload: message,
                      });
                    }
                  },
                );

                messagesDispatcher({
                  type: messageActionTypes.SENDING_MESSAGE_START,
                  payload: {
                    message: {
                      ...pendingMessage,
                      url: URL.createObjectURL(file),
                      // pending thumbnail message seems to be failed
                      requestState: 'pending',
                    },
                    channel: currentOpenChannel,
                  }
                });
              },
              file.type,
              compressionRate,
            );
          }
        } catch (error) {
          logger.warning('OpenChannel | useFileUploadCallback: Sending file message with image compression failed', error);
        }
      } else { // Not using image compression
        if (createCustomParams) {
          logger.info('OpenChannel | useFileUploadCallback: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
        }
        const params = onBeforeSendFileMessage ? onBeforeSendFileMessage(file) : createParamsDefault(file);
        logger.info('OpenChannel | useFileUploadCallback: Uploading file message start', params);

        const isBottom = checkScrollBottom();
        const pendingMessage = currentOpenChannel.sendFileMessage(
          params,
          (message: SendbirdUIKit.ClientFileMessage, error) => {
            if (!error) {
              logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
                payload: message,
              });
              if (isBottom) {
                setTimeout(() => {
                  utils.scrollIntoLast();
                });
              }
            } else {
              logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', { message, error });
              message.localUrl = URL.createObjectURL(file);
              message.file = file;
              messagesDispatcher({
                type: messageActionTypes.SENDING_MESSAGE_FAILED,
                payload: message,
              });
            }
          }
        );

        messagesDispatcher({
          type: messageActionTypes.SENDING_MESSAGE_START,
          payload: {
            message: {
              ...pendingMessage,
              url: URL.createObjectURL(file),
              // pending thumbnail message seems to be failed
              requestState: 'pending',
            },
            channel: currentOpenChannel,
          }
        });
      }
    }
  }, [currentOpenChannel, onBeforeSendFileMessage, checkScrollBottom, imageCompression]);
}

export default useFileUploadCallback;
