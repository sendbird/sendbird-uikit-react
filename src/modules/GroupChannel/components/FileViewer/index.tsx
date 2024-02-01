import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import { FileViewerView } from './FileViewerView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

export const FileViewer = (props: FileViewerProps) => {
  const { deleteMessage } = useGroupChannelContext();
  return <FileViewerView {...props} deleteMessage={deleteMessage} />;
};

export default FileViewer;
