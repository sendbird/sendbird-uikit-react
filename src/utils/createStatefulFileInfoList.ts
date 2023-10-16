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

export function createStatefulFileInfoList(message: MultipleFilesMessage, oldStatefulFileInfoList: StatefulFileInfo[]): StatefulFileInfo[] {
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
    .map((fileInfo: UploadableFileInfo, index: number): StatefulFileInfo => ({
      fileName: fileInfo.fileName,
      fileSize: fileInfo.fileSize,
      mimeType: fileInfo.mimeType,
      /**
       * Note here, we prioritize using fileUrl (implying uploaded state) over file.
       * This is necessary because cache loaded pending/failed mfms is mixed with
       * files (not yet uploaded ones) and fileUrls (uploaded).
       *
       * Notice that if file is used in the old state, it will not be replace with the new fileUrl
       * because doing so will rerender the ImageRenderer component which makes rendering process awkward and slow.
       * */
      url: oldStatefulFileInfoList[index]?.url ?? fileInfo.fileUrl ?? (
        fileInfo.file instanceof Blob
          ? URL.createObjectURL(fileInfo.file)
          : undefined
      ),
      /**
       * Side note: It was a bad design to not include this property by SDK.
       * Because if original object has fileUrl set and no file, then uploaded result remains
       * the same so customer cannot know whether it has been uploaded or not.
       */
      isUploaded: !fileInfo.file && typeof fileInfo.fileUrl === 'string' && fileInfo.fileUrl.length > 0,
    }));
}
