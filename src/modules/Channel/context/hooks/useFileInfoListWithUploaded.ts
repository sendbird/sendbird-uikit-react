import { SendingStatus } from '@sendbird/chat/message';
import { CoreMessageType } from '../../../../utils';
import { Thumbnail } from '@sendbird/chat/lib/__definition';

type StatefulFileInfo = {
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnails?: Thumbnail[];
  url?: string;
  isUploaded?: boolean;
};

export const useFileInfoListWithUploaded = (message: CoreMessageType): StatefulFileInfo[] => {
  if (!message.isMultipleFilesMessage()) return [];
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
