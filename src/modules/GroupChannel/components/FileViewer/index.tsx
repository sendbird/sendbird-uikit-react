import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import { FileViewerView } from './FileViewerView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

export const FileViewer = (props: FileViewerProps) => {
  const { deleteMessage, onBeforeDownloadFileMessage } = useGroupChannelContext();
  const { config } = useSendbirdStateContext();
  const { logger } = config;
  return (
    <FileViewerView
      {...props}
      deleteMessage={deleteMessage}
      onDownloadClick={async (e) => {
        if (!onBeforeDownloadFileMessage) {
          return null;
        }
        try {
          const allowDownload = await onBeforeDownloadFileMessage({ message: props.message });
          if (!allowDownload) {
            e.preventDefault();
            logger.info?.('FileViewer: Not allowed to download.');
          }
        } catch (err) {
          logger.error?.('FileViewer: Error occurred while determining download continuation:', err);
        }
      }}
    />
  );
};

export default FileViewer;
