import React, { useCallback } from 'react';

import { Logger } from '../../../../lib/SendbirdState';
import { SendMFMFunctionType } from '../../context/hooks/useSendMultipleFilesMessage';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { SendableMessageType, isImage } from '../../../../utils';
// TODO: get SendFileMessageFunctionType from Channel
import { SendFileMessageFunctionType } from '../../../Thread/context/hooks/useSendFileMessage';
import { useGlobalModalContext } from '../../../../hooks/useModal';
import { ButtonTypes } from '../../../../ui/Button';
import { useLocalization } from '../../../../lib/LocalizationContext';
import { ModalFooter } from '../../../../ui/Modal';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';

/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */

interface useHandleUploadFilesDynamicProps {
  sendFileMessage: SendFileMessageFunctionType;
  sendMultipleFilesMessage: SendMFMFunctionType;
  quoteMessage?: SendableMessageType;
}
interface useHandleUploadFilesStaticProps {
  logger: Logger;
}
export type HandleUploadFunctionType = (files: FileList) => void;

export const useHandleUploadFiles = ({
  sendFileMessage,
  sendMultipleFilesMessage,
  quoteMessage,
}: useHandleUploadFilesDynamicProps, {
  logger,
}: useHandleUploadFilesStaticProps): Array<HandleUploadFunctionType> => {
  const { stringSet } = useLocalization();
  const { config } = useSendbirdStateContext();
  const uikitUploadSizeLimit = config?.uikitUploadSizeLimit;
  const uikitMultipleFilesMessageLimit = config?.uikitMultipleFilesMessageLimit;
  const { openModal } = useGlobalModalContext();

  const handleUploadFiles = useCallback((fileList: FileList) => {
    const files: File[] = Array.from(fileList);

    // Validate Paremeters
    if (!sendFileMessage || !sendMultipleFilesMessage) {
      logger.warning('Channel|useHandleUploadFiles: required functions are undefined', { sendFileMessage, sendMultipleFilesMessage });
      return;
    }
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

    if (files.length === 1) {
      logger.info('Channel|useHandleUploadFiles: sending one file.');
      const [file] = files;
      sendFileMessage(file, quoteMessage);
    } else if (files.length > 1) {
      logger.info('Channel|useHandleUploadFiles: sending multiple files.');
      const imageFiles: Array<File> = [];
      const otherFiles: Array<File> = [];
      files.forEach((file: File) => {
        if (isImage(file.type)) {
          imageFiles.push(file);
        } else {
          otherFiles.push(file);
        }
      });

      if (imageFiles.length > 1) {
        sendMultipleFilesMessage(imageFiles, quoteMessage);
      } else if (imageFiles.length === 1) {
        sendFileMessage(imageFiles[0], quoteMessage);
      }
      for (let i = 0; i < otherFiles.length; i++) {
        sendFileMessage(otherFiles[i], quoteMessage);
      }
    }
  }, [
    sendFileMessage,
    sendMultipleFilesMessage,
    quoteMessage,
  ]);

  return [handleUploadFiles];
};
