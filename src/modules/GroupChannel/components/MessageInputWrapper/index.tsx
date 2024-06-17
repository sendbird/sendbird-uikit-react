import React from 'react';
import MessageInputWrapperView from './MessageInputWrapperView';
import { useGroupChannelContext } from '../../context/GroupChannelProvider';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  acceptableMimeTypes?: string[];
  renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
  renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
  renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}

export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const context = useGroupChannelContext();
  return <MessageInputWrapperView {...props} {...context} />;
};

// export {
//   VoiceMessageInputWrapper,
//   VoiceMessageInputWrapperProps,
// } from './VoiceMessageInputWrapper';

export default MessageInputWrapper;
