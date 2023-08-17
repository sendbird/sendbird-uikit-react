// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types

import { UploadedFileInfo } from "@sendbird/chat/message";

// to do reafctor this to -> as const pattern
export type SupportedImageMimesType = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/gif' | 'image/svg+xml' | 'image/webp';
export type SupportedVideoMimesType = 'video/mpeg' | 'video/ogg' | 'video/webm' | 'video/mp4';
export type SupportedMimesType = SupportedImageMimesType | SupportedVideoMimesType;

const SUPPORTED_MIMES = {
  IMAGE: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/svg+xml',
    'image/webp',
  ],
  VIDEO: [
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/mp4',
  ],
};

export const isImage = (type: SupportedImageMimesType): boolean => SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0;
export const isVideo = (type: SupportedVideoMimesType): boolean => SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0;
export const isGif = (type: SupportedMimesType): boolean => type === 'image/gif';
export const unSupported = (type: SupportedMimesType): boolean => (
  !(
    isImage(type as SupportedImageMimesType)
    || isVideo(type as SupportedVideoMimesType)
  )
);

export default { ...SUPPORTED_MIMES };

export const ViewerTypes = {
  SINGLE: 'SINGLE',
  MULTI: 'MULTI',
} as const;
export type ViewerType = keyof typeof ViewerTypes;

export interface SenderInfo {
  profileUrl: string;
  nickname: string;
}
export interface FileInfo {
  name: string;
  type: string;
  url: string;
}
export interface SingleFileViewer extends SenderInfo, FileInfo {
  // this is a type guard
  viewerType?: typeof ViewerTypes.SINGLE,
  isByMe?: boolean;
  disableDelete?: boolean;
  onClose: (e: MouseEvent) => void;
  onDelete: (e: MouseEvent) => void;
}

export interface MultiFileViewer extends SenderInfo {
  viewerType: typeof ViewerTypes.MULTI;
  onClose: (e: MouseEvent) => void;
  fileInfoList: UploadedFileInfo[];
  currentIndex: number;
  onClickLeft: () => void;
  onClickRight: () => void;
  // I added this
  isByMe?: boolean;
  // disableDelete?: boolean;
}

export type FileViewerComponentProps = SingleFileViewer | MultiFileViewer;
