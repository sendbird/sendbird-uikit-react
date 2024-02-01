import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { FileViewerView } from '../../../GroupChannel/components/FileViewer/FileViewerView';
import { useChannelContext } from '../../context/ChannelProvider';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

export const FileViewer = (props: FileViewerProps) => {
  const { deleteMessage } = useChannelContext();
  return <FileViewerView {...props} deleteMessage={deleteMessage} />;
};

export default FileViewer;
