import React from 'react';
import type { FileMessage } from '@sendbird/chat/message';
import { FileViewerView } from '../../../GroupChannel/components/FileViewer/FileViewerView';
import { useChannelContext } from '../../context/ChannelProvider';

export interface FileViewerProps {
  onCancel: () => void;
  message: FileMessage;
}

/**
 * @deprecated This component is deprecated and will be removed in the next major update.
 * Please use the `GroupChannel` component from '@sendbird/uikit-react/GroupChannel' instead.
 * For more information, please refer to the migration guide:
 * https://docs.sendbird.com/docs/chat/uikit/v3/react/introduction/group-channel-migration-guide
 */
export const FileViewer = (props: FileViewerProps) => {
  const { deleteMessage } = useChannelContext();
  return <FileViewerView {...props} deleteMessage={deleteMessage} />;
};

export default FileViewer;
