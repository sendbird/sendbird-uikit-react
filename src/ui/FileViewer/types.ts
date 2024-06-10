// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types

// TODO: refactor this to -> as const pattern
import { MouseEvent } from 'react';

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
  onClose: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

export interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
  viewerType?: typeof ViewerTypes.SINGLE;
  isByMe?: boolean;
  disableDelete?: boolean;
  onDelete: (e: MouseEvent) => void;
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
}

export interface MultiFilesViewer extends SenderInfo, BaseViewer {
  viewerType: typeof ViewerTypes.MULTI;
  fileInfoList: FileInfo[];
  currentIndex: number;
  onClickLeft: () => void;
  onClickRight: () => void;
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
}

export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
