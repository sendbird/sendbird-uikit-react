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

const _MessageInputWrapper = (_props: MessageInputWrapperProps & (GroupChannelProviderInterface | ChannelProviderInterface)) => {
  /**
   * GroupChannelProviderInterface has currentChannel
   * ChannelProviderInterface has currentGroupChannel
   */
  const isContextFromGroupChannel = Object.hasOwn(_props, 'currentChannel');

  if (isContextFromGroupChannel) {
    const props = _props as MessageInputWrapperProps & GroupChannelProviderInterface;
    return (
      <MessageInputWrapperView
        {...props}
        isDisabled={props.disabled}
      />
    );
  } else {
    const props = _props as MessageInputWrapperProps & ChannelProviderInterface;
    return (
      <MessageInputWrapperView
        {...props}
        currentChannel={props.currentGroupChannel}
        sendUserMessage={props.sendMessage}
        isDisabled={props.disabled}
      />
    );
  }
};

export { VoiceMessageInputWrapper, VoiceMessageInputWrapperProps } from './VoiceMessageInputWrapper';

export const MessageInputWrapper = React.forwardRef(_MessageInputWrapper);
export default MessageInputWrapper;
