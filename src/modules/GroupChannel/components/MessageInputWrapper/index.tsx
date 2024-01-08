import React from 'react';

import type { ChannelProviderInterface } from '../../../Channel/context/ChannelProvider';
import type { GroupChannelProviderInterface } from '../../context/GroupChannelProvider';
import { MessageInputWrapperView } from './MessageInputWrapperView';

export type MessageInputWrapperProps = {
  disabled?: boolean;
  renderFileUploadIcon?: () => React.ReactElement;
  renderVoiceMessageIcon?: () => React.ReactElement;
  renderSendMessageIcon?: () => React.ReactElement;
};

export const MessageInputWrapper = (props: MessageInputWrapperProps & (GroupChannelProviderInterface | ChannelProviderInterface)) => {
  /**
   * GroupChannelProviderInterface has currentChannel
   * ChannelProviderInterface has currentGroupChannel
   */
  const isLegacyChannel = Object.hasOwn(props, 'currentGroupChannel');

  if (!isLegacyChannel) {
    const { disabled } = props as MessageInputWrapperProps & GroupChannelProviderInterface;
    return (
      <MessageInputWrapperView
        {...props as MessageInputWrapperProps & GroupChannelProviderInterface}
        isDisabled={disabled}
      />
    );
  } else {
    const {
      currentGroupChannel,
      sendMessage,
      disabled
    } = props as MessageInputWrapperProps & ChannelProviderInterface;
    return (
      <MessageInputWrapperView
        {...props as MessageInputWrapperProps & ChannelProviderInterface}
        currentChannel={currentGroupChannel}
        sendUserMessage={sendMessage}
        isDisabled={disabled}
      />
    );
  }
};

export { VoiceMessageInputWrapper, VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';

export default MessageInputWrapper;
