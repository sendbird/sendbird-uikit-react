import React, { useCallback } from 'react';
import type { OpenChannel } from '@sendbird/chat/openChannel';
import type { FileMessageCreateParams } from '@sendbird/chat/message';

import type { Logger } from '../../../../lib/SendbirdState';
import type { ImageCompressionOptions } from '../../../../lib/Sendbird';
import * as messageActionTypes from '../dux/actionTypes';
import * as utils from '../utils';
import { SdkStore } from '../../../../lib/types';
import { compressImages } from '../../../../utils/compressImages';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useGlobalModalContext } from '../../../../hooks/useModal';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { ONE_MiB } from '../../../../utils/consts';
import { ModalFooter } from '../../../../ui/Modal';
import { ButtonTypes } from '../../../../ui/Button';

interface DynamicParams {
  currentOpenChannel: OpenChannel | null;
  onBeforeSendFileMessage?: (file: File) => FileMessageCreateParams;
  checkScrollBottom: () => boolean;
  imageCompression?: ImageCompressionOptions;
}
interface StaticParams {
  sdk: SdkStore['sdk'];
  logger: Logger;
  messagesDispatcher: (props: { type: string, payload: any }) => void;
  scrollRef: React.RefObject<HTMLElement>;
}

type CallbackReturn = (files: Array<File> | File) => void;

function useFileUploadCallback({
  currentOpenChannel,
  imageCompression = {},
  onBeforeSendFileMessage,
}: DynamicParams,
{ sdk, logger, messagesDispatcher, scrollRef }: StaticParams,
): CallbackReturn {
  const { stringSet } = useLocalization();
  const { openModal } = useGlobalModalContext();
  const { config } = useSendbirdStateContext();
  const { uikitUploadSizeLimit } = config;

  return useCallback(async (files) => {
    if (sdk) {
      /**
       * OpenChannel does not currently support file lists.
       * However, this change is made to maintain interface consistency with group channels.
       */
      const file = Array.isArray(files) ? files[0] : files;
      const createCustomParams = onBeforeSendFileMessage && typeof onBeforeSendFileMessage === 'function';

      const createParamsDefault = (file: File): FileMessageCreateParams => {
        const params: FileMessageCreateParams = {};
        params.file = file;
        return params;
      };

      /**
       * Validate file sizes
       * The default value of uikitUploadSizeLimit is 25MiB
       */
      if (file.size > uikitUploadSizeLimit) {
        logger.info(`OpenChannel | useFileUploadCallback: Cannot upload file size exceeding ${uikitUploadSizeLimit}`);
        openModal({
          modalProps: {
            titleText: stringSet.FILE_UPLOAD_NOTIFICATION__SIZE_LIMIT.replace('%d', `${Math.floor(uikitUploadSizeLimit / ONE_MiB)}`),
            hideFooter: true,
          },
          childElement: ({ closeModal }) => (
            <ModalFooter
              type={ButtonTypes.PRIMARY}
              submitText={stringSet.BUTTON__OK}
              hideCancelButton
              onCancel={closeModal}
              onSubmit={closeModal}
            />
          ),
        });
        return;
      }

      // Image compression
      const { compressedFiles } = await compressImages({
        files: [file],
        imageCompression,
        logger,
      });
      const [compressedFile] = compressedFiles;

      // Send FileMessage
      if (createCustomParams) {
        logger.info('OpenChannel | useFileUploadCallback: Creating params using onBeforeSendFileMessage', onBeforeSendFileMessage);
      }
      const params = onBeforeSendFileMessage ? onBeforeSendFileMessage(compressedFile) : createParamsDefault(compressedFile);
      logger.info('OpenChannel | useFileUploadCallback: Uploading file message start', params);

      currentOpenChannel?.sendFileMessage(params)
        .onPending((pendingMessage) => {
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_START,
            payload: {
              // TODO: remove data pollution
              message: {
                ...pendingMessage,
                url: URL.createObjectURL(file),
                // pending thumbnail message seems to be failed
                requestState: 'pending',
                isUserMessage: pendingMessage.isUserMessage,
                isFileMessage: pendingMessage.isFileMessage,
                isAdminMessage: pendingMessage.isAdminMessage,
                isMultipleFilesMessage: pendingMessage.isMultipleFilesMessage,
              },
              channel: currentOpenChannel,
            },
          });

          setTimeout(() => utils.scrollIntoLast(0, scrollRef));
        })
        .onSucceeded((message) => {
          logger.info('OpenChannel | useFileUploadCallback: Sending message succeeded', message);
          messagesDispatcher({
            type: messageActionTypes.SENDING_MESSAGE_SUCCEEDED,
            payload: message,
          });
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
  }, [currentOpenChannel, onBeforeSendFileMessage, imageCompression]);
}

export default useFileUploadCallback;
