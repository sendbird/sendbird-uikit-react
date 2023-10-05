import { useCallback } from 'react';
import type { OpenChannel, SendbirdOpenChat } from '@sendbird/chat/openChannel';
import type { FileMessageCreateParams } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';

interface DynamicParams {
  currentOpenChannel: OpenChannel;
  onBeforeSendFileMessage: (file: File) => FileMessageCreateParams;
  checkScrollBottom: () => boolean;
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
}
interface StaticParams {
  sdk: SendbirdOpenChat;
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload: any }) => void;
}

type CallbackReturn = (files: Array<File> | File) => void;

function useFileUploadCallback({
  currentOpenChannel,
  checkScrollBottom,
  imageCompression = {},
  onBeforeSendFileMessage,
}: DynamicParams,
{ sdk, logger, messagesDispatcher, scrollRef }: StaticParams,
): CallbackReturn {
  return useCallback((files) => {
    if (sdk) {
      /**
       * OpenChannel does not currently support file lists.
       * However, this change is made to maintain interface consistency with group channels.
       */
      const file = Array.isArray(files) ? files[0] : files;
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

      const createParamsDefault = (file_): FileMessageCreateParams => {
        const params: FileMessageCreateParams = {};
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
                currentOpenChannel.sendFileMessage(params)
                  .onPending((pendingMessage) => {
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
                      },
                    });
                  })
                  .onSucceeded((message) => {
                    logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
                    messagesDispatcher({
                      type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
                      payload: message,
                    });
                    if (isBottom) {
                      setTimeout(() => {
                        utils.scrollIntoLast(0, scrollRef);
                      });
                    }
                  })
                  .onFailed((error, message) => {
                    logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', { message, error });
                    // @ts-ignore
                    message.localUrl = URL.createObjectURL(file);
                    // @ts-ignore
                    message.file = file;
                    messagesDispatcher({
                      type: messageActionTypes.SENDING_MESSAGE_FAILED,
                      payload: message,
                    });
                  });
              },
              file.type,
              compressionRate,
            );
          };
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
        currentOpenChannel.sendFileMessage(params)
          .onPending((pendingMessage) => {
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
              },
            });
          })
          .onSucceeded((message) => {
            logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
              payload: message,
            });
            if (isBottom) {
              setTimeout(() => {
                utils.scrollIntoLast(0, scrollRef);
              });
            }
          })
          .onFailed((error, message) => {
            logger.error('OpenChannel | useFileUploadCallback: Sending file message failed', { message, error });
            // @ts-ignore
            message.localUrl = URL.createObjectURL(file);
            // @ts-ignore
            message.file = file;
            messagesDispatcher({
              type: messageActionTypes.SENDING_MESSAGE_FAILED,
              payload: message,
            });
          });
      }
    }
  }, [currentOpenChannel, onBeforeSendFileMessage, checkScrollBottom, imageCompression]);
}

export default useFileUploadCallback;
