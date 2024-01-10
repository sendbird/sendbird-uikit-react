import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { FileViewerView } from './FileViewerView';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

export const FileViewer = (props: FileViewerProps) => {
  const { deleteMessage } = useGroupChannelContext();

  return (
    <FileViewerView
      {...props}
      deleteMessage={deleteMessage}
    />
  );
};

export default FileViewer;
