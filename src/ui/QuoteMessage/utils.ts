import { CoreMessageType, isFileMessage, isMultipleFilesMessage } from '../../utils';
import { match } from 'ts-pattern';
import { FileMessage, MultipleFilesMessage, UploadedFileInfo } from '@sendbird/chat/message';
import { Thumbnail } from '@sendbird/chat/lib/__definition';

export function getMessageFirstFileType(message: CoreMessageType): string {
  return match(message)
    .when(isFileMessage, () => {
      return (message as FileMessage)?.type ?? '';
    })
    .when(isMultipleFilesMessage, () => {
      return getFirstFileInfo(message as MultipleFilesMessage)?.mimeType ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

function getFirstFileInfo(message: MultipleFilesMessage): UploadedFileInfo | null {
  const fileInfoList: UploadedFileInfo[] = message.fileInfoList;
  return fileInfoList.length > 0 ? fileInfoList[0] : null;
}

export function getMessageFirstFileName(message: CoreMessageType): string {
  return match(message)
    .when(isFileMessage, () => {
      return (message as FileMessage)?.name ?? '';
    })
    .when(isMultipleFilesMessage, () => {
      return getFirstFileInfo(message as MultipleFilesMessage)?.fileName ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

export function getMessageFirstFileUrl(message: CoreMessageType): string {
  return match(message)
    .when(isFileMessage, () => {
      return (message as FileMessage)?.url ?? '';
    })
    .when(isMultipleFilesMessage, () => {
      return getFirstFileInfo(message as MultipleFilesMessage)?.url ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

export function getMessageFirstFileThumbnails(message: CoreMessageType): Thumbnail[] {
  return match(message)
    .when(isFileMessage, () => {
      return (message as FileMessage).thumbnails;
    })
    .when(isMultipleFilesMessage, () => {
      return getFirstFileInfo(message as MultipleFilesMessage)?.thumbnails ?? [];
    })
    .otherwise(() => {
      return [];
    });
}

export function getMessageFirstFileThumbnailUrl(message: CoreMessageType): string {
  const thumbnails: Thumbnail[] = getMessageFirstFileThumbnails(message);
  return (thumbnails && thumbnails.length > 0) ? thumbnails[0].url : '';
}
