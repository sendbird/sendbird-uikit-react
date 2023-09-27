import { MultipleFilesMessage, SendingStatus, UploadableFileInfo } from '@sendbird/chat/message';
import { Thumbnail } from '@sendbird/chat/lib/__definition';

export type StatefulFileInfo = {
  fileName?: string,
  fileSize?: number,
  mimeType?: string,
  thumbnails?: Thumbnail[];
  plainUrl?: string,
  url?: string,
  isUploaded?: boolean;
};

export function createStatefulFileInfoList(message: MultipleFilesMessage, oldStatefulFileInfo?: StatefulFileInfo[]) {
  if (!message) return null;
  if (message.sendingStatus === SendingStatus.SUCCEEDED) {
    return message.fileInfoList;
  }
  if (oldStatefulFileInfo) {
    const newStatefulFileInfo: StatefulFileInfo[] = [...oldStatefulFileInfo];
    message.messageParams.fileInfoList.forEach((fileInfo: UploadableFileInfo, index: number) => {
      newStatefulFileInfo[index].isUploaded = !fileInfo.file
        && typeof fileInfo.fileUrl === 'string'
        && fileInfo.fileUrl.length > 0;
    });
    return newStatefulFileInfo;
  }
  return message.messageParams.fileInfoList
    .map((fileInfo: UploadableFileInfo): StatefulFileInfo => ({
      fileName: fileInfo.fileName,
      fileSize: fileInfo.fileSize,
      mimeType: fileInfo.mimeType,
      plainUrl: fileInfo.fileUrl,
      url: fileInfo.file ? URL.createObjectURL(fileInfo.file as File) : undefined,
      isUploaded: !fileInfo.file && typeof fileInfo.fileUrl === 'string' && fileInfo.fileUrl.length > 0,
    }));
}
