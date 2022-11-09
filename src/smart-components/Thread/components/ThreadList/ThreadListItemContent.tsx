import React, { Dispatch, SetStateAction } from 'react';
import { FileMessage, UserMessage } from '@sendbird/chat/message';
import { GroupChannel } from '@sendbird/chat/groupChannel';

export interface ThreadListItemContentProps {
  className?: string;
  message: UserMessage | FileMessage;
  channel: GroupChannel;
  chainTop: boolean;
  chainBottom: boolean;
  setShowRemove: Dispatch<SetStateAction<boolean>>;
  setShowFileViewer: Dispatch<SetStateAction<boolean>>;
}

export default function ThreadListItemContent({
  className,
  message,
  channel,
  chainTop,
  chainBottom,
  setShowRemove,
  setShowFileViewer,
}: ThreadListItemContentProps): React.ReactElement {
  return (
    <div className="sendbird-thread-list-item-content">

    </div>
  );
}
