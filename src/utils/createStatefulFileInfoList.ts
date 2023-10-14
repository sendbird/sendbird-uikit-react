import { MultipleFilesMessage, SendingStatus, UploadableFileInfo, UploadedFileInfo } from '@sendbird/chat/message';
import { Thumbnail } from '@sendbird/chat/lib/__definition';

export type StatefulFileInfo = {
  fileName?: string,
  fileSize?: number,
  mimeType?: string,
  thumbnails?: Thumbnail[];
  url?: string,
  isUploaded?: boolean;
};

export function createStatefulFileInfoList(message: MultipleFilesMessage): StatefulFileInfo[] {
  if (!message) return null;

  // Handle sent messages.
  if (message.sendingStatus === SendingStatus.SUCCEEDED) {
    return message.fileInfoList.map((fileInfo: UploadedFileInfo) => {
      return {
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        thumbnails: fileInfo.thumbnails,
        url: fileInfo.url,
        isUploaded: true,
      };
    });
  }
  // Handle unsent message.
  if (!Array.isArray(message.messageParams?.fileInfoList)) return null;
  return message.messageParams.fileInfoList
    .map((fileInfo: UploadableFileInfo): StatefulFileInfo => ({
      fileName: fileInfo.fileName,
      fileSize: fileInfo.fileSize,
      mimeType: fileInfo.mimeType,
      url: fileInfo.fileUrl,
      /**
       * Side note: It was a bad design to not include this property by SDK.
       * Because if original object has fileUrl set and no file, then uploaded result remains
       * the same so customer cannot know whether it has been uploaded or not.
       */
      isUploaded: !fileInfo.file && typeof fileInfo.fileUrl === 'string' && fileInfo.fileUrl.length > 0,
    }));
}
