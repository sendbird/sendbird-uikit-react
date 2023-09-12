import {CoreMessageType, isFileMessage, isMultipleFilesMessage} from "../../utils";
import {match} from "ts-pattern";
import {FileMessage, MultipleFilesMessage, UploadedFileInfo} from "@sendbird/chat/message";
import {Thumbnail} from "@sendbird/chat/lib/__definition";

export function getMessageFirstFileType(message: CoreMessageType): string {
  return match(message)
    .when(m => isFileMessage(m), () => {
      return (message as FileMessage)?.type ?? '';
    })
    .when(m => isMultipleFilesMessage(m), () => {
      const castedMessage: MultipleFilesMessage = message as MultipleFilesMessage;
      return getFirstFileInfo(castedMessage)?.mimeType ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

function getFirstFileInfo(message: MultipleFilesMessage): UploadedFileInfo {
  const fileInfoList: UploadedFileInfo[] = message.fileInfoList;
  return fileInfoList.length > 0 ? fileInfoList[0] : null;
}

export function getMessageFirstFileName(message: CoreMessageType): string {
  return match(message)
    .when(m => isFileMessage(m), () => {
      const castedMessage: FileMessage = message as FileMessage;
      return castedMessage?.name ?? '';
    })
    .when(m => isMultipleFilesMessage(m), () => {
      const castedMessage: MultipleFilesMessage = message as MultipleFilesMessage;
      return getFirstFileInfo(castedMessage)?.fileName ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

export function getMessageFirstFileUrl(message: CoreMessageType): string {
  return match(message)
    .when(m => isFileMessage(m), () => {
      const castedMessage: FileMessage = message as FileMessage;
      return castedMessage?.url ?? '';
    })
    .when(m => isMultipleFilesMessage(m), () => {
      const castedMessage: MultipleFilesMessage = message as MultipleFilesMessage;
      return getFirstFileInfo(castedMessage)?.url ?? '';
    })
    .otherwise(() => {
      return '';
    });
}

export function getMessageFirstFileThumbnails(message: CoreMessageType): Thumbnail[] {
  return match(message)
    .when(m => isFileMessage(m), () => {
      const castedMessage: FileMessage = message as FileMessage;
      return castedMessage.thumbnails;
    })
    .when(m => isMultipleFilesMessage(m), () => {
      const castedMessage: MultipleFilesMessage = message as MultipleFilesMessage;
      return getFirstFileInfo(castedMessage)?.thumbnails ?? [];
    })
    .otherwise(() => {
      return [];
    });
}

export function getMessageFirstFileThumbnailUrl(message: CoreMessageType): string {
  const thumbnails: Thumbnail[] = getMessageFirstFileThumbnails(message);
  return (thumbnails && thumbnails.length > 0) ? thumbnails[0].url : '';
}