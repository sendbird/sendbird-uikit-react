import { useCallback } from 'react';
import { match } from 'ts-pattern';

import { Logger } from '../../../../lib/SendbirdState';
import { SendMFMFunctionType } from '../../context/hooks/useSendMultipleFilesMessage';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { SendableMessageType, isImage } from '../../../../utils';
// TODO: get SendFileMessageFunctionType from Channel
import { SendFileMessageFunctionType } from '../../../Thread/context/hooks/useSendFileMessage';

/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */

const FILE_SIZE_LIMIT = 300000000; // 300MB

interface UseHandleUploadFilesDynamicProps {
  sendFileMessage: SendFileMessageFunctionType;
  sendMultipleFilesMessage: SendMFMFunctionType;
  quoteMessage?: SendableMessageType;
}
interface UseHandleUploadFilesStaticProps {
  logger: Logger;
}
export type HandleUploadFunctionType = (files: FileList) => void;

export const useHandleUploadFiles = ({
  sendFileMessage,
  sendMultipleFilesMessage,
  quoteMessage,
}: UseHandleUploadFilesDynamicProps, {
  logger,
}: UseHandleUploadFilesStaticProps): Array<HandleUploadFunctionType> => {
  const { config } = useSendbirdStateContext();
  const uikitMultipleFilesMessageLimit = config?.uikitMultipleFilesMessageLimit;

  const handleUploadFiles = useCallback((fileList: FileList) => {
    const files: File[] = Array.from(fileList);

    // Validate Paremeters
    if (!sendFileMessage || !sendMultipleFilesMessage) {
      logger.warning('Channel|useHandleUploadFiles: required functions are undefined', { sendFileMessage, sendMultipleFilesMessage });
      return;
    }
    if (files.length === 0) {
      logger.warning('Channel|usehandleUploadFiles: given file list is empty.', { files });
      return;
    }
    if (files.length > uikitMultipleFilesMessageLimit) {
      logger.info(`Channel|usehandleUploadFiles: Cannot upload files more than ${uikitMultipleFilesMessageLimit}`);
      return;
    }
    if (files.some((file: File) => file.size > FILE_SIZE_LIMIT)) {
      logger.info(`Channel|usehandleUploadFiles: Cannot upload file size exceeding ${FILE_SIZE_LIMIT}`);
      return;
    }

    match(files.length)
      .when(n => n === 1, () => {
        const [file] = files;
        sendFileMessage(file, quoteMessage);
      })
      .when(n => n > 1, () => {
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
        if (otherFiles.length > 0) {
          otherFiles.forEach((file: File) => {
            sendFileMessage(file, quoteMessage);
          });
        }
      });
  }, [
    sendFileMessage,
    sendMultipleFilesMessage,
    quoteMessage,
  ]);

  return [handleUploadFiles];
};
