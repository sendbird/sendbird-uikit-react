import React from 'react';

import {
  ThreadProvider,
  ThreadContextProps,
} from './context/ThreadProvider';
import ThreadUI, { ThreadUIProps } from './components/ThreadUI';

export interface ThreadProps extends ThreadContextProps, ThreadUIProps {
  className?: string;
}

const Thread: React.FC<ThreadProps> = (props: ThreadProps) => {
  const {
    // props
    className,
    // ThreadContextProps
    channelUrl,
    message,
    onHeaderActionClick,
    onMoveToParentMessage,
    // ThreadUIProps
    renderHeader,
    renderParentMessageInfo,
    renderMessage,
    renderMessageInput,
    renderCustomSeparator,
    renderParentMessageInfoPlaceholder,
    renderThreadListPlaceHolder,
  } = props;
  return (
    <div className={`sendbird-thread ${className}`}>
      <ThreadProvider
        channelUrl={channelUrl}
        message={message}
        onHeaderActionClick={onHeaderActionClick}
        onMoveToParentMessage={onMoveToParentMessage}
      >
        <ThreadUI
          renderHeader={renderHeader}
          renderParentMessageInfo={renderParentMessageInfo}
          renderMessage={renderMessage}
          renderMessageInput={renderMessageInput}
          renderCustomSeparator={renderCustomSeparator}
          renderParentMessageInfoPlaceholder={renderParentMessageInfoPlaceholder}
          renderThreadListPlaceHolder={renderThreadListPlaceHolder}
        />
      </ThreadProvider>
    </div>
  );
};

export default Thread;
