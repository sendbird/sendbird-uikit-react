import { SendingStatus } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { UploadedFileInfoWithUpload } from '../../../../types';
import { useEffect, useRef } from 'react';

// SendingStatus.SCHEDULED is currently not covered in UIKit
//  So we can ignore for now, but for future, it is better to explicitly use PENDING, FAILED, or CANCELED.
export const useFileInfoListWithUploaded = (message: CoreMessageType): UploadedFileInfoWithUpload[] => {
  const blobHandler = useRef(new Map<number, string>());

  const getObjectURL = (index: number, blob?: Blob) => {
    if (!blobHandler.current.has(index) && blob) blobHandler.current.set(index, URL.createObjectURL(blob));
    return blobHandler.current.get(index);
  };

  const revokeURLs = () => {
    if (blobHandler.current.size > 0) {
      blobHandler.current.forEach((url) => URL.revokeObjectURL(url));
      blobHandler.current.clear();
    }
  };

  useEffect(() => {
    return () => revokeURLs();
  }, []);

  if (!message || !message.isMultipleFilesMessage || !message.isMultipleFilesMessage()) {
    return [];
  } else if (message.sendingStatus === SendingStatus.SUCCEEDED) {
    revokeURLs();

    return message.fileInfoList.map((it) => ({
      ...it,
      url: it.url,
      isUploaded: true,
    }));
  } else {
    return message.messageParams.fileInfoList.map((it, index) => ({
      ...it,
      url: getObjectURL(index) ?? it.fileUrl ?? (it.file instanceof Blob ? getObjectURL(index, it.file) : undefined),
      isUploaded: !it.file && typeof it.fileUrl === 'string' && it.fileUrl.length > 0,
    }));
  }
};
