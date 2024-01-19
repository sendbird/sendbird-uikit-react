import { SendingStatus } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { UploadedFileInfoWithUpload } from '../../../../types';

export const useFileInfoListWithUploaded = (message: CoreMessageType): UploadedFileInfoWithUpload[] => {
  if (!message || !message.isMultipleFilesMessage || !message.isMultipleFilesMessage()) return [];
  // SendingStatus.SCHEDULED is currently not covered in UIKit
  //  So we can ignore for now, but for future, it is better to explicitly use PENDING, FAILED, or CANCELED.
  else if (message.sendingStatus === SendingStatus.SUCCEEDED) {
    return message.fileInfoList.map((it) => ({
      ...it,
      url: it.url,
      isUploaded: true,
    }));
  } else {
    return message.messageParams.fileInfoList.map((it) => ({
      ...it,
      url: it.fileUrl ?? (it.file instanceof Blob ? URL.createObjectURL(it.file) : undefined),
      isUploaded: !it.file && typeof it.fileUrl === 'string' && it.fileUrl.length > 0,
    }));
  }
};
