import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';
export interface FileViewerProps {
    onCancel: () => void;
    message: FileMessage;
}
export declare const FileViewer: (props: FileViewerProps) => React.JSX.Element;
export default FileViewer;
