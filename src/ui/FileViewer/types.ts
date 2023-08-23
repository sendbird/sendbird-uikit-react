// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types

// TODO: refactor this to -> as const pattern
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

export interface BaseViewer {
  onClose: (e: React.MouseEvent) => void;
}

export interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
  viewerType?: typeof ViewerTypes.SINGLE;
  isByMe?: boolean;
  disableDelete?: boolean;
  onDelete: (e: React.MouseEvent) => void;
}

export interface MultiFilesViewer extends SenderInfo, BaseViewer {
  viewerType: typeof ViewerTypes.MULTI;
  fileInfoList: FileInfo[];
  currentIndex: number;
  onClickLeft: () => void;
  onClickRight: () => void;
}

export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
