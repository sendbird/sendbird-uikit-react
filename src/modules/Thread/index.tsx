import React from 'react';

import {
  ThreadProvider,
  ThreadProviderProps,
} from './context/ThreadProvider';
import ThreadUI, { ThreadUIProps } from './components/ThreadUI';

export interface ThreadProps extends ThreadProviderProps, ThreadUIProps {
  className?: string;
}

const Thread: React.FC<ThreadProps> = (props: ThreadProps) => {
  const {
    // props
    className,
    // ThreadProviderProps
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
    renderFileUploadIcon,
    renderVoiceMessageIcon,
    renderSendMessageIcon,
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
          renderFileUploadIcon={renderFileUploadIcon}
          renderVoiceMessageIcon={renderVoiceMessageIcon}
          renderSendMessageIcon={renderSendMessageIcon}
        />
      </ThreadProvider>
    </div>
  );
};

export default Thread;
