import React from 'react';
import MessageInputWrapperView from './MessageInputWrapperView';
import { GroupChannelUIBasicProps } from '../GroupChannelUI/GroupChannelUIView';
import { useGroupChannel } from '../../context/hooks/useGroupChannel';

export interface MessageInputWrapperProps {
  value?: string;
  disabled?: boolean;
  acceptableMimeTypes?: string[];
  renderFileUploadIcon?: GroupChannelUIBasicProps['renderFileUploadIcon'];
  renderVoiceMessageIcon?: GroupChannelUIBasicProps['renderVoiceMessageIcon'];
  renderSendMessageIcon?: GroupChannelUIBasicProps['renderSendMessageIcon'];
}

export const MessageInputWrapper = (props: MessageInputWrapperProps) => {
  const { state, actions } = useGroupChannel();
  return <MessageInputWrapperView {...props} {...state} { ...actions} />;
};

export { VoiceMessageInputWrapper, type VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';

export default MessageInputWrapper;
