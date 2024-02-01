import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import { FileViewerView } from './FileViewerView';
import { SendableMessageType } from '../../../../utils';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
  deleteMessage: (message: SendableMessageType) => Promise<void>;
}

export const FileViewer = (props: FileViewerProps) => {
  return <FileViewerView {...props} />;
};

export default FileViewer;
