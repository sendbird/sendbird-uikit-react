// Initializing status
import { UploadableFileInfo } from '@sendbird/chat/message';

export enum ChannelStateTypes {
  NIL = 'NIL',
  LOADING = 'LOADING',
  INVALID = 'INVALID',
  INITIALIZED = 'INITIALIZED',
}
export enum ParentMessageStateTypes {
  NIL = 'NIL',
  LOADING = 'LOADING',
  INVALID = 'INVALID',
  INITIALIZED = 'INITIALIZED',
}
export enum ThreadListStateTypes {
  NIL = 'NIL',
  LOADING = 'LOADING',
  INVALID = 'INVALID',
  INITIALIZED = 'INITIALIZED',
}

export interface FileUploadInfoParams {
  channelUrl: string,
  requestId: string,
  index: number,
  uploadableFileInfo: UploadableFileInfo,
  error: Error,
}
