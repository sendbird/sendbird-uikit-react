/// <reference types="react" />
export type SupportedImageMimesType = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/gif' | 'image/svg+xml' | 'image/webp';
export type SupportedVideoMimesType = 'video/mpeg' | 'video/ogg' | 'video/webm' | 'video/mp4';
export type SupportedMimesType = SupportedImageMimesType | SupportedVideoMimesType;
export declare const isImage: (type: string) => boolean;
export declare const isVideo: (type: string) => boolean;
export declare const isGif: (type: string) => boolean;
export declare const unSupported: (type: string) => boolean;
declare const _default: {
    IMAGE: string[];
    VIDEO: string[];
};
export default _default;
export declare const ViewerTypes: {
    readonly SINGLE: "SINGLE";
    readonly MULTI: "MULTI";
};
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
