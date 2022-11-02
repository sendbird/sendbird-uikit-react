import React from 'react';

export interface ThreadUIProps {
  renderParentMessageInfo?: () => React.ReactElement;
  renderMessage?: () => React.ReactElement;
  renderMessageInput?: () => React.ReactElement;
  renderCustomSeparator?: () => React.ReactElement;
  renderPlaceHolderEmpty?: () => React.ReactElement;
  renderPlaceHolderLoader?: () => React.ReactElement;
  renderPlaceHolderInvalid?: () => React.ReactElement;
}

const ThreadUI: React.FC<ThreadUIProps> = ({

}: ThreadUIProps): React.ReactElement => {
  return (
    <div>
      {/* ParentMessageInfo */}
      {/* ThreadList */}
      {/* MessageInput */}
    </div>
  );
};

export default ThreadUI;
