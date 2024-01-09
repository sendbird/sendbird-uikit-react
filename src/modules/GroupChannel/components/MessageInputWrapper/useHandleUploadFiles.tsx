import React, { useCallback } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { isImage, SendableMessageType } from '../../../../utils';
import { useGlobalModalContext } from '../../../../hooks/useModal';
import { ButtonTypes } from '../../../../ui/Button';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { ModalFooter } from '../../../../ui/Modal';
import { FileMessage, MultipleFilesMessage, MultipleFilesMessageCreateParams } from '@sendbird/chat/message';
import { compressImages } from '../../../../utils/compressImages';
import { FileMessageCreateParams } from '@sendbird/chat/lib/__definition';

/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */
interface useHandleUploadFilesDynamicProps {
  sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>;
  sendMultipleFilesMessage: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>;
  quoteMessage?: SendableMessageType;
}
interface useHandleUploadFilesStaticProps {
  logger: Logger;
}

export const useHandleUploadFiles = (
  { sendFileMessage, sendMultipleFilesMessage, quoteMessage }: useHandleUploadFilesDynamicProps,
  { logger }: useHandleUploadFilesStaticProps,
) => {
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const { imageCompression } = config;
  const uikitUploadSizeLimit = config?.uikitUploadSizeLimit;
  const uikitMultipleFilesMessageLimit = config?.uikitMultipleFilesMessageLimit;
  const { openModal } = useGlobalModalContext();

  return useCallback(
    async (files: File[]) => {
      if (files.length === 0) {
        logger.warning('Channel|useHandleUploadFiles: given file list is empty.', { files });
        return;
      }

      if (files.length > uikitMultipleFilesMessageLimit) {
        logger.info(`Channel|useHandleUploadFiles: Cannot upload files more than ${uikitMultipleFilesMessageLimit}`);
        openModal({
          modalProps: {
            titleText: `Up to ${uikitMultipleFilesMessageLimit} files can be attached.`,
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
      // Validate file sizes
      if (files.some((file: File) => file.size > uikitUploadSizeLimit)) {
        // The default value of uikitUploadSizeLimit is 26MB
        logger.info(`Channel|useHandleUploadFiles: Cannot upload file size exceeding ${uikitUploadSizeLimit}`);
        const ONE_MiB = 1024 * 1024;
        openModal({
          modalProps: {
            titleText: `The maximum size per file is ${Math.floor(uikitUploadSizeLimit / ONE_MiB)} MB.`,
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

      // Image Compression
      const { compressedFiles } = await compressImages({
        files,
        imageCompression,
        logger,
      });
      const sendingFiles = compressedFiles;

      // Send File Message
      if (sendingFiles.length === 1) {
        logger.info('Channel|useHandleUploadFiles: sending one file.');
        const [file] = sendingFiles;
        return sendFileMessage({ file, parentMessageId: quoteMessage.messageId });
      } else if (sendingFiles.length > 1) {
        logger.info('Channel|useHandleUploadFiles: sending multiple files.');

        // Divide to images & non-images
        const imageFiles: Array<File> = [];
        const otherFiles: Array<File> = [];
        sendingFiles.forEach((file: File) => {
          if (isImage(file.type)) {
            imageFiles.push(file);
          } else {
            otherFiles.push(file);
          }
        });

        return otherFiles.reduce(
          (previousPromise: Promise<MultipleFilesMessage | FileMessage | void>, item: File) => {
            return previousPromise.then(() => {
              return sendFileMessage({ file: item });
            });
          },
          (() => {
            if (imageFiles.length === 0) {
              return Promise.resolve();
            } else if (imageFiles.length === 1) {
              return sendFileMessage({ file: imageFiles[0] });
            } else {
              return sendMultipleFilesMessage({
                fileInfoList: imageFiles.map((file) => ({
                  file,
                  fileName: file.name,
                  fileSize: file.size,
                  mimeType: file.type,
                })),
                parentMessageId: quoteMessage.messageId,
              });
            }
          })(),
        );
      }
    },
    [sendFileMessage, sendMultipleFilesMessage],
  );
};
