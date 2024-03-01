import './index.scss';
import React from 'react';
import { FileViewerProps } from '.';
import type { CoreMessageType, SendableMessageType } from '../../../../utils';
type DeleteMessageTypeLegacy = (message: CoreMessageType) => Promise<void>;
export interface FileViewerViewProps extends FileViewerProps {
    deleteMessage: ((message: SendableMessageType) => Promise<void>) | DeleteMessageTypeLegacy;
}
export declare const FileViewerView: ({ message, onCancel, deleteMessage, }: FileViewerViewProps) => React.ReactPortal;
export interface FileViewerUIProps {
    profileUrl: string;
    nickname: string;
    name: string;
    type: string;
    url: string;
    isByMe: boolean;
    onCancel: () => void;
    onDelete: () => void;
    disableDelete: boolean;
}
export declare const FileViewerComponent: ({ profileUrl, nickname, name, type, url, isByMe, onCancel, onDelete, disableDelete, }: FileViewerUIProps) => React.JSX.Element;
export {};
