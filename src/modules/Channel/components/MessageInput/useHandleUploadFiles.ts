import { useCallback } from 'react';
import { Logger } from '../../../../lib/SendbirdState';
import { SendMFMFunctionType } from '../../context/hooks/useSendMultipleFilesMessage';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { SendableMessageType, isImage } from '../../../../utils';

/**
 * The handleUploadFiles is a function sending a FileMessage and MultipleFilesMessage
 * by the received FileList from the ChangeEvent of MessageInput component.
 */

const FILE_SIZE_LIMIT = 300000000; // 300MB

interface UseHandleUploadFilesDynamicProps {
  sendFileMessage: (file: File, quoteMessage?: SendableMessageType) => void;
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
  const uikitMultipleFilesMessageLimit = config?.uikitMultipleFilesMessageLimit ?? 15;

  const handleUploadeFiles = useCallback((fileList: FileList) => {
    const files: File[] = Array.from(fileList);

    if (!sendFileMessage || !sendMultipleFilesMessage) {
      logger.warning('Channel|useHandleUploadFiles: required functions are undefined', { sendFileMessage, sendMultipleFilesMessage });
      return;
    }
    if (files.length > 0) {
      if (files.length > uikitMultipleFilesMessageLimit) {
        logger.info(`Channel|useHandleUploadeFiles: Cannot upload files more than ${uikitMultipleFilesMessageLimit}`);
        return;
      }
      if (files.some((file: File) => file.size > FILE_SIZE_LIMIT)) {
        logger.info(`Channel|useHandleUploadeFiles: Cannot upload file size exceeding ${FILE_SIZE_LIMIT}`);
        return;
      }
    }

    if (files.length === 1) {
      const [file] = files;
      sendFileMessage(file, quoteMessage);
    } else if (files.length > 1) {
      const imageFiles: Array<File> = [];
      const otherFiles: Array<File> = [];
      files.forEach((file: File) => {
        if (isImage(file.type)) {
          imageFiles.push(file);
        } else {
          otherFiles.push(file);
        }
      });

      if (otherFiles.length > 0) {
        otherFiles.forEach((file: File) => {
          sendFileMessage(file, quoteMessage);
        });
      }
      if (imageFiles.length === 1) {
        sendFileMessage(imageFiles[0], quoteMessage);
      } else if (imageFiles.length > 1) {
        sendMultipleFilesMessage(imageFiles, quoteMessage);
      }
    }
  }, [
    sendFileMessage,
    sendMultipleFilesMessage,
    quoteMessage,
  ]);

  return [handleUploadeFiles];
};
