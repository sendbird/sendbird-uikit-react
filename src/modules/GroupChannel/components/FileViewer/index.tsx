import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';

import { useGroupChannel } from '../../context/hooks/useGroupChannel';
import { FileViewerView } from './FileViewerView';
import { useSendbird } from '../../../../lib/Sendbird/context/hooks/useSendbird';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

export const FileViewer = (props: FileViewerProps) => {
  const {
    state: { onBeforeDownloadFileMessage },
    actions: { deleteMessage },
  } = useGroupChannel();
  const { state: { config: { logger } } } = useSendbird();
  return (
    <FileViewerView
      {...props}
      deleteMessage={deleteMessage}
      onDownloadClick={async (e) => {
        if (!onBeforeDownloadFileMessage) return;

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
