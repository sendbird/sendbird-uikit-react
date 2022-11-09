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
    // ThreadUIProps
    renderHeader,
    renderParentMessageInfo,
    renderMessage,
    renderMessageInput,
    renderCustomSeparator,
    renderParentMessageInfoPlaceholder,
    renderThreadListPlaceHolder,
    onHeaderActionClick,
    onMoveToParentMessage,
  } = props;
  return (
    <div className={`sendbird-thread ${className}`}>
      <ThreadProvider
        channelUrl={channelUrl}
        message={message}
      >
        <ThreadUI
          onHeaderActionClick={onHeaderActionClick}
          onMoveToParentMessage={onMoveToParentMessage}
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
